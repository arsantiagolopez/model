import { Cluster } from "puppeteer-cluster";
import { MatchEntity, PlayerEntity, ScrapeMatchesResponse } from "../../types";
import { parseMatch } from "./parseMatch";

/**
 * Scrape detailed information on tomorrow's matches.
 * @param links - Match links to scrape.
 * @returns an array of matches.
 */

const scrapeMatches = async (
  links: string[]
): Promise<ScrapeMatchesResponse> => {
  let matches: MatchEntity[] = [];
  let players: PlayerEntity[] = [];

  console.log(
    `* Starting to scrape matches from ${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_SITE_NAME}...`
  );

  try {
    // Create a cluster with 10 workers
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 10,
    });

    // // @test TEST
    // links = [
    //   "https://www.tennisexplorer.com/match-detail/?id=2073065",
    //   "https://www.tennisexplorer.com/match-detail/?id=2073113",
    // ];

    // Crawl each match main page
    links.map((link) => cluster.queue(link));

    // Crawl entrance point: Task to run
    await cluster.task(async ({ page, data: url }) => {
      // Go to URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Parse match and players
      const matchAndPlayers = await parseMatch(page, url);

      // Add new match and players to arrays
      matches.push(matchAndPlayers?.match as MatchEntity);
      players.push(...(matchAndPlayers?.players as PlayerEntity[]));
    });

    // Shutdown after scraping is done
    await cluster.idle();
    await cluster.close();

    // Log success
    console.log("* Successfully scraped matches...");

    return { matches, players };
  } catch (error) {
    console.log(`* Error scraping matches... Err: ${error}`);
    return { matches, players };
  }
};

export { scrapeMatches };
