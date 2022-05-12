import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Match } from "../../../models/Match";
import { Player } from "../../../models/Player";
import { MatchPlayerProfilesAndDates, PlayerEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";
import { format } from "../../../utils/formatToMongoEntity";
import { clientPromise } from "../../../utils/mongodb";

interface PlayerHash {
  [id: string]: PlayerEntity;
}

// Get cached results from database for quicker lookup times
const getCachedResults = async (): Promise<MatchPlayerProfilesAndDates[]> => {
  try {
    const db = (await clientPromise).db("main");
    const { MatchPlayerProfilesAndDates } = {
      MatchPlayerProfilesAndDates: db.collection<MatchPlayerProfilesAndDates>(
        "matchPlayerProfilesAndDates"
      ),
    };

    const results = (await MatchPlayerProfilesAndDates.find().toArray()).map(
      (entity) => format.from(entity)
    );

    return results;
  } catch (error) {
    console.log(`Error fetching cached results. Error: ${error}`);
    return [];
  }
};

// Store results in database for quick lookup after first load
const cacheResults = async (
  entities: MatchPlayerProfilesAndDates[]
): Promise<void> => {
  try {
    const db = (await clientPromise).db("main");
    const { MatchPlayerProfilesAndDates } = {
      MatchPlayerProfilesAndDates: db.collection<MatchPlayerProfilesAndDates>(
        "matchPlayerProfilesAndDates"
      ),
    };

    // Convert to MongoDB object
    entities = entities.map((entity) => format.to(entity));

    await MatchPlayerProfilesAndDates.insertMany(entities);
  } catch (error) {
    console.log(`Error fetching cached results. Error: ${error}`);
  }
};

/**
 * Get the matches of players with the most time passed between
 * their last matches and tomorrow.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @returns an array of players and their respective countries.
 */
const getHighestDifferentialInLastMatchPlayedDate = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<MatchPlayerProfilesAndDates[] | void> => {
  // Check if today's data cached
  const cached = await getCachedResults();

  // Return cached results
  if (cached.length) {
    return res.status(200).json(cached);
  }

  try {
    // Create player hash by mapping playerId to player entity
    let playerHash: PlayerHash = {};

    const players: PlayerEntity[] = await Player.find();

    for (const player of players) {
      const { playerId } = player;
      playerHash[playerId] = player;
    }

    const matches = await Match.find();

    // Keep track of matches with at least one player that has played in the last month
    let matchesWithActivePlayer: MatchPlayerProfilesAndDates[] = [];

    for (const match of matches) {
      const { homeLink, awayLink } = match;

      if (homeLink && awayLink) {
        const homePlayerMatches = playerHash[homeLink].lastMatches;
        const awayPlayerMatches = playerHash[awayLink].lastMatches;

        // Make sure both players have at least one game
        if (homePlayerMatches && awayPlayerMatches) {
          // Get home & away players' last matches
          const homeLastMatch = homePlayerMatches[0];
          const awayLastMatch = awayPlayerMatches[0];

          if (homeLastMatch && awayLastMatch) {
            // Calculate dates
            const today = moment(new Date());

            const homeLastMatchDate = moment(homeLastMatch.date);
            const awayLastMatchDate = moment(awayLastMatch.date);

            // Time since home last game
            const homeDaysSinceLastMatch =
              moment(today).diff(homeLastMatchDate, "days") * -1;
            const awayDaysSinceLastMatch =
              moment(today).diff(awayLastMatchDate, "days") * -1;

            // Only keep match if at least one player has played in the last month
            if (homeDaysSinceLastMatch < 31 || awayDaysSinceLastMatch < 31) {
              const matchPlayerProfilesAndDates: MatchPlayerProfilesAndDates = {
                match,
                homeProfile: playerHash[homeLink].profile,
                awayProfile: playerHash[awayLink].profile,
                homeDaysSinceLastMatch,
                awayDaysSinceLastMatch,
              };

              // Add match to active matches
              matchesWithActivePlayer.push(matchPlayerProfilesAndDates);
            }
          }
        }
      }
    }

    // Sort active matches by highest differential in days since last match
    const sortedMatches = matchesWithActivePlayer
      .sort((a, b) =>
        Math.abs(a.homeDaysSinceLastMatch - a.awayDaysSinceLastMatch) <
        Math.abs(b.homeDaysSinceLastMatch - b.awayDaysSinceLastMatch)
          ? 1
          : -1
      )
      // Only show the most relevant 30 matches
      .slice(0, 30);

    // Cache daily results in dabatase
    await cacheResults(sortedMatches);

    return res.status(200).json(sortedMatches);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSession({ req });
  const { method } = req;

  const isAdmin = data?.user.isAdmin;

  if (!isAdmin) {
    return res.status(405).end("Must be an admin to access the model.");
  }

  await dbConnect();

  switch (method) {
    case "GET":
      return getHighestDifferentialInLastMatchPlayedDate(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
