import { NextApiRequest, NextApiResponse } from "next";
import { Tournament } from "../../../models/Tournament";
import { TournamentDetails, TournamentEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get a list of tournaments details.
 * @param req - HTTP request.
 * @param res - HTTP response.
 * @returns an array of objects of all tournament details.
 */
const getTournamentDetails = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<TournamentDetails[] | void> => {
  try {
    const tournaments: TournamentEntity[] = await Tournament.find();

    const tournamentDetails: TournamentDetails[] = tournaments.map(
      ({
        tournamentId,
        name,
        country,
        countryCode,
        surface,
        type,
        sex,
        prize,
        details,
      }) => {
        // Last details row is winner details
        const points = details?.length
          ? Number(details[details.length - 1].rankingPoints)
          : undefined;

        return {
          tournamentId,
          name,
          country,
          countryCode,
          surface,
          type,
          sex,
          prize,
          points,
        };
      }
    );

    return res.status(200).json(tournamentDetails);
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
      return getTournamentDetails(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
