import { NextApiRequest, NextApiResponse } from "next";
import { Player } from "../../../../models/Player";
import { PlayerEntity, PlayerProfile } from "../../../../types";
import { dbConnect } from "../../../../utils/dbConnect";

/**
 * Get player profile by ID.
 * @param req - http request, including the query.
 * @param res - http response.
 * @returns an object of the player.
 */
const getPlayerProfile = async (
  { query }: NextApiRequest,
  res: NextApiResponse
): Promise<PlayerProfile | void> => {
  let { playerId } = query;

  playerId = `/player/${playerId}/`;

  try {
    const player: PlayerEntity | null = await Player.findOne({ playerId });
    return res.status(200).json(player?.profile);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = await getSession({ req });
  const { method } = req;

  // if (!data?.user?.isAdmin) {
  //   return res.status(405).end("Must be an admin to update a post.");
  // }

  await dbConnect();

  switch (method) {
    case "GET":
      return getPlayerProfile(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
