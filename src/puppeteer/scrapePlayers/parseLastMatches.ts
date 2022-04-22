import moment from "moment";
import { Page } from "puppeteer";
import { MatchEntity, MatchResult } from "../../types";

// @todo change return type to Promise<MatchEntity[]>

const parseLastMatches = async (page: Page): Promise<MatchEntity[]> => {
  let lastMatches: MatchEntity[] = [];

  lastMatches = await page.evaluate(() => {
    // Array of three tables of data. Singles, doubles & mixed doubles
    const content = document.querySelectorAll("div[id*='matches']");

    // @unsupported: Deprecate support for doubles type
    // const types: string[] = ["singles", "doubles"];
    const types: string[] = ["singles"];

    let matches: MatchEntity[] = [];

    // Go through every table of every type, get every match played
    for (const [index, _] of types.entries()) {
      const table = content[index].querySelectorAll("tr");

      let currentTournament: string | undefined = undefined;
      let currentTournamentLink: string | undefined = undefined;

      // Every row is a match, except "head flags"
      for (const row of table) {
        // Class name with "head flags" defines a new tournament
        if (row.className.includes("head")) {
          const tournamentWrapper = row.querySelector("td > a");

          // Tournament link
          currentTournamentLink =
            tournamentWrapper?.getAttribute("href") ?? undefined;

          // Tournament name
          currentTournament = tournamentWrapper?.textContent ?? undefined;
        }
        // Row is a match
        else {
          // Match date
          const date = row.querySelector(".time")?.textContent ?? undefined;

          // Match surface
          const surface =
            row
              .querySelectorAll("td")[1]
              ?.querySelector("span")
              ?.getAttribute("title") ?? undefined;

          // Match home & away
          const headline = row?.querySelector("td[class*='name']");

          // Match winner
          const winner = headline?.querySelector("a")?.textContent ?? undefined;

          const winnerLink =
            headline?.querySelector("a")?.getAttribute("href") ?? undefined;
          const loser =
            headline?.querySelectorAll("a")[1]?.textContent ?? undefined;
          const loserLink =
            headline?.querySelectorAll("a")[1]?.getAttribute("href") ??
            undefined;

          // A tag with className "notU" is current player being scrape
          const isPlayerWinner =
            headline?.querySelector("a")?.className === "notU";

          // Home and away fields: Winner is first

          // Match home
          const home = isPlayerWinner ? winner : loser;

          // Match away
          const away = isPlayerWinner ? loser : winner;

          // Match home link
          const homeLink = isPlayerWinner ? winnerLink : loserLink;

          // Match away link
          const awayLink = isPlayerWinner ? loserLink : winnerLink;

          // Match round
          const round = row.querySelector(".round")?.textContent ?? undefined;

          // Match link
          const matchLink =
            row
              .querySelectorAll("td")[4]
              .querySelector("a")
              ?.getAttribute("href") ?? undefined;

          // Match ID
          const matchId = matchLink?.replace("/match-detail/?id=", "");

          // Match odds
          const firstOdds = Number(
            row.querySelectorAll(".course")[0]?.textContent ?? 0
          );
          const secondOdds = Number(
            row.querySelectorAll(".course")[1]?.textContent ?? 0
          );

          // Home odds
          const homeOdds = isPlayerWinner ? firstOdds : secondOdds;

          // Away odds
          const awayOdds = isPlayerWinner ? secondOdds : firstOdds;

          // Match result, sets & games
          const resultStr = row.querySelectorAll("td")[4]?.textContent;

          const firstSet = resultStr?.split(", ")[0];
          const secondSet = resultStr?.split(", ")[1];
          const thirdSet = resultStr?.split(", ")[2];
          const fourthSet = resultStr?.split(", ")[3];
          const fifthSet = resultStr?.split(", ")[4];

          let homeSets = 0;
          let awaySets = 0;
          let homeGamesFirstSet = 0;
          let homeGamesSecondSet = 0;
          let homeGamesThirdSet = 0;
          let homeGamesFourthSet = 0;
          let homeGamesFifthSet = 0;
          let awayGamesFirstSet = 0;
          let awayGamesSecondSet = 0;
          let awayGamesThirdSet = 0;
          let awayGamesFourthSet = 0;
          let awayGamesFifthSet = 0;

          // Winner is first
          if (isPlayerWinner) {
            // Get sets, avoid parsing tiebreaks, save just the game count (6)
            homeGamesFirstSet =
              Number(firstSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(firstSet?.split("-")[0] ?? 0);
            awayGamesFirstSet =
              Number(firstSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(firstSet?.split("-")[1] ?? 0);

            // Calculate home & away sets
            if (homeGamesFirstSet > awayGamesFirstSet) homeSets++;
            else if (homeGamesFirstSet < awayGamesFirstSet) awaySets++;

            homeGamesSecondSet =
              Number(secondSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(secondSet?.split("-")[0] ?? 0);
            awayGamesSecondSet =
              Number(secondSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(secondSet?.split("-")[1] ?? 0);

            // Calculate home & away sets
            if (homeGamesSecondSet > awayGamesSecondSet) homeSets++;
            else if (homeGamesSecondSet < awayGamesSecondSet) awaySets++;

            homeGamesThirdSet =
              Number(thirdSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(thirdSet?.split("-")[0] ?? 0);
            awayGamesThirdSet =
              Number(thirdSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(thirdSet?.split("-")[1] ?? 0);

            // Calculate home & away sets
            if (homeGamesThirdSet > awayGamesThirdSet) homeSets++;
            else if (homeGamesThirdSet < awayGamesThirdSet) awaySets++;

            homeGamesFourthSet =
              Number(fourthSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(fourthSet?.split("-")[0] ?? 0);
            awayGamesFourthSet =
              Number(fourthSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(fourthSet?.split("-")[1] ?? 0);

            // Calculate home & away sets
            if (homeGamesFourthSet > awayGamesFourthSet) homeSets++;
            else if (homeGamesFourthSet < awayGamesFourthSet) awaySets++;

            homeGamesFifthSet;
            Number(fifthSet?.split("-")[0] ?? 0) > 59
              ? 6
              : Number(fifthSet?.split("-")[0] ?? 0);
            awayGamesFifthSet;
            Number(fifthSet?.split("-")[1] ?? 0) > 59
              ? 6
              : Number(fifthSet?.split("-")[1] ?? 0);

            // Calculate home & away sets
            if (homeGamesFifthSet > awayGamesFifthSet) homeSets++;
            else if (homeGamesFifthSet < awayGamesFifthSet) awaySets++;
          } else {
            homeGamesFirstSet =
              Number(firstSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(firstSet?.split("-")[1] ?? 0);
            awayGamesFirstSet =
              Number(firstSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(firstSet?.split("-")[0] ?? 0);

            // Calculate home & away sets
            if (homeGamesFirstSet > awayGamesFirstSet) homeSets++;
            else if (homeGamesFirstSet < awayGamesFirstSet) awaySets++;

            homeGamesSecondSet =
              Number(secondSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(secondSet?.split("-")[1] ?? 0);
            awayGamesSecondSet =
              Number(secondSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(secondSet?.split("-")[0] ?? 0);

            // Calculate home & away sets
            if (homeGamesSecondSet > awayGamesSecondSet) homeSets++;
            else if (homeGamesSecondSet < awayGamesSecondSet) awaySets++;

            homeGamesThirdSet =
              Number(thirdSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(thirdSet?.split("-")[1] ?? 0);
            awayGamesThirdSet =
              Number(thirdSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(thirdSet?.split("-")[0] ?? 0);

            // Calculate home & away sets
            if (homeGamesThirdSet > awayGamesThirdSet) homeSets++;
            else if (homeGamesThirdSet < awayGamesThirdSet) awaySets++;

            homeGamesFourthSet =
              Number(fourthSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(fourthSet?.split("-")[1] ?? 0);
            awayGamesFourthSet =
              Number(fourthSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(fourthSet?.split("-")[0] ?? 0);

            // Calculate home & away sets
            if (homeGamesFourthSet > awayGamesFourthSet) homeSets++;
            else if (homeGamesFourthSet < awayGamesFourthSet) awaySets++;

            homeGamesFifthSet =
              Number(fifthSet?.split("-")[1] ?? 0) > 59
                ? 6
                : Number(fifthSet?.split("-")[1] ?? 0);
            awayGamesFifthSet =
              Number(fifthSet?.split("-")[0] ?? 0) > 59
                ? 6
                : Number(fifthSet?.split("-")[0] ?? 0);

            // Calculate home & away sets
            if (homeGamesFifthSet > awayGamesFifthSet) homeSets++;
            else if (homeGamesFifthSet < awayGamesFifthSet) awaySets++;
          }

          // Update match entity with result
          const result: MatchResult = {
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
          };

          // Update current match
          const match: MatchEntity = {
            matchId,
            matchLink,
            date,
            round,
            home,
            away,
            homeLink,
            awayLink,
            // type,
            surface,
            homeOdds,
            awayOdds,
            tournament: currentTournament,
            tournamentLink: currentTournamentLink,
            tournamentId: currentTournamentLink,
            result: result as MatchResult,
          } as MatchEntity;

          // Push match into matches
          matches.push(match as MatchEntity);
        }
      }
    }

    // Return array of last matches
    return matches;
  });

  // Convert matches date strings to object dates
  lastMatches = lastMatches.map((match) => {
    let { date } = match;
    // Date string is in format "DD.MM."
    date = moment(date, "DD.MM.").toDate();
    return { ...match, date };
  });

  return lastMatches;
};

export { parseLastMatches };
