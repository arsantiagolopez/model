import moment from "moment";
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

    // Convert string dates to Date objects
    matches = matches.map((match) => {
      const { date: dateStr } = match;

      let date: string | Date | undefined = undefined;

      if (dateStr) {
        // TennisExplorer time 5 hours ahead
        // Subtract 5 hours for real time
        // const hours = Number((dateStr as string)?.substring(0, 2)) - 5;
        const hours = Number((dateStr as string)?.substring(0, 2));
        const minutes = Number((dateStr as string).substring(3, 5));

        // const tomorrowDate = moment(new Date())
        //   .add(1, "day")
        //   .format("YYYY-MM-DD");

        // date = moment(tomorrowDate)
        date = moment(new Date())
          .set("hour", hours)
          .set("minute", minutes)
          .toDate();
      }

      return { ...match, date };
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
