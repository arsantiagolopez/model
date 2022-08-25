import { ResultEntity } from "../../types";
import { scrapeTourResults } from "./scrapeTourResults";

/**
 * Get results of the day.
 * @returns and array of results.
 */
const scrapeResults = async (): Promise<ResultEntity[]> => {
  let results: ResultEntity[] = [];

  try {
    // Get ATP & WTA results
    results = await scrapeTourResults();

    return results;
  } catch (error) {
    console.log(`* Error scraping today's results... Err: ${error}`);
    return results;
  }
};

export { scrapeResults };
