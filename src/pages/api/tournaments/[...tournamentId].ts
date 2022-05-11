import { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../models/Tournament";
import { TournamentEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get tournament by ID.
 * @param req - http request, including the body.
 * @param res - http response.
 * @returns an object of the tournament.
 */
const getTournamentById = async (
  { query }: NextApiRequest,
  res: NextApiResponse
): Promise<TournamentEntity | void> => {
  let { tournamentId } = query;

  tournamentId = Array.isArray(tournamentId)
    ? `/${tournamentId.join("/")}/`
    : tournamentId;

  try {
    const tournament = await Tournament.findOne({ tournamentId });
    return res.status(200).json(tournament);
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
      return getTournamentById(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
