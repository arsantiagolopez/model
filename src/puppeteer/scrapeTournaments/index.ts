import { Cluster } from "puppeteer-cluster";
import {
  MatchEntity,
  PastYearResult,
  PlayerEntity,
  ScrapeScheduleResponse,
  TournamentEntity,
} from "../../types";
import { parseStringToDate } from "../../utils/parseStringToDate";
import { parsePastYears } from "./parsePastYears";
import { parseTournament } from "./parseTournament";

const scrapeTournaments = async (
  links: string[]
): Promise<ScrapeScheduleResponse> => {
  let tournaments: TournamentEntity[] = [];
  let matches: MatchEntity[] = [];
  let players: PlayerEntity[] = [];

  // Tournament props
  let pastYearsResults: PastYearResult[] = [];

  console.log(
    `* Starting to scrape tournaments from ${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_SITE_NAME}...`
  );

  try {
    // Create a cluster with 10 workers
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 10,
    });

    // // @test TEST
    // links = [
    //   "https://www.tennisexplorer.com/madrid-masters/2019/atp-men/",
    //   "https://www.tennisexplorer.com/monte-carlo/2022/atp-men/",
    // ];

    // Crawl each tournament main page
    links.map((link) => cluster.queue(link));

    // Crawl entrance point: Task to run
    await cluster.task(async ({ page, data: url }) => {
      // Go to URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Parse tournament
      const tournament = await parseTournament(page, url);

      // Add new tournament to array
      tournaments.push(tournament as TournamentEntity);

      // Crawl 2: Deep cluster to get past year results
      pastYearsResults = await parsePastYears(links, cluster, tournaments);
    });

    // Shutdown after scraping is done
    await cluster.idle();
    await cluster.close();

    // Log success
    console.log("* Successfully scraped tournaments...");

    // Map pastYearsResults to corresponding tournament
    tournaments = tournaments.map((tournament) => {
      const results = pastYearsResults.filter(
        (results) => results.tournamentId === tournament?.tournamentId
      );
      return { ...tournament, pastYearsResults: results };
    });

    /**
     * Update entities for database:
     * - Strip base URL from tournament ID
     * - Parse date strings to Date values
     */

    tournaments = tournaments.map((tournament) => {
      let { nextMatches, pastYearsResults, tournamentId, results } = tournament;

      // Parse next matches date
      nextMatches = nextMatches?.map((match) => ({
        ...match,
        date: parseStringToDate({ date: match?.date, isNextMatch: true }),
      }));

      // Parse past matches date
      pastYearsResults = pastYearsResults?.map((year) => ({
        ...year,
        matches: year.matches.map((match) => ({
          ...match,
          date: parseStringToDate({ date: match?.date, isPastMatch: true }),
        })) as MatchEntity[],
      }));

      // Parse results date
      results = results?.map((result) => ({
        ...result,
        date: parseStringToDate({ date: result?.date, isPastMatch: true }),
      }));

      // Strip base URL from tournamentId
      tournamentId = tournamentId?.replace(
        "https://www.tennisexplorer.com",
        ""
      );

      // Update tournament fields
      tournament = {
        ...tournament,
        tournamentId,
        nextMatches,
        pastYearsResults,
        results,
      };

      return tournament;
    });

    return { tournaments, matches, players };
  } catch (error) {
    console.log(`* Error scraping new tournament... Err: ${error}`);
    return { tournaments, matches, players };
  }
};

export { scrapeTournaments };
