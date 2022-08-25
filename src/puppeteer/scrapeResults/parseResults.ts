import { Page } from "puppeteer";
import { ResultEntity } from "../../types";

const parseResults = async (
  page: Page,
  day: string,
  month: string,
  year: string
): Promise<ResultEntity[]> => {
  // Enable log inside page evaluate
  page.on("console", async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });

  // Format: "30. 04. 2022"
  const dateFormatToMatch = `${day}. ${month}. ${year}`;

  // Parse matches
  const results: ResultEntity[] = await page.evaluate(
    (dateFormatToMatch: string) => {
      // Multiple tabs, make sure selected tab is today's matches
      const tabs = [...document.querySelectorAll(".tab")];
      const dates = tabs.map((tab) => tab.textContent);
      const tabIndex = dates.indexOf(dateFormatToMatch);

      // Rows are either tournament headers or players in match
      const table = document.querySelectorAll(".content .result tbody")[
        tabIndex
      ];
      const rows = table.querySelectorAll("tbody tr");

      // Entities to populate with scraped data & return
      let results: ResultEntity[] = [];

      // Keep track of entities to push to arrays
      let result: ResultEntity = {} as ResultEntity;

      // Keep track of tournament data shared between matches
      let currentTournament: string | undefined = undefined;
      let currentTournamentLink: string | undefined = undefined;

      // Tournaments & other filters to exclude
      const excludeKeywords = ["future", "utr"];

      for (const row of rows) {
        // Row is tournament header
        if (row.className === "head flags") {
          // Tournament name
          const tournamentName =
            (row.querySelector("a")?.textContent ||
              row.querySelector(".t-name")?.textContent) ??
            undefined;

          // Tournament name
          currentTournament = tournamentName
            ?.replace(/[\n\r]+|[\s]{2,}/g, " ")
            .trim();

          // Tournament link & ID
          currentTournamentLink =
            row.querySelector("a")?.getAttribute("href") ?? undefined;
        }

        // Row is a player from a match
        else {
          // Row is winner
          if (row.className.includes("bott")) {
            // Winner name
            const winner =
              row.querySelector("td[class*='t-name'] > a")?.textContent ??
              undefined;

            // Home link
            const winnerLink =
              row
                .querySelector("td[class*='t-name'] > a")
                ?.getAttribute("href") ?? undefined;

            // Winner sets
            const winnerSets = Number(
              row.querySelector("td[class*='result']")?.textContent ?? 0
            );

            // Match link
            const matchLink =
              row
                .querySelector("a[href*='match-detail']")
                ?.getAttribute("href") ?? undefined;

            // Match ID
            const matchId = matchLink?.split("/match-detail/?id=")[1];

            // Update match with home fields
            result = {
              ...result,
              matchId,
              matchLink,
              winner,
              winnerLink,
              winnerSets,
            } as ResultEntity;
          }

          // Row is the loser player
          else {
            // Loser name
            const loser =
              row.querySelector("td[class*='t-name'] > a")?.textContent ??
              undefined;

            // Loser link
            const loserLink =
              row
                .querySelector("td[class*='t-name'] > a")
                ?.getAttribute("href") ?? undefined;

            // Loset sets
            const loserSets = Number(
              row.querySelector("td[class*='result']")?.textContent ?? 0
            );

            // Update match with away fields
            result = {
              ...result,
              loser,
              loserLink,
              loserSets,
            } as ResultEntity;
          }
        }

        const isExcluded = excludeKeywords.some((keyword) =>
          currentTournament?.toLowerCase().includes(keyword)
        );

        // If both winner and loser data collected & nonexcluded tourney push to array
        // The loser player contains a "b" on the id e.g. id="r10b"
        // The loser row comes after the winner row
        if (!isExcluded && row.id.includes("b")) {
          result = {
            ...result,
            tournament: currentTournament,
            tournamentLink: currentTournamentLink,
          } as ResultEntity;

          // Push entity to matches
          results.push(result);

          // Reset entity fields
          result = {} as ResultEntity;
        }
      }

      return results;
    },
    dateFormatToMatch
  );

  return results;
};
export { parseResults };
