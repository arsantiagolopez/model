import { Page } from "puppeteer";
import {
  MatchEntity,
  MatchResult,
  PastYearResult,
  RoundPrizeRank,
  TournamentEntity,
} from "../../types";

// Get tournament overview, next matches, results, and details

const parseTournament = async (
  page: Page,
  url: string
): Promise<TournamentEntity> => {
  // Enable log inside page evaluate
  page.on("console", async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });

  // Parse tournament
  let tournament: TournamentEntity = await page.evaluate((url: string) => {
    /**********************************
     * Section - Get tournament overview
     **********************************/

    // Tournament name
    const title =
      document.querySelector("#center > h1")?.textContent ?? undefined;

    // Remove the 4 digit year with a trailing whitespace
    const name = title?.split(" (")[0].replace(/\s*\d{4}\b/g, "");

    // Tournament country
    const country = title?.split("(")[1]?.replace(")", "")?.toLowerCase();

    const detailsStr = document.querySelector("#center > div.box")?.textContent;

    // Tournament prize
    const prize = `${detailsStr?.split(" ")[0].replace("(", "")} ${detailsStr
      ?.split(" ")[1]
      .replace(",", "")}`;

    // Tournament surface
    const surface = detailsStr?.split(" ")[2].replace(",", "");

    // Tournament sex
    const sex = detailsStr?.split(" ")[3].replace(",", "").replace(")", "");

    // Tournament ID is the end of URL
    const tournamentId = url.replace("https://www.tennisexplorer.com", "");

    // Get year results links
    const yearsWrapper = document.querySelector("div[class*='tour-years']");

    // Get last 5 five years only
    const yearLinkTags = yearsWrapper?.querySelectorAll("a");

    // Get past year results
    let years: PastYearResult[] = [];

    if (yearLinkTags) {
      for (const [index, yearLinkTag] of yearLinkTags?.entries()) {
        if (index < 5) {
          const year = yearLinkTag.textContent
            ? "20" + yearLinkTag.textContent
            : undefined;
          const link = yearLinkTag.getAttribute("href") ?? undefined;
          years[index] = { tournamentId, year, link } as PastYearResult;
        }
      }
    }

    /**********************************
     * Section - Get next matches
     **********************************/

    let nextMatches: MatchEntity[] = [];

    // Next matches table is alwats the first table on page
    const nextTable = document.querySelector("table.result")!;

    // Rows are upcoming matches
    const nextRows = nextTable?.querySelectorAll(
      "tbody > tr:not(tr[class*='inTable'])"
    );

    // First row is always the header, so table must have have at least 2 items
    if (nextRows?.length > 1) {
      // Every row is a match
      for (const row of nextRows) {
        // Next match date
        const date =
          row.querySelector("td[class='first time']")?.textContent ?? undefined;

        // Match round
        const round =
          row.querySelector("td[class='round']")?.textContent ?? undefined;

        const matchWrapper = row.querySelector("a[href*='match-detail']");

        // Match link
        const matchLink = matchWrapper?.getAttribute("href") ?? undefined;

        // Match ID
        const matchId = matchLink?.split("/match-detail/?id=")[1];

        const headline = matchWrapper?.textContent;

        // Match home player
        let home = headline?.split(" - ")[0];
        // Strip potential seed numbers
        home = home?.includes("(") ? home?.replace(/\(.*?\)/g, "") : home;

        // Match away player
        let away = headline?.split(" - ")[1];
        away = away?.includes("(") ? away?.replace(/\(.*?\)/g, "") : away;

        const h2h = row.querySelector("td[class='h2h'")?.textContent;

        // Match home head 2 head
        const homeH2h = Number(h2h?.split("-")[0] ?? 0);

        // Match away head 2 head
        const awayH2h = Number(h2h?.split("-")[1] ?? 0);

        // Match home odds
        const homeOdds = Number(
          row.querySelectorAll("td[class*='course']")[0]?.textContent ?? 0
        );

        // Match away odds
        const awayOdds = Number(
          row.querySelectorAll("td[class*='course']")[1]?.textContent ?? 0
        );

        const match: MatchEntity = {
          matchId,
          date,
          round,
          home,
          away,
          homeH2h,
          awayH2h,
          homeOdds,
          awayOdds,
          matchLink,
        } as MatchEntity;

        nextMatches.push(match as MatchEntity);
      }
    }

    /**********************************
     * Section - Get results
     **********************************/

    // Results table is always second table on page
    const resultsTable = document.querySelectorAll("table.result")[1];

    // Rows are either home or away player, excludes separator rows
    const resultsRows = resultsTable?.querySelectorAll("tbody > tr");

    let results: MatchEntity[] = [];

    // Keep track of current match & match result
    let match: MatchEntity = {} as MatchEntity;
    let currentResult: MatchResult = {} as MatchResult;

    // First row is always the header, so table must have have at least 2 items
    if (resultsRows.length > 1) {
      for (const row of resultsRows) {
        // Row is home: Get match details & home gets & games
        if (!row.id.includes("b")) {
          // Result match date
          const date =
            row.querySelector("td[class='first time']")?.textContent ??
            undefined;

          // Match round
          const round =
            row.querySelectorAll("tr > td")[1].textContent ?? undefined;

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
            homeOdds,
            awayOdds,
            matchLink,
            matchId,
            result: currentResult,
          } as MatchEntity;
        }

        // Row is away: Get sets & games
        else {
          // Match away
          const away =
            row.querySelector("td[class*='t-name'] > a")?.textContent ??
            undefined;

          // Match away link
          const awayLink =
            row
              .querySelector("td[class*='t-name'] > a")
              ?.getAttribute("href") ?? undefined;

          // Match away sets
          const awaySets = Number(
            row.querySelector("td[class*='result']")?.textContent
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
          results.push(match as MatchEntity);

          // Reset entity fields
          match = {} as MatchEntity;
          currentResult = {} as MatchResult;
        }
      }
    }

    /****************************************************
     * Section - Get tournament prizes & ranking details
     ****************************************************/

    let details: RoundPrizeRank[] = [];

    const detailsRows = document.querySelectorAll(
      "table[class*='result moneydetails'] > tbody > tr"
    );

    // Some tournaments might not have a details section
    if (detailsRows) {
      // Every row is a tournament round, their prize and ranking points
      for (const row of detailsRows) {
        // Round name
        const round = row.querySelector(".round")?.textContent ?? undefined;

        // Round prize
        const prize = row.querySelector(".prize")?.textContent ?? undefined;

        // Round ranking points
        const rankingPoints = Number(row.querySelector(".points")?.textContent);

        // Create & push round details
        const roundPrizeRank: RoundPrizeRank = {
          round,
          prize,
          rankingPoints,
        } as RoundPrizeRank;

        details.push(roundPrizeRank);
      }
    }

    return {
      name,
      country,
      surface,
      prize,
      sex,
      tournamentId,
      pastYearsResults: years,
      details,
      nextMatches,
      results,
    } as TournamentEntity;
  }, url);

  return tournament;
};

export { parseTournament };
