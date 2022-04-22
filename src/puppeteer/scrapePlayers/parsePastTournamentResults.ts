import moment from "moment";
import { Page } from "puppeteer";
import { MatchEntity, PastTournamentResult } from "../../types";

const parsePastTournamentResults = async (
  page: Page
): Promise<PastTournamentResult[]> => {
  let pastTournameResults: PastTournamentResult[] = [];

  // Parse tournament results
  pastTournameResults = await page.evaluate(() => {
    let yearResults: PastTournamentResult[] = [];

    const years = document.querySelectorAll("tr[id*='row']");
    const yearGamesWrapper = document.querySelectorAll(
      "tr.pastTournamentGames"
    );

    // Get year results and corresponding games
    for (const [index, node] of years.entries()) {
      // Get result

      // Get year
      const year = Number(node?.querySelector(".year > a")?.textContent ?? 0);

      // Tournament ID
      const tournamentId =
        node?.querySelector(".year > a")?.getAttribute("href") ?? undefined;

      // Round result
      const result = node?.querySelector(".tl > a")?.textContent ?? undefined;

      // Get matches (skip the header row)
      let matches: MatchEntity[] = [];

      const matchNodes = [
        ...yearGamesWrapper[index].querySelectorAll("tbody > tr"),
      ].slice(1);

      // Rows are matches
      for (const row of matchNodes) {
        // Match date
        const date = row?.querySelectorAll("td")[0]?.textContent ?? undefined;

        const homeNode = row
          ?.querySelectorAll("td")[1]
          .querySelectorAll("a")[0];

        // Match home
        const home = homeNode?.textContent ?? undefined;

        // Match home link
        const homeLink = homeNode?.getAttribute("href") ?? undefined;

        // Match away link
        const awayNode = row
          ?.querySelectorAll("td")[1]
          .querySelectorAll("a")[1];

        // Match away
        const away = awayNode?.textContent ?? undefined;

        // Match away link
        const awayLink = awayNode?.getAttribute("href") ?? undefined;

        // Match round
        const round = row?.querySelectorAll("td")[2]?.textContent ?? undefined;

        // Result
        // Match winnner
        const winner = home;

        const scoreNode = row?.querySelectorAll("td")[3];

        // Match link
        const matchLink =
          scoreNode?.querySelector("a")?.getAttribute("href") ?? undefined;

        // Match ID
        const matchId = matchLink?.split("/match-detail/?id=")[1];

        // Break down inline scores into sets & games
        const stringScore = scoreNode?.querySelector("a")?.textContent;
        const sets = stringScore?.split(", ");

        let homeGamesArr: number[] = [];
        let awayGamesArr: number[] = [];

        let homeSets = 0;
        let awaySets = 0;

        // Sets would be broken down in 6-4, 5-7, 6-3 strings format with
        // optional 3rd, 4th and 5th
        if (sets) {
          for (const set of sets) {
            // Account for times where tiebreaks print out the
            // number of points losing player lost the tiebreak by
            const homeGames =
              Number(set.split("-")[0]) > 59
                ? 6
                : Number(set.split("-")[0]) ?? 0;
            const awayGames =
              Number(set.split("-")[1]) > 59
                ? 6
                : Number(set.split("-")[1]) ?? 0;
            homeGamesArr.push(homeGames);
            awayGamesArr.push(awayGames);

            // Who won the set?
            if (homeGames > awayGames) homeSets += 1;
            else awaySets += 1;
          }
        }

        // Map array games back to variables
        const homeGamesFirstSet = homeGamesArr[0];
        const homeGamesSecondSet =
          homeGamesArr[1] !== undefined ? homeGamesArr[1] : 0;
        const homeGamesThirdSet =
          homeGamesArr[2] !== undefined ? homeGamesArr[2] : 0;
        const homeGamesFourthSet =
          homeGamesArr[3] !== undefined ? homeGamesArr[3] : 0;
        const homeGamesFifthSet =
          homeGamesArr[4] !== undefined ? homeGamesArr[4] : 0;
        const awayGamesFirstSet = awayGamesArr[0];
        const awayGamesSecondSet =
          awayGamesArr[1] !== undefined ? awayGamesArr[1] : 0;
        const awayGamesThirdSet =
          awayGamesArr[2] !== undefined ? awayGamesArr[2] : 0;
        const awayGamesFourthSet =
          awayGamesArr[3] !== undefined ? awayGamesArr[3] : 0;
        const awayGamesFifthSet =
          awayGamesArr[4] !== undefined ? awayGamesArr[4] : 0;

        // Get odds
        const homeOdds = Number(
          row?.querySelectorAll("td")[4]?.textContent ?? 0
        );
        const awayOdds = Number(
          row?.querySelectorAll("td")[5]?.textContent ?? 0
        );

        // Create match entity
        const match: MatchEntity = {
          matchId,
          matchLink,
          date,
          round,
          home,
          away,
          homeLink,
          awayLink,
          homeOdds,
          awayOdds,
          result: {
            winner,
            homeSets,
            awaySets,
            homeGamesFirstSet,
            homeGamesSecondSet,
            homeGamesThirdSet,
            homeGamesFourthSet,
            homeGamesFifthSet,
            awayGamesFirstSet,
            awayGamesSecondSet,
            awayGamesThirdSet,
            awayGamesFourthSet,
            awayGamesFifthSet,
          },
        } as MatchEntity;

        // Push match to the current year games array
        matches.push(match);
      }

      // Create past tournament result entity
      const pastTournamentResult: PastTournamentResult = {
        tournamentId,
        year,
        result,
        matches,
      } as PastTournamentResult;

      // Push result past tournament results array
      yearResults.push(pastTournamentResult);
    }

    // Return all years results
    return yearResults;
  });

  // Convert date strings to date objects
  pastTournameResults = pastTournameResults.map((pastResult) => {
    let { matches } = pastResult;
    matches = matches.map((match) => {
      let { date } = match;
      // Date string is in format "15.04."
      date = moment(date, "DD.MM.").toDate();
      return { ...match, date };
    });
    return { ...pastResult, matches };
  });

  return pastTournameResults;
};

export { parsePastTournamentResults };
