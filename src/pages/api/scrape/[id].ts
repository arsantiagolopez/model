import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Match } from "../../../models/Match";
import { Player } from "../../../models/Player";
import { Result } from "../../../models/Result";
import { Tournament } from "../../../models/Tournament";
import { scrapeMatches } from "../../../puppeteer/scrapeMatches";
import { scrapePlayers } from "../../../puppeteer/scrapePlayers";
import { scrapeResults } from "../../../puppeteer/scrapeResults";
import { scrapeSchedule } from "../../../puppeteer/scrapeSchedule";
import { scrapeTournaments } from "../../../puppeteer/scrapeTournaments";
import { MatchEntity, PlayerEntity, TournamentEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";
import { updateTest } from "../tests";
import { storeSurfaceStatsOnDb } from "../stats/surface";

// Main entrance of model. Pupulate initial tournaments, matches, and players.
export const upsertSchedule = async (
  _?: NextApiRequest,
  res?: NextApiResponse
): Promise<boolean> => {
  let success = true;

  try {
    // Reset schedule test
    await updateTest("schedule");

    // Get entities ready to be upserted to database
    let { tournaments, matches, players } = await scrapeSchedule();

    // Upsert tournament entities
    for await (const tournament of tournaments) {
      const { tournamentId } = tournament;
      await Tournament.findOneAndUpdate({ tournamentId }, tournament, {
        upsert: true,
      });
    }

    // Upsert matches entities
    for await (const match of matches) {
      const { matchId } = match;
      await Match.findOneAndUpdate({ matchId }, match, {
        upsert: true,
      });
    }

    // Upsert player entities
    for await (const player of players) {
      const { playerId } = player;
      await Player.findOneAndUpdate({ playerId }, player, {
        upsert: true,
      });
    }

    // Scrape was successful
    await updateTest("schedule", success);

    return res?.status(200).json(success) || success;
  } catch (error) {
    success = false;
    console.log(error);
    return res?.status(400).json(success) || success;
  }
};

// Update existing tournament entities with more details.
export const upsertTournaments = async (
  _?: NextApiRequest,
  res?: NextApiResponse
): Promise<boolean> => {
  let success = true;

  try {
    let tournaments: TournamentEntity[] = [];
    let matches: MatchEntity[] = [];
    let players: PlayerEntity[] = [];

    // Reset tournaments test
    await updateTest("tournaments");

    tournaments = await Tournament.find();

    const links = tournaments.reduce((arr, { tournamentId }) => {
      if (tournamentId) {
        const link =
          process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL + tournamentId;
        if (!arr.includes(link)) {
          arr = [...arr, link];
        }
      }
      return arr;
    }, [] as string[]);
    // Uncomment for test
    // .slice(0, 2);

    // Scrape tournaments
    ({ tournaments, matches, players } = await scrapeTournaments(links));

    // Update tournamnet entities
    for await (const tournament of tournaments) {
      const { tournamentId } = tournament;
      await Tournament.findOneAndUpdate({ tournamentId }, tournament, {
        upsert: true,
      });
    }

    // Upsert matches entities
    for await (const match of matches) {
      const { matchId } = match;
      await Match.findOneAndUpdate({ matchId }, match, {
        upsert: true,
      });
    }

    // Upsert player entities
    for await (const player of players) {
      const { playerId } = player;
      await Player.findOneAndUpdate({ playerId }, player, {
        upsert: true,
      });
    }

    // Scrape was successful
    await updateTest("tournaments", success);

    return res?.status(200).json(success) || success;
  } catch (error) {
    success = false;
    console.log(error);
    return res?.status(400).json(success) || success;
  }
};

// Update existing match entities with more details.
export const upsertMatches = async (
  _?: NextApiRequest,
  res?: NextApiResponse
): Promise<boolean> => {
  let success = true;

  try {
    let matches: MatchEntity[] = await Match.find();
    let players: PlayerEntity[] = [];

    // Reset matches test
    await updateTest("matches");

    const links = matches.reduce((arr, { matchLink }) => {
      if (matchLink) {
        const link = process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL + matchLink;
        if (!arr.includes(link)) {
          arr = [...arr, link];
        }
      }
      return arr;
    }, [] as string[]);
    // Uncomment for test
    // .slice(0, 2);

    // Scrape matches & updated players
    ({ matches, players } = await scrapeMatches(links));

    // Upsert matches entities
    for await (const match of matches) {
      const { matchId } = match;
      await Match.findOneAndUpdate({ matchId }, match, {
        upsert: true,
      });
    }

    // Upsert player entities
    for await (const player of players) {
      const { playerId } = player;
      await Player.findOneAndUpdate({ playerId }, player, {
        upsert: true,
      });
    }

    // Scrape was successful
    await updateTest("matches", success);

    return res?.status(200).json(success) || success;
  } catch (error) {
    success = false;
    console.log(error);
    return res?.status(400).json(success) || success;
  }
};

// Update existing player entities with more details.
export const upsertPlayers = async (
  _?: NextApiRequest,
  res?: NextApiResponse
): Promise<boolean> => {
  let success = true;

  try {
    // Reset players test
    await updateTest("players");

    const matches: MatchEntity[] = await Match.find();

    // Get players from relevant matches
    const links = matches.reduce((arr, { homeLink, awayLink }) => {
      if (homeLink && awayLink) {
        homeLink = process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL + homeLink;
        awayLink = process.env.NEXT_PUBLIC_SCRAPING_SCHEDULE_URL + awayLink;
        arr.push(homeLink, awayLink);
      }
      return arr;
    }, [] as string[]);
    // Uncomment for test
    // .slice(0, 2);

    const players: PlayerEntity[] = await scrapePlayers(links);

    // Upsert players entities
    for await (let player of players) {
      let { playerId, lastMatches, profile } = player;

      // If no image, set default player image
      if (profile?.image?.includes("default-avatar")) {
        profile = {
          ...profile,
          image: process.env.NEXT_PUBLIC_DEFAULT_PLAYER_IMAGE,
        };
      }

      // Track player's win streak
      let streak = 0;
      let streakAlive = true;

      // Dismiss games over 2 months old
      const today = new Date();
      const twoMonthsAgo = moment(today).subtract(2, "months");

      // Track form over last 10 matches
      const wins = lastMatches
        // Sort from most recent to oldest matches
        .sort((a, b) =>
          moment(b.date).valueOf() > moment(a.date).valueOf() ? 1 : -1
        )
        .filter(({ date }) => moment(date).isBetween(twoMonthsAgo, today))
        .reduce((acc, { home, result }) => {
          const won = home === result?.winner;

          // Keep track of streak since most recent game
          if (streakAlive && won) streak++;

          if (won) return ++acc;
          else {
            streakAlive = false;
            return acc;
          }
        }, 0);
      const winAvg = wins / lastMatches.length;

      // Only give weight if at least 5 matches played
      const form = lastMatches.length > 4 ? winAvg : 0;

      // Update player with form
      player = { ...player, profile, form, streak };

      await Player.findOneAndUpdate({ playerId }, player, {
        upsert: true,
      });
    }

    // Scrape was successful
    await updateTest("players", success);

    return res?.status(200).json(success) || success;
  } catch (error) {
    success = false;
    console.log(error);
    return res?.status(400).json(success) || success;
  }
};

// Update existing stats entities with more details.
export const upsertStats = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> => {
  let success = true;

  try {
    // Reset stats test
    await updateTest("stats");

    await storeSurfaceStatsOnDb(req, res);

    /////////////////////////////////////////////////////////////////////////////////////////

    // const players: PlayerEntity[] = await Player.find();

    // const playersStats = await scrapeStats();

    // console.log("**** stats: ", stats);

    // // Upsert players entities
    // for await (const player of playersStats) {
    //   const { player: name } = player;

    //   // Match name to player to ID

    //   await Player.findOneAndUpdate({ playerId }, player, {
    //     upsert: true,
    //   });
    // }

    // console.log()

    //////////////////////////////////////////////////////////////////////////////////////////

    // Scrape was successful
    await updateTest("stats", success);

    return res?.status(200).json(success) || success;
  } catch (error) {
    success = false;
    console.log(error);
    return res?.status(400).json(success) || success;
  }
};

// Update existing results with new or updated entities.
export const upsertResults = async (
  _?: NextApiRequest,
  res?: NextApiResponse
): Promise<boolean> => {
  let success = true;

  try {
    // Get entities ready to be upserted to database
    const results = await scrapeResults();

    // Upsert result entities
    for await (const result of results) {
      const { matchId } = result;
      await Result.updateOne({ matchId }, result, {
        upsert: true,
      });
    }

    // Grade user bets
    // await gradeUserBets()

    return res?.status(200).json(success) || success;
  } catch (error) {
    success = false;
    console.log(error);
    return res?.status(400).json(success) || success;
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSession({ req });
  const { method, query } = req;

  const isAdmin = data?.user.isAdmin;

  await dbConnect();

  switch (method) {
    case "POST":
      if (!isAdmin) {
        return res.status(405).end("Must be an admin to run the model.");
      }

      // Scrape individual entities
      switch (query?.id) {
        // Get tomorrow's schedule
        case "schedule":
          return upsertSchedule(req, res);

        // Upsert tournament entities
        case "tournaments":
          return upsertTournaments(req, res);

        // Upsert matches entites
        case "matches":
          return upsertMatches(req, res);

        // Upsert players entities
        case "players":
          return upsertPlayers(req, res);

        // Upsert stats entities
        case "stats":
          return upsertStats(req, res);

        default:
          return res.status(400).end("Query ID to scrape is not valid.");
      }

    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
