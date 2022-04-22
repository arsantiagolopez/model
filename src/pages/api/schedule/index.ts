import { NextApiRequest, NextApiResponse } from "next";
import { Match } from "../../../models/Match";
import { MatchEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get a schedule of tomorrow's games.
 * @param req - HTTP request.
 * @param res - HTTP response.
 * @returns an array of objects of all user instagram posts.
 */
const getTomorrowsSchedule = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<MatchEntity[] | void> => {
  try {
    const matches = await Match.find();

    return res.status(200).json(matches);
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
      return getTomorrowsSchedule(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
