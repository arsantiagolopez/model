import { EloRanking, PlayerStatsEntity, YEloRanking } from "../../types/stats";
import { scrapeElos } from "./scrapeElos";
import { scrapeYElos } from "./scrapeYElos";

const scrapeStats = async (): Promise<PlayerStatsEntity[]> => {
  let playerStats: PlayerStatsEntity[] = [];

  let eloRankings: EloRanking[] = [];
  let yEloRankings: YEloRanking[] = [];

  console.log(
    `* Starting to scrape all stats from ${process.env.NEXT_PUBLIC_SCRAPING_STATS_SITE_NAME}...`
  );

  try {
    // Scrape elo rankings
    eloRankings = await scrapeElos();

    // Scrape yElo rankings
    yEloRankings = await scrapeYElos();

    console.log(
      "************************** ELO RANKINGS ******************************",
      eloRankings
    );

    console.log(
      "************************** YELO RANKINGS ******************************",
      yEloRankings
    );

    // Log success
    console.log("* Successfully scraped players...");

    return playerStats;
  } catch (error) {
    console.log(`* Error scraping stats... Err: ${error}`);
    return playerStats;
  }
};

export { scrapeStats };
