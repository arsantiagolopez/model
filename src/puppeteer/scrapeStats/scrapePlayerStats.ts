import { Cluster } from "puppeteer-cluster";
import { PlayerStatsEntity } from "../../types/stats";
import { parseStats } from "./parseStats";

/**
 * Scrape players detailed information
 * @param links - Player links to scrape.
 * @returns an array of player entities.
 */

const scrapePlayerStats = async (
  links: string[]
): Promise<PlayerStatsEntity[]> => {
  let playerStats: PlayerStatsEntity[] = [];

  console.log(
    `* Starting to scrape players stats from ${process.env.NEXT_PUBLIC_SCRAPING_STATS_SITE_NAME}...`
  );

  try {
    // Create a cluster with 10 workers
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 10,
    });

    // Crawl each match main page
    links.map((link) => cluster.queue(link));

    // Crawl entrance point: Task to run
    await cluster.task(async ({ page, data: url }) => {
      // Go to URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Parse player stats
      const stats = await parseStats(page, url);

      // Add new player to playerStats
      playerStats.push(stats as PlayerStatsEntity);
    });

    // Shutdown after scraping is done
    await cluster.idle();
    await cluster.close();

    // Log success
    console.log("* Successfully scraped players stats...");

    return playerStats;
  } catch (error) {
    console.log(`* Error scraping players stats... Err: ${error}`);
    return playerStats;
  }
};

export { scrapePlayerStats };
