import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Match } from "../../../models/Match";
import { Player } from "../../../models/Player";
import { PlayerStats } from "../../../models/PlayerStats";
import { Tournament } from "../../../models/Tournament";
import { dbConnect } from "../../../utils/dbConnect";
import { resetTests } from "../tests";
import {
  upsertMatches,
  upsertPlayers,
  upsertSchedule,
  upsertTournaments,
} from "./[id]";

/**
 * Scrape tomorrow's data & update database.
 * @param req - HTTP request.
 * @param res - HTTP response.
 * @returns a success boolean.
 */
const scrapeTomorrow = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<boolean | void> => {
  let success = true;

  try {
    // Reset all tests
    await resetTests();

    // Delete previous entities
    await Promise.all([
      Match.deleteMany(),
      Tournament.deleteMany(),
      Player.deleteMany(),
      PlayerStats.deleteMany(),
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

    // // Scrape stats
    // success = await upsertStats();
    // if (!success) return success;

    // All data should be scrape by now

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
