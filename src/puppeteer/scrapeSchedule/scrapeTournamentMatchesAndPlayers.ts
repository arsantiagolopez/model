import moment from "moment";
import { Cluster } from "puppeteer-cluster";
import {
  MatchEntity,
  PlayerEntity,
  ScrapeScheduleResponse,
  TournamentEntity,
} from "../../types";
import { parseTournamentsMatchesAndPlayers } from "./parseTournamentsMatchesAndPlayers";

const scrapeTournamentMatchesAndPlayers =
  async (): Promise<ScrapeScheduleResponse> => {
    let tournaments: TournamentEntity[] = [];
    let matches: MatchEntity[] = [];
    let players: PlayerEntity[] = [];

    // const tomorrow = moment(new Date()); // @test - Get today's instead
    const tomorrow = moment(new Date()).add(1, "day");
    const year = String(tomorrow.year());
    const month = tomorrow.format("MM");
    const day = tomorrow.format("DD");

    const types = ["atp-single", "wta-single"];

    const links = types.map(
      (type) =>
        `${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL}/matches/?type=${type}&year=${year}&month=${month}&day=${day}`
    );

    console.log(
      `* Starting to scrape tomorrow's schedule from ${process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_SITE_NAME}...`
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

        // Parse schedule
        const schedule = await parseTournamentsMatchesAndPlayers(
          page,
          day,
          month,
          year
        );

        // Merge ATP & WTA schedules
        tournaments.push(...schedule?.tournaments);
        matches.push(...schedule?.matches);
        players.push(...schedule?.players);
      });

      // Shutdown after scraping is done
      await cluster.idle();
      await cluster.close();

      // Log success
      console.log(`* Successfully scraped tomorrow's schedule...`);

      return { tournaments, matches, players };
    } catch (error) {
      // Log failure & error
      console.log(`* Error scraping tomorrow's schedule... Err: ${error}`);
      return { tournaments, matches, players };
    }
  };

export { scrapeTournamentMatchesAndPlayers };
