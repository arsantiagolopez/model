import { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../models/Tournament";
import { TournamentEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get a list of tournaments.
 * @param req - HTTP request.
 * @param res - HTTP response.
 * @returns an array of objects of all of tomorrow's tournaments.
 */
const getTournaments = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<TournamentEntity[] | void> => {
  try {
    const tournaments: TournamentEntity[] = await Tournament.find();
    return res.status(200).json(tournaments);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = await getSession({ req });
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getTournaments(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
