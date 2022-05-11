import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Player } from "../../../models/Player";
import { PlayerEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get up to 10 players with current win streaks.
 * Streaks must be of at least 3 wins.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @returns an array of players.
 */
const getWinStreaks = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PlayerEntity[] | void> => {
  let players: PlayerEntity[] = [];

  try {
    players = await Player.find().sort("-streak").limit(10);

    return res.status(200).json(players);
  } catch (error) {
    console.log(error);
    return res.status(400).json(players);
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
      return getWinStreaks(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
