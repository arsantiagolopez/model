import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Match } from "../../../models/Match";
import { Player } from "../../../models/Player";
import { PlayerStats } from "../../../models/PlayerStats";
import { Tournament } from "../../../models/Tournament";
import {
  MatchPlayerProfilesAndDates,
  MatchPlayerProfilesAndSurfaceRecords,
  PlayerAndCountry,
  PlayerEntity,
} from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";
import { clientPromise } from "../../../utils/mongodb";
import { storeCountryStatsOnDb } from "../stats/country";
import { storeInformPlayersOnDb } from "../stats/form";
import { storeRustStatsOnDb } from "../stats/rust";
import { storeSurfaceStatsOnDb } from "../stats/surface";
import { resetTests } from "../tests";
import {
  upsertMatches,
  upsertPlayers,
  upsertSchedule,
  upsertStats,
  upsertTournaments,
} from "./[id]";

/**
 * Scrape tomorrow's data & update database.
 * @param req - HTTP request.
 * @param res - HTTP response.
 * @returns a success boolean.
 */
const scrapeTomorrow = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean | void> => {
  let success = true;

  // Start db instance
  const db = (await clientPromise).db("model");
  const {
    PlayersAndCountries,
    InformPlayers,
    MatchPlayerProfilesAndDates,
    MatchPlayerProfilesAndSurfaceRecords,
  } = {
    PlayersAndCountries: db.collection<PlayerAndCountry>("playersAndCountries"),
    InformPlayers: db.collection<PlayerEntity>("informPlayers"),
    MatchPlayerProfilesAndDates: db.collection<MatchPlayerProfilesAndDates>(
      "matchPlayerProfilesAndDates"
    ),
    MatchPlayerProfilesAndSurfaceRecords:
      db.collection<MatchPlayerProfilesAndSurfaceRecords>(
        "matchPlayerProfilesAndSurfaceRecords"
      ),
  };

  try {
    // Reset all tests
    await resetTests();

    // Delete previous entities
    await Promise.all([
      Match.deleteMany(),
      Tournament.deleteMany(),
      Player.deleteMany(),
      PlayerStats.deleteMany(),
      // Stats collections
      // @ts-ignore
      PlayersAndCountries.deleteMany({}),
      InformPlayers.deleteMany({}),
      MatchPlayerProfilesAndDates.deleteMany({}),
      MatchPlayerProfilesAndSurfaceRecords.deleteMany({}),
    ]);

    // Scrape schedule
    success = await upsertSchedule();
    if (!success) return success;

    // Scrape tournaments
    success = await upsertTournaments();
    if (!success) return success;

    // Scrape matches
    success = await upsertMatches();
    if (!success) return success;

    // Scrape players
    success = await upsertPlayers();
    if (!success) return success;

    // Scrape stats
    success = await upsertStats();
    if (!success) return success;

    // // Scrape results
    // success = await upsertResults();
    // if (!success) return success;

    // All data should be scraped by now

    // Cache all stats
    await storeCountryStatsOnDb(req, res);
    await storeInformPlayersOnDb(req, res);
    await storeRustStatsOnDb(req, res);
    await storeSurfaceStatsOnDb(req, res);

    return res.status(200).json(success);
  } catch (error) {
    success = false;
    console.log(error);
    return res.status(400).json(success);
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSession({ req });
  const { method } = req;

  const isAdmin = data?.user.isAdmin;

  await dbConnect();

  switch (method) {
    case "POST":
      if (!isAdmin) {
        return res.status(405).end("Must be an admin to run the model.");
      }
      // Scrape all of tomorrow's data
      return scrapeTomorrow(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
