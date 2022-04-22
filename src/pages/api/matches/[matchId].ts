import { NextApiRequest, NextApiResponse } from "next";
import { Match } from "../../../models/Match";
import { MatchEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get match by ID.
 * @param req - http request, including the query.
 * @param res - http response.
 * @returns an object of the match.
 */
const getMatchById = async (
  { query }: NextApiRequest,
  res: NextApiResponse
): Promise<MatchEntity | void> => {
  let { matchId } = query;

  try {
    const match = await Match.findOne({ matchId });
    return res.status(200).json(match);
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
      return getMatchById(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
