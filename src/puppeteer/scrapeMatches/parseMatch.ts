// Get tournament overview, next matches, results, and details

import { Page } from "puppeteer";
import {
  MatchAndPlayers,
  MatchEntity,
  MatchOdds,
  MatchResult,
  MoneylineOdds,
  PlayerEntity,
  SpreadOdds,
  TotalsOdds,
} from "../../types";

const parseMatch = async (
  page: Page,
  url: string
): Promise<MatchAndPlayers> => {
  // Enable log inside page evaluate
  page.on("console", async (msg) => {
    const msgArgs = msg.args();
    for (let i = 0; i < msgArgs.length; ++i) {
      console.log(await msgArgs[i].jsonValue());
    }
  });

  // Parse matches and players
  const matchAndPlayers: MatchAndPlayers = await page.evaluate(
    (url: string) => {
      let match: MatchEntity = {} as MatchEntity;
      let players: PlayerEntity[] = [];

      // Match ID
      const matchId = url.replace(
        "https://www.tennisexplorer.com/match-detail/?id=",
        ""
      );

      /**********************************
       * Section - Get match overview
       **********************************/

      const detailsWrapper = document.querySelector("#center .box");

      // Tournament
      const tournament = detailsWrapper?.textContent?.split(", ")[2];

      // Tournament ID
      const tournamentId = detailsWrapper
        ?.querySelector("a")
        ?.getAttribute("href");

      // Match round
      const round = detailsWrapper?.textContent?.split(", ")[3];

      // Match surface
      const surface = detailsWrapper?.textContent?.split(", ")[4];

      // Get type
      const type = document
        .querySelector("#center .box tbody tr th")
        ?.textContent?.split(" ")[0]
        .toLowerCase();

      /**********************************
       * Section - Get players info
       **********************************/

      const namesWrapper = document.querySelectorAll(
        "#center .box thead tr th"
      );

      // Home name
      const home = namesWrapper[0].textContent ?? undefined;

      // Home link
      const homeLink =
        `${namesWrapper[0]?.querySelector("a")?.getAttribute("href")}/` ??
        undefined;

      // Away name
      const away = namesWrapper[1].textContent ?? undefined;

      // Home link
      const awayLink =
        `${namesWrapper[1]?.querySelector("a")?.getAttribute("href")}/` ??
        undefined;

      const imageWrappers = document.querySelectorAll(
        "#center .box tbody tr td.thumb"
      );

      // Home player image
      let homePlayerImage = imageWrappers[0]
        .querySelector("img")
        ?.getAttribute("src");
      homePlayerImage = `${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL}${homePlayerImage}`;

      // Away player image
      let awayPlayerImage = imageWrappers[1]
        .querySelector("img")
        ?.getAttribute("src");
      awayPlayerImage = `${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL}${awayPlayerImage}`;

      /**********************************
       * Section - Get head to head
       **********************************/

      const headToHeadWrapper = document.querySelectorAll("#center .box")[4];

      const rows = headToHeadWrapper.querySelectorAll("tbody tr");

      let headToHeadMatches: MatchEntity[] = [];

      let currentYear: number | undefined = undefined;
      let currentTournament: string | undefined = undefined;
      let currentResult: MatchResult = {} as MatchResult;

      // Rows are players in matches
      for (const [index, player] of rows.entries()) {
        // Even numbers are home players
        const isHomePlayer = !(index % 2);

        // Get home player
        if (isHomePlayer) {
          currentYear = Number(player.querySelector("td")?.textContent ?? 0);
          currentTournament =
            player.querySelectorAll("td")[1]?.textContent ?? undefined;

          // Match home name
          const home =
            player.querySelector("td[class*='name']")?.textContent ?? undefined;

          // Match home sets
          const homeSets = Number(
            player.querySelector(".result")?.textContent ?? 0
          );

          // Match surface
          const surface = player
            .querySelector("td[class*='sColor'] > span")
            ?.getAttribute("title")
            ?.toLowerCase();

          // Match round
          const round =
            player.querySelector(".round")?.textContent ?? undefined;

          // Match home games per set
          // Strip the game number if set went to tiebreak

          const homeGamesWrapper = player.querySelectorAll(".score");
          const homeGamesFirstSet =
            Number(homeGamesWrapper[0]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGamesWrapper[0]?.textContent ?? 0);

          const homeGamesSecondSet =
            Number(homeGamesWrapper[1]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGamesWrapper[1]?.textContent ?? 0);
          const homeGamesThirdSet =
            Number(homeGamesWrapper[2]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGamesWrapper[2]?.textContent ?? 0);
          const homeGamesFourthSet =
            Number(homeGamesWrapper[3]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGamesWrapper[3]?.textContent ?? 0);
          const homeGamesFifthSet =
            Number(homeGamesWrapper[4]?.textContent ?? 0) > 59
              ? 6
              : Number(homeGamesWrapper[4]?.textContent ?? 0);

          // Update current result
          currentResult = {
            ...currentResult,
            homeSets,
            homeGamesFirstSet,
            homeGamesSecondSet,
            homeGamesThirdSet,
            homeGamesFourthSet,
            homeGamesFifthSet,
          };

          // Update match
          match = {
            ...match,
            home,
            surface,
            round,
            result: currentResult as MatchResult,
          } as MatchEntity;
        }
        // Get away player
        else {
          // Match away name
          const away =
            player.querySelector("td[class*='name']")?.textContent ?? undefined;

          // Match away sets
          const awaySets = Number(
            player.querySelector(".result")?.textContent ?? 0
          );

          // Match away games per set
          // Strip the game number if set went to tiebreak

          const awayGamesWrapper = player.querySelectorAll(".score");
          const awayGamesFirstSet =
            Number(awayGamesWrapper[0]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGamesWrapper[0]?.textContent ?? 0);

          const awayGamesSecondSet =
            Number(awayGamesWrapper[1]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGamesWrapper[1]?.textContent ?? 0);
          const awayGamesThirdSet =
            Number(awayGamesWrapper[2]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGamesWrapper[2]?.textContent ?? 0);
          const awayGamesFourthSet =
            Number(awayGamesWrapper[3]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGamesWrapper[3]?.textContent ?? 0);
          const awayGamesFifthSet =
            Number(awayGamesWrapper[4]?.textContent ?? 0) > 59
              ? 6
              : Number(awayGamesWrapper[4]?.textContent ?? 0);

          // Update current result
          currentResult = {
            ...currentResult,
            awaySets,
            awayGamesFirstSet,
            awayGamesSecondSet,
            awayGamesThirdSet,
            awayGamesFourthSet,
            awayGamesFifthSet,
          };

          // Update match
          match = {
            ...match,
            away,
            year: currentYear,
            tournament: currentTournament,
            result: currentResult as MatchResult,
          } as MatchEntity;

          // Push match to array
          headToHeadMatches.push(match as MatchEntity);

          // Reset fields
          match = {} as MatchEntity;
          currentResult = {} as MatchResult;
          currentYear = undefined;
          currentTournament = undefined;
        }
      }

      /**********************************
       * Section - Get match odds
       **********************************/

      const oddsWrapper = document.querySelectorAll("div[id*='odds']");

      let odds: MatchOdds = {} as MatchOdds;

      // Moneyline odds
      const moneylineWrapper = oddsWrapper[0].querySelector(".average");
      const moneylineHomeOdds = Number(
        moneylineWrapper?.querySelectorAll("td")[1]?.textContent ?? 0
      );
      const moneylineAwayOdds = Number(
        moneylineWrapper?.querySelectorAll("td")[2]?.textContent ?? 0
      );

      // Spread moneyline to odds object
      const moneyline = {
        home: moneylineHomeOdds,
        away: moneylineAwayOdds,
      } as MoneylineOdds;

      odds = { ...odds, moneyline };

      // Game & set totals odds
      const totalsLines = oddsWrapper[1].querySelectorAll(
        "tbody tr[class*='type']"
      );
      const totalsAverages = oddsWrapper[1].querySelectorAll("tbody .average");

      let totalGames: TotalsOdds[] = [];
      let totalSets: TotalsOdds[] = [];

      // Itearate through totals lines
      for (const [index, col] of totalsAverages.entries()) {
        const isSetSpread = totalsLines[index]?.textContent
          ?.toLowerCase()
          .includes("set");

        const line = Number(col.querySelectorAll("td")[1]?.textContent ?? 0);
        const over = Number(col.querySelectorAll("td")[2]?.textContent ?? 0);
        const under = Number(col.querySelectorAll("td")[3]?.textContent ?? 0);

        const spreadsLine: TotalsOdds = { line, over, under };

        // Push spreads line to either spreadGamesOdds or spreadSetsOdds
        if (isSetSpread) totalSets.push(spreadsLine);
        else totalGames.push(spreadsLine);
      }

      // Spread totalGames and totalSets to odds object
      odds = { ...odds, totalGames, totalSets };

      // Game & set spreads odds
      const spreadsLines = oddsWrapper[2].querySelectorAll(
        "tbody tr[class*='type']"
      );
      const spreadsAverages = oddsWrapper[2].querySelectorAll("tbody .average");

      let spreadGames: SpreadOdds[] = [];
      let spreadSets: SpreadOdds[] = [];

      // Itearate through spreads lines
      for (const [index, line] of spreadsAverages.entries()) {
        const isSetSpread = spreadsLines[index]?.textContent
          ?.toLowerCase()
          .includes("set");

        const spread = Number(line.querySelectorAll("td")[1]?.textContent ?? 0);
        const home = Number(line.querySelectorAll("td")[2]?.textContent ?? 0);
        const away = Number(line.querySelectorAll("td")[3]?.textContent ?? 0);

        const spreadsLine: SpreadOdds = { spread, home, away };

        // Push spreads line to either spreadGamesOdds or spreadSetsOdds
        if (isSetSpread) spreadSets.push(spreadsLine);
        else spreadGames.push(spreadsLine);
      }

      // Spread spreadGames and spreadSets to odds entity
      odds = { ...odds, spreadGames, spreadSets };

      // Update match with all parsed values
      match = {
        matchId,
        home,
        homeLink,
        away,
        awayLink,
        round,
        surface,
        type,
        headToHeadMatches,
        odds,
      } as MatchEntity;

      // Create home and away players and add match as upcoming match to both
      const homePlayer: PlayerEntity = {
        playerId: homeLink,
        profile: { name: home, image: homePlayerImage },
        upcomingMatch: { matchId, tournament },
      } as PlayerEntity;

      const awayPlayer: PlayerEntity = {
        playerId: awayLink,
        profile: { name: away, image: awayPlayerImage },
        upcomingMatch: { matchId, tournament, tournamentId },
      } as PlayerEntity;

      // Push home and away to players
      players.push(homePlayer, awayPlayer);

      // Return match and players entities
      return { match, players };
    },
    url
  );

  return matchAndPlayers;
};

export { parseMatch };
