import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Player } from "../../../models/Player";
import { Tournament } from "../../../models/Tournament";
import {
  PlayerAndCountry,
  PlayerEntity,
  TournamentEntity,
} from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

interface TournamentHash {
  [tournamendId: string]: Record<string, string>;
}

/**
 * Get all the players playing in ther home country.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 */
const getPlayersPlayingInTheirCountry = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PlayerAndCountry[] | void> => {
  let playersAndCountry: PlayerAndCountry[] = [];

  try {
    const tournaments: TournamentEntity[] = await Tournament.find();

    // Create tournament to countryCode hashmap
    let tournamentHash: TournamentHash = {};

    for (const tournament of tournaments) {
      const { tournamentId, countryCode, country } = tournament;
      if (countryCode) tournamentHash[tournamentId] = { countryCode, country };
    }

    const players: PlayerEntity[] = await Player.find();

    for (const player of players) {
      const { profile, upcomingMatch } = player;
      const { tournamentId } = upcomingMatch || {};

      let country: string | undefined = undefined;
      let countryCode: string | undefined = undefined;

      if (tournamentId) {
        const playerCountry = profile?.country?.toLowerCase();
        const tournamentCountry = tournamentHash[tournamentId].country;

        // If player playing in home country
        if (playerCountry === tournamentCountry) {
          country = tournamentHash[tournamentId].country;
          countryCode = tournamentHash[tournamentId].countryCode;

          const playerAndCountry: PlayerAndCountry = {
            player,
            country,
            countryCode,
          };

          // Push player to array
          playersAndCountry.push(playerAndCountry);
        }
      }
    }

    // Sort players by tournament name
    playersAndCountry.sort((a, b) => a.country.localeCompare(b.country));

    return res.status(200).json(playersAndCountry);
  } catch (error) {
    console.log(error);
    return res.status(400).json(playersAndCountry);
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
      return getPlayersPlayingInTheirCountry(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
