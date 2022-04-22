import { Cluster } from "puppeteer-cluster";
import { YEloRanking } from "../../types/stats";
import { parseYElos } from "./parseYElos";

const scrapeYElos = async (): Promise<YEloRanking[]> => {
  let yEloRankings: YEloRanking[] = [];

  console.log(
    `* Starting to scrape yELO rankings from ${process.env.NEXT_PUBLIC_SCRAPING_STATS_SITE_NAME}...`
  );

  const links = [
    `${process.env.NEXT_PUBLIC_SCRAPING_STATS_URL}/reports/atp_season_yelo_ratings.html`,
    `${process.env.NEXT_PUBLIC_SCRAPING_STATS_URL}/reports/wta_season_yelo_ratings.html`,
  ];

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

      // Tour
      const tour = url.includes("atp") ? "atp" : "wta";

      const rankings = await parseYElos(page, tour);

      yEloRankings.push(...(rankings as YEloRanking[]));
    });

    // Shutdown after scraping is done
    await cluster.idle();
    await cluster.close();

    // Log success
    console.log("* Successfully scraped yELO rankings...");

    return yEloRankings;
  } catch (error) {
    console.log(`* Error scraping ELO rankings... Err: ${error}`);
    return yEloRankings;
  }
};

export { scrapeYElos };
