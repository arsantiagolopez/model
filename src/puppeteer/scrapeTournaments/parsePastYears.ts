import { Cluster } from "puppeteer-cluster";
import {
  MatchEntity,
  MatchResult,
  PastYearResult,
  TournamentEntity,
} from "../../types";

// Get tournament past years

const parsePastYears = async (
  links: string[],
  cluster: Cluster<any, any>,
  tournaments: TournamentEntity[]
): Promise<PastYearResult[]> => {
  let pastYearsResults: PastYearResult[] = [];

  // Crawl 2: Cluster to get past year results
  const getPastYearResults = async ({
    page,
    data: { url, tournamentId },
  }: any) => {
    // Go to past year tournament page
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const link = url.replace("https://tennisexplorer.com", "");

    // Remove base URL from tournamentId
    tournamentId = tournamentId.replace("https://www.tennisexplorer.com", "");

    // Tournament year
    const year = link?.split("/")[2];

    // Enable log inside page evaluate
    // @ts-ignore
    page.on("console", async (msg) => {
      const msgArgs = msg.args();
      for (let i = 0; i < msgArgs.length; ++i) {
        console.log(await msgArgs[i].jsonValue());
      }
    });

    // Past matches of year
    const matches = await page.evaluate(() => {
      // Get results wrapper
      const table = document.querySelector("table[class*='result']")!;

      // Rows are either home or away player, excludes separator rows
      const rows = table.querySelectorAll(
        "tbody > tr:not(tr[class*='inTable'])"
      );

      let pastMatches: MatchEntity[] = [];

      // Keep track of current match & match result
      let match = {} as MatchEntity;
      let currentResult: MatchResult = {} as MatchResult;

      for (const row of rows) {
        // Row is home: Get match details & home sets & games
        if (!row.id.includes("b")) {
          // Match date
          const date =
            row.querySelector("td[class='first time']")?.textContent ??
            undefined;

          // Match round
          const round =
            row.querySelectorAll("tr > td")[1]?.textContent ?? undefined;

          // Match home player
          const home =
            row.querySelector("td[class*='t-name'] > a")?.textContent ??
            undefined;

          // Match winner
          const winner = home;

          // Match home link
          const homeLink =
            row
              .querySelector("td[class*='t-name'] > a")
              ?.getAttribute("href") ?? undefined;

          // Match home odds
          const homeOdds = Number(
            row.querySelector("td[class*='course best']")?.textContent ?? 0
          );

          // Match away odds
          const awayOdds = Number(
            row.querySelector("td[class='course']")?.textContent ?? 0
          );

          // Match link
          const matchLink =
            row
              .querySelector("a[href*='match-detail']")
              ?.getAttribute("href") ?? undefined;

          // Match ID
          const matchId = matchLink?.split("/match-detail/?id=")[1];

          // Results
          // Home sets
          const homeSets = Number(
            row.querySelector("td[class*='result']")?.textContent ?? 0
          );

          // Get games per set
          const homeGames = row.querySelectorAll("td[class*='score'");
          const homeGamesFirstSet =
            Number(homeGames[0]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGames[0]?.textContent ?? 0);
          const homeGamesSecondSet =
            Number(homeGames[1]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGames[1]?.textContent ?? 0);
          const homeGamesThirdSet =
            Number(homeGames[2]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGames[2]?.textContent ?? 0);
          const homeGamesFourthSet =
            Number(homeGames[3]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGames[3]?.textContent ?? 0);
          const homeGamesFifthSet =
            Number(homeGames[4]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGames[4]?.textContent ?? 0);

          // Update match result
          currentResult = {
            ...currentResult,
            homeSets,
            homeGamesFirstSet,
            homeGamesSecondSet,
            homeGamesThirdSet,
            homeGamesFourthSet,
            homeGamesFifthSet,
          };

          // Update match home fields
          match = {
            ...match,
            date,
            round,
            winner,
            home,
            homeLink,
            matchLink,
            matchId,
            homeOdds,
            awayOdds,
            result: currentResult,
          } as MatchEntity;
        }

        // Row is away: Get sets & games
        else {
          // Match away
          const away =
            row.querySelector("td[class*='t-name'] > a")?.textContent ?? 0;

          // Match away link
          const awayLink =
            row
              .querySelector("td[class*='t-name'] > a")
              ?.getAttribute("href") ?? undefined;

          // Match away sets
          const awaySets = Number(
            row.querySelector("td[class*='result']")?.textContent ?? 0
          );

          // Get games per set
          const awayGames = row.querySelectorAll("td[class*='score'");
          const awayGamesFirstSet =
            Number(awayGames[0]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGames[0]?.textContent ?? 0);
          const awayGamesSecondSet =
            Number(awayGames[1]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGames[1]?.textContent ?? 0);
          const awayGamesThirdSet =
            Number(awayGames[2]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGames[2]?.textContent ?? 0);
          const awayGamesFourthSet =
            Number(awayGames[3]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGames[3]?.textContent ?? 0);
          const awayGamesFifthSet =
            Number(awayGames[4]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGames[4]?.textContent ?? 0);

          // Update match result
          currentResult = {
            ...currentResult,
            awaySets,
            awayGamesFirstSet,
            awayGamesSecondSet,
            awayGamesThirdSet,
            awayGamesFourthSet,
            awayGamesFifthSet,
          };

          // Update match away fields
          match = {
            ...match,
            away,
            awayLink,
            result: currentResult,
          } as MatchEntity;
        }

        if (row.id.includes("b")) {
          // Push match to results
          pastMatches.push(match as MatchEntity);

          // Reset entity fields
          match = {} as MatchEntity;
          currentResult = {} as MatchResult;
        }
      }

      return pastMatches;
    });

    pastYearsResults.push({ tournamentId, year, link, matches });
  };

  // Get past year results for each tournament
  tournaments.map(({ pastYearsResults: years }) =>
    years?.map(({ link, year, tournamentId }) => {
      // Only go in after all tournaments have been pushed to array
      const allTourneysInArray = tournaments.length === links.length;
      if (allTourneysInArray) {
        console.log(`Going in to ${year} & link: ${link}`);

        // Crawl 2: Initialization: Deep nested crawl to get tournament matches
        cluster.queue(
          { url: "https://tennisexplorer.com" + link, tournamentId },
          getPastYearResults
        );
      }
    })
  );

  return pastYearsResults;
};

export { parsePastYears };
