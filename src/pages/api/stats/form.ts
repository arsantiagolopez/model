import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Player } from "../../../models/Player";
import { PlayerEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";
import { format } from "../../../utils/formatToMongoEntity";
import { clientPromise } from "../../../utils/mongodb";

// Get cached results from database for quicker lookup times
const getCachedResults = async (): Promise<PlayerEntity[]> => {
  try {
    const db = (await clientPromise).db("main");
    const { InformPlayers } = {
      InformPlayers: db.collection<PlayerEntity>("informPlayers"),
    };

    const results = (await InformPlayers.find().toArray()).map((entity) =>
      format.from(entity)
    );

    return results;
  } catch (error) {
    console.log(`Error fetching cached results. Error: ${error}`);
    return [];
  }
};

// Store results in database for quick lookup after first load
const cacheResults = async (players: PlayerEntity[]): Promise<void> => {
  try {
    const db = (await clientPromise).db("main");
    const { InformPlayers } = {
      InformPlayers: db.collection<PlayerEntity>("informPlayers"),
    };

    // Convert to MongoDB object
    players = players.map((entity) => format.to(entity));

    // Make sure the full player profile is loaded before creating entities
    if (players[0].profile.image) {
      await InformPlayers.insertMany(players);
    }
  } catch (error) {
    console.log(`Error fetching cached results. Error: ${error}`);
  }
};

/**
 * Get top 10 players with the best form in their last 10 games.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 * @returns an array of players.
 */
const getTopPlayersWithBestForm = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PlayerEntity[] | void> => {
  let players: PlayerEntity[] = [];

  // Check if today's data cached
  const cached = await getCachedResults();

  // Return cached results
  if (cached.length) {
    return res.status(200).json(cached);
  }

  try {
    // Get initial 75 player pool with best form percentage
    players = await Player.find().sort("-form");

    let updatedPlayersWithForm: PlayerEntity[] = [];

    for (let player of players) {
      let { lastMatches, form } = player;

      let adjustedForm: number = lastMatches
        // Sort from most recent to oldest matches
        ?.sort((a, b) =>
          moment(b.date).valueOf() > moment(a.date).valueOf() ? 1 : -1
        )
        // Only consider their most recent 5 matches
        ?.slice(0, 5)
        .reduce(
          (acc, match) => {
            const { home, homeOdds, awayOdds, result } = match;
            const { winner } = result || {};

            // Player is always home
            if (winner === home) {
              // Add odds to form –
              // If home was the favourite, he'll add a small number to his form,
              // as his victory was not impressive. If he was the underdog, the odds
              // would be much higher and in return, we get a higher form.
              return acc + homeOdds;
            } else {
              // Substract odds from form –
              // If home was the favourite and loses, away odds will be much higher,
              // resulting on a big negative toll on their form. If they were the
              // underdog, awayOdds will be smaller, so not that much of a toll taken.
              return acc - awayOdds;
            }
          },
          form ? form : 0.1
        );

      // Only give weight if at least 5 matches played
      adjustedForm = lastMatches?.length > 4 ? adjustedForm : 0;

      // Update player with form
      // @ts-ignore
      player = { ...player?._doc, form: adjustedForm };

      // Push updated player to players array
      updatedPlayersWithForm.push(player);
    }

    // Get best 10 inform players
    updatedPlayersWithForm = updatedPlayersWithForm
      .sort((a, b) => (Number(b.form) > Number(a.form) ? 1 : -1))
      .slice(0, 10);

    // Cache daily results in dabatase
    await cacheResults(updatedPlayersWithForm);

    return res.status(200).json(updatedPlayersWithForm);
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
      return getTopPlayersWithBestForm(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
