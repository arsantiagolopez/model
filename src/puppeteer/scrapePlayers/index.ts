import { Cluster } from "puppeteer-cluster";
import { PlayerEntity } from "../../types";
import { parseInjuries } from "./parseInjuries";
import { parseLastMatches } from "./parseLastMatches";
import { parsePastTournamentResults } from "./parsePastTournamentResults";
import { parseProfile } from "./parseProfile";
import { parseRecord } from "./parseRecord";

/**
 * Scrape detailed information about players.
 * @param links - Player links to scrape.
 * @returns an array of players.
 */

const scrapePlayers = async (links: string[]): Promise<PlayerEntity[]> => {
  let players: PlayerEntity[] = [];

  console.log(
    `* Starting to scrape players from ${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_SITE_NAME}...`
  );

  try {
    // Create a cluster with 10 workers
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 10,
    });

    // // @test TEST
    // links = [
    //   "https://www.tennisexplorer.com/player/giorgi/",
    //   "https://www.tennisexplorer.com/player/crescenzi/",
    //   "https://www.tennisexplorer.com/player/sanchez-izquierdo-99add/",
    // ];

    // Crawl each player main page
    links.map((link) => cluster.queue(link));

    // Crawl entrance point: Task to run
    await cluster.task(async ({ page, data: url }) => {
      // Go to URL
      await page.goto(url, { waitUntil: "domcontentloaded" });

      let player: PlayerEntity = {} as PlayerEntity;

      // Player ID
      const playerId = url.replace(
        process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL,
        ""
      );

      // Parse player profile
      const profile = await parseProfile(page);

      // Parse player record
      const record = await parseRecord(page);

      // Parse last matches
      const lastMatches = await parseLastMatches(page);

      // Parse injuries
      const injuries = await parseInjuries(page);

      // Parse past tournament results
      const pastTournamentResults = await parsePastTournamentResults(page);

      // Update player entity
      player = {
        playerId,
        profile,
        record,
        lastMatches,
        injuries,
        pastTournamentResults,
      } as PlayerEntity;

      // Add new player to array
      players.push(player);
    });

    // Shutdown after scraping is done
    await cluster.idle();
    await cluster.close();

    // Log success
    console.log("* Successfully scraped players...");

    return players;
  } catch (error) {
    console.log(`* Error scraping tournaments... Err: ${error}`);
    return players;
  }
};

export { scrapePlayers };
