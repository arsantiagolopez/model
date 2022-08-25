import { NextApiRequest, NextApiResponse } from "next";
import { Match } from "../../../models/Match";
import { Player } from "../../../models/Player";
import {
  MatchEntity,
  MatchPlayerProfilesAndSurfaceRecords,
  PlayerEntity,
  WinLossRecord,
  YearRecord,
} from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";
import { format } from "../../../utils/formatToMongoEntity";
import { clientPromise } from "../../../utils/mongodb";

interface PlayersHash {
  [playerId: string]: PlayerEntity;
}

/**
 * Get highest current surface record differential between any two players.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @returns an array of matches.
 */
const getHighestSurfaceFormDifferential = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<MatchPlayerProfilesAndSurfaceRecords[] | void> => {
  try {
    const db = (await clientPromise).db("model");
    const { MatchPlayerProfilesAndSurfaceRecords } = {
      MatchPlayerProfilesAndSurfaceRecords:
        db.collection<MatchPlayerProfilesAndSurfaceRecords>(
          "matchPlayerProfilesAndSurfaceRecords"
        ),
    };

    const results = (
      await MatchPlayerProfilesAndSurfaceRecords.find().toArray()
    ).map((entity) => format.from(entity));

    return res.status(200).json(results);
  } catch (err) {
    console.log(`Error fetching cached results. Error: ${err}`);
    return res.status(400).json({ message: err });
  }
};

/**
 * Store surface dominance stats in database.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @returns a success boolean on completion.
 */
export const storeSurfaceStatsOnDb = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<boolean | void> => {
  const RECORD_DIFFERENTIAL_NUMBER = 5;

  try {
    const playersHash: PlayersHash = {};

    const players: PlayerEntity[] = await Player.find();

    // Create players hash for efficient lookups
    for (const player of players) {
      const { playerId } = player;
      playersHash[playerId] = player;
    }

    const matches: MatchEntity[] = await Match.find();

    // Keep track of matches with at least one player with a good current surface record
    let matchesWithAtLeastOneGoodRecord: MatchPlayerProfilesAndSurfaceRecords[] =
      [];

    for (const match of matches) {
      const { homeLink, awayLink, surface } = match;

      if (homeLink && awayLink && surface) {
        const { record: homeRecord, profile: homeProfile } =
          playersHash[homeLink];
        const { record: awayRecord, profile: awayProfile } =
          playersHash[awayLink];

        const year = new Date().getFullYear();

        const homeCurrentYear: YearRecord | undefined = homeRecord?.years.find(
          (record) => record?.year === year
        );
        const awayCurrentYear: YearRecord | undefined = awayRecord?.years.find(
          (record) => record?.year === year
        );

        if (homeCurrentYear && awayCurrentYear) {
          const homeCurrentSurfaceRecord = homeCurrentYear[
            surface as keyof YearRecord
          ] as WinLossRecord;
          const awayCurrentSurfaceRecord = awayCurrentYear[
            surface as keyof YearRecord
          ] as WinLossRecord;

          if (homeCurrentSurfaceRecord && awayCurrentSurfaceRecord) {
            // Count wins, losses and differentials
            const homeWins = homeCurrentSurfaceRecord.win;
            const homeLosses = homeCurrentSurfaceRecord.loss;
            const awayWins = awayCurrentSurfaceRecord.win;
            const awayLosses = awayCurrentSurfaceRecord.loss;

            const homeDifferential =
              Math.abs(homeWins - homeLosses) > RECORD_DIFFERENTIAL_NUMBER;
            const awayDifferential =
              Math.abs(awayWins - awayLosses) > RECORD_DIFFERENTIAL_NUMBER;

            // Only consider games where at least one player has a good record
            if (homeDifferential || awayDifferential) {
              const matchPlayerProfilesAndSurfaceRecords: MatchPlayerProfilesAndSurfaceRecords =
                {
                  match,
                  homeProfile,
                  awayProfile,
                  homeCurrentSurfaceRecord,
                  awayCurrentSurfaceRecord,
                };

              // Add match to array
              matchesWithAtLeastOneGoodRecord.push(
                matchPlayerProfilesAndSurfaceRecords
              );
            }
          }
        }
      }
    }

    // Sort active matches by highest differential in days since last match
    const sortedMatches = matchesWithAtLeastOneGoodRecord
      .sort((a, b) => {
        const aHomeRecord =
          a.homeCurrentSurfaceRecord.win - a.homeCurrentSurfaceRecord.loss;
        const aAwayRecord =
          a.awayCurrentSurfaceRecord.win - a.awayCurrentSurfaceRecord.loss;
        const aDiff = Math.abs(aHomeRecord - aAwayRecord);

        const bHomeRecord =
          b.homeCurrentSurfaceRecord.win - b.homeCurrentSurfaceRecord.loss;
        const bAwayRecord =
          b.awayCurrentSurfaceRecord.win - b.awayCurrentSurfaceRecord.loss;
        const bTotalDiff = Math.abs(bHomeRecord - bAwayRecord);

        if (aDiff < bTotalDiff) return 1;
        else return -1;
      })
      // Only show the most relevant 30 matches
      .slice(0, 30);

    // Store results in database
    const db = (await clientPromise).db("model");
    const { MatchPlayerProfilesAndSurfaceRecords } = {
      MatchPlayerProfilesAndSurfaceRecords:
        db.collection<MatchPlayerProfilesAndSurfaceRecords>(
          "matchPlayerProfilesAndSurfaceRecords"
        ),
    };

    // Convert to MongoDB object
    const entities = sortedMatches.map((entity) => format.to(entity));
    await MatchPlayerProfilesAndSurfaceRecords.insertMany(entities);

    return true;
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = await getSession({ req });
  const { method } = req;

  // const isAdmin = data?.user.isAdmin;

  // if (!isAdmin) {
  //   return res.status(405).end("Must be an admin to access the model.");
  // }

  await dbConnect();

  switch (method) {
    case "GET":
      return getHighestSurfaceFormDifferential(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
