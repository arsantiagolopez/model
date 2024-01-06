import moment from "moment";
import { ResultEntity } from "../../types";
import { parseResults } from "./parseResults";
import puppeteerClient from "..";

const scrapeTourResults = async (): Promise<ResultEntity[]> => {
  let results: ResultEntity[] = [];

  const today = moment(new Date());
  // const yesterday = moment(new Date()).subtract(1, "day");

  // If before noon, get yesterday's results
  // Else, get today's.
  // const currentHour = Number(moment().format("HH"));
  // const isBeforeNoon = currentHour < 12;

  // @todo: Decide what date to scrape throught hours of the day
  // const date = isBeforeNoon ? yesterday : today;
  const date = today;

  const day = date.format("DD");
  const year = String(date.year());
  const month = date.format("MM");

  const types = ["atp-single", "wta-single"];

  const links = types.map(
    (type) =>
      `${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL}/results/?type=${type}&year=${year}&month=${month}&day=${day}`
  );

  console.log(
    `* Starting to scrape today's results from ${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_SITE_NAME}...`
  );

  try {
    // Create a cluster with 10 workers
    const cluster = await puppeteerClient();

    // Crawl each match main page
    links.map((link) => cluster.queue(link));

    // Crawl entrance point: Task to run
    await cluster.task(async ({ page, data: url }) => {
      // Go to URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Parse tour results
      const tourResults = await parseResults(page, day, month, year);

      // Merge ATP & WTA results
      results.push(...tourResults);
    });

    // Shutdown after scraping is done
    await cluster.idle();
    await cluster.close();

    const timestamp = moment(new Date()).format("HH:mm:ss");

    // Log success
    console.log(
      `* Successfully scraped todays's results as of ${timestamp}...`
    );

    return results;
  } catch (error) {
    // Log failure & error
    console.log(`* Error scraping today's results... Err: ${error}`);
    return results;
  }
};

export { scrapeTourResults };
