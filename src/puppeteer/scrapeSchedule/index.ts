import {
  MatchEntity,
  PlayerEntity,
  ScrapeScheduleResponse,
  TournamentEntity,
} from "../../types";
import { scrapeTournamentMatchesAndPlayers } from "./scrapeTournamentMatchesAndPlayers";

/**
 * Get initial entities of tomorrow's tournaments, matches and players.
 * @returns arrays of tournaments, matches and players.
 */
const scrapeSchedule = async (): Promise<ScrapeScheduleResponse> => {
  let tournaments: TournamentEntity[] = [];
  let matches: MatchEntity[] = [];
  let players: PlayerEntity[] = [];

  try {
    // Get tomorrow's tournaments, matches & players data
    ({ tournaments, matches, players } =
      await scrapeTournamentMatchesAndPlayers());

    // Tournaments & other filters to exclude
    const excludeKeywords = ["future"];

    // Filter out unwanted/unsupported tournaments
    tournaments = tournaments.filter((tournament) => {
      const { name } = tournament;
      const isExcluded = excludeKeywords.some((keyword) =>
        name?.toLowerCase().includes(keyword)
      );
      if (!isExcluded) return tournament;
    });

    // Filter out unwanted/unsupported matches
    matches = matches.filter((match) => {
      const { tournament } = match;
      const isExcluded = excludeKeywords.some((keyword) =>
        tournament?.toLowerCase().includes(keyword)
      );
      if (!isExcluded) return match;
    });

    // Note. Partial player entities related to unsupported
    // tournaments will be removed on a later stage.

    return { tournaments, matches, players };
  } catch (error) {
    console.log(`* Error scraping tomorrow's schedule... Err: ${error}`);
    return { matches, tournaments, players };
  }
};

export { scrapeSchedule };
