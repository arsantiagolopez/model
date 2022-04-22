import { Cluster } from "puppeteer-cluster";
import { EloRanking } from "../../types/stats";
import { parseElos } from "./parseElos";

const scrapeElos = async (): Promise<EloRanking[]> => {
  let eloRankings: EloRanking[] = [];

  console.log(
    `* Starting to scrape ELO rankings from ${process.env.NEXT_PUBLIC_SCRAPING_STATS_SITE_NAME}...`
  );

  const links = [
    `${process.env.NEXT_PUBLIC_SCRAPING_STATS_URL}/reports/atp_elo_ratings.html`,
    `${process.env.NEXT_PUBLIC_SCRAPING_STATS_URL}/reports/wta_elo_ratings.html`,
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

      const rankings = await parseElos(page, tour);

      // Date rankings were last updated

      eloRankings.push(...(rankings as EloRanking[]));
    });

    // Shutdown after scraping is done
    await cluster.idle();
    await cluster.close();

    // Log success
    console.log("* Successfully scraped ELO rankings...");

    return eloRankings;
  } catch (error) {
    console.log(`* Error scraping ELO rankings... Err: ${error}`);
    return eloRankings;
  }
};

export { scrapeElos };

// // Start browser
// const browser = await puppeteer.launch();

// const page = await browser.newPage();

// // Go to link
// if (process.env.NEXT_PUBLIC_SCRAPING_ELO_RANKINGS_LINK)
//   await page.goto(process.env.NEXT_PUBLIC_SCRAPING_ELO_RANKINGS_LINK);

// // Parse the page for the list of rankings
// eloRankings = await page.evaluate(() => {
//   let rankings: EloRanking[] = [];

//   // Date rankings were last updated

//   return rankings;
// });

// // Close the browser when finished
// await browser.close();
