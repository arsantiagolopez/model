import { Page } from "puppeteer";
import {
  MatchEntity,
  PlayerEntity,
  ScrapeScheduleResponse,
  TournamentEntity,
} from "../../types";

const parseTournamentsMatchesAndPlayers = async (
  page: Page,
  day: string,
  month: string,
  year: string
): Promise<ScrapeScheduleResponse> => {
  // Enable log inside page evaluate
  page.on("console", async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });

  // Format: "30. 04. 2022"
  const dateFormatToMatch = `${day}. ${month}. ${year}`;

  // Parse schedule
  const schedule: ScrapeScheduleResponse = await page.evaluate(
    (dateFormatToMatch: string) => {
      // Multiple tabs, make sure selected tab is tomorrow's matches
      const tabs = [...document.querySelectorAll(".tab")];
      const dates = tabs.map((tab) => tab.textContent);
      const tabIndex = dates.indexOf(dateFormatToMatch);

      // Rows are either tournament headers or players in match
      const table = document.querySelectorAll(".content .result tbody")[
        tabIndex
      ];
      const rows = table.querySelectorAll("tbody tr");

      // Entities to populate with scraped data & return
      let tournaments: TournamentEntity[] = [];
      let matches: MatchEntity[] = [];
      let players: PlayerEntity[] = [];

      // Keep track of tournament data shared between matches
      let currentType: string | undefined = undefined;
      let currentTournament: string | undefined = undefined;
      let currentTournamentLink: string | undefined = undefined;
      let currentSex: string | undefined = undefined;

      // Keep track of entities to push to arrays
      let match: MatchEntity = {} as MatchEntity;
      let homePlayer: PlayerEntity = {} as PlayerEntity;
      let awayPlayer: PlayerEntity = {} as PlayerEntity;

      for (const row of rows) {
        // Row is tournament header
        if (row.className === "head flags") {
          const tournamentName =
            row.querySelector("a")?.textContent ||
            row.querySelector(".t-name")?.textContent;

          // Tournament name
          currentTournament = tournamentName
            ?.replace(/[\n\r]+|[\s]{2,}/g, " ")
            .trim();

          // Tournament link & ID
          currentTournamentLink =
            row.querySelector("a")?.getAttribute("href") ?? undefined;

          // Tournament country
          const countryCode = row
            .querySelector(".fl")
            ?.className.replace("fl fl-", "");

          // Tournament type
          let currentType = row.querySelector(
            "span[class*='type-']"
          )?.className;
          currentType = currentType?.split("type-")[1];

          // Sex
          let sex = "men";

          /**
           * Type glossary
           * -------------------------
           * 1. "men2" - Men singles
           * 2. "men4" - Men doubles
           * 3. "women2" - Women singles
           * 4. "women4" - Women doubles
           */

          switch (currentType) {
            case "men2":
              currentType = "singles";
              sex = "men";
              break;
            case "men4":
              currentType = "doubles";
              sex = "men";
              break;
            case "women2":
              currentType = "singles";
              sex = "women";
              break;
            case "women4":
              currentType = "doubles";
              sex = "women";
              break;
          }

          // Update current sex value
          currentSex = sex;

          const tournament = {
            tournamentId: currentTournamentLink,
            name: currentTournament,
            type: currentType,
            countryCode,
            sex,
          };

          // Push new tournament to array
          tournaments.push(tournament as TournamentEntity);
        }

        // Row is a player from a match
        else {
          // Row is home & contains odds info & match link
          if (row.className.includes("bott")) {
            // Get date string & convert to Date object
            // Date could be in format "hh:mm" or "--:--" if date is TBD
            let date: string | Date | undefined = row
              .querySelector("td[class='first time']")
              ?.textContent?.slice(0, 5);

            // Omit date if not valid
            if (date?.includes("--:--")) {
              // Don't include date
              date = undefined;
            }

            // Home name
            const home =
              row.querySelector("td[class*='t-name'] > a")?.textContent ??
              undefined;

            // Home link
            const homeLink =
              row
                .querySelector("td[class*='t-name'] > a")
                ?.getAttribute("href") ?? undefined;

            // Home head 2 head value
            const homeH2h = Number(
              row.querySelector("td[class*='h2h']")?.textContent
            );

            // Get odds & info
            // Home decimal odds
            const homeOdds = Number(
              row.querySelectorAll("td[class*='course']")[0]?.textContent
            );

            // Away decimal odds
            const awayOdds = Number(
              row.querySelectorAll("td[class*='course']")[1]?.textContent
            );

            // Match link
            const matchLink =
              row
                .querySelector("a[href*='match-detail']")
                ?.getAttribute("href") ?? undefined;

            // Match ID
            const matchId = matchLink?.split("/match-detail/?id=")[1];

            // Update match with home fields
            match = {
              ...match,
              matchId,
              date,
              home,
              homeLink,
              homeH2h,
              homeOdds,
              awayOdds,
              matchLink,
            } as MatchEntity;

            // Update home player entity
            homePlayer = {
              ...homePlayer,
              playerId: homeLink,
              profile: {
                name: home,
                sex: currentSex === "men" ? "man" : "woman",
              },
            } as PlayerEntity;
          }
          // Row is away
          else {
            // Away name
            const away =
              row.querySelector("td[class*='t-name'] > a")?.textContent ??
              undefined;

            // Away link
            const awayLink =
              row
                .querySelector("td[class*='t-name'] > a")
                ?.getAttribute("href") ?? undefined;

            // Away head 2 head value
            const awayH2h = Number(
              row.querySelector("td[class*='h2h']")?.textContent
            );

            // Update match with away fields
            match = {
              ...match,
              away,
              awayLink,
              awayH2h,
            } as MatchEntity;

            // Update away player entity
            awayPlayer = {
              ...awayPlayer,
              playerId: awayLink,
              profile: {
                name: away,
                sex: currentSex === "men" ? "man" : "woman",
              },
            } as PlayerEntity;
          }
        }

        // If both home and away data collected, push to array
        // Away players contain a "b" on the id e.g. id="r10b"
        // Away players come after home players
        if (row.id.includes("b")) {
          match = {
            ...match,
            type: currentType,
            tournament: currentTournament,
            tournamentLink: currentTournamentLink,
          } as MatchEntity;

          // Push entities if odds available
          if (match.homeOdds && match.awayOdds) {
            // Push match
            matches.push(match);

            // Push home player
            players.push(homePlayer);

            // Push away player
            players.push(awayPlayer);
          }

          // Reset entity fields
          match = {} as MatchEntity;
          homePlayer = {} as PlayerEntity;
          awayPlayer = {} as PlayerEntity;
        }
      }

      return {
        tournaments,
        matches,
        players,
      };
    },
    dateFormatToMatch
  );

  return schedule;
};
export { parseTournamentsMatchesAndPlayers };
