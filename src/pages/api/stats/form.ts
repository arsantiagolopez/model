import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { Player } from "../../../models/Player";
import { PlayerEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get top 10 players with the best form in their last 10 games.
 * @param req - HTTP Request object.
 * @param res - HTTP Response object.
 */
const getTopPlayersWithBestForm = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<PlayerEntity[] | void> => {
  let players: PlayerEntity[] = [];

  try {
    // Get initial 75 player pool with best form percentage
    players = await Player.find({}, null, { limit: 75 }).sort("-form");

    let updatedPlayersWithForm: PlayerEntity[] = [];

    /**
     * Readjustment 1: Competition level, ATP/WTA > Challengers > ITFs
     * Take into account recent players competition.
     * If player played higher competition and won, reward with higher form.
     * If player played higher competiton and lost, reward few points.
     * If player played lower competition and lost, subtract points from form.
     */

    for (let player of players) {
      let { lastMatches, upcomingMatch } = player;

      // ATP/WTA > Challenger > ITF
      const upcomingTourLevel = upcomingMatch?.tournament
        ?.toLowerCase()
        .includes("chall")
        ? "challenger"
        : upcomingMatch?.tournament?.toLowerCase().includes("itf")
        ? "itf"
        : "atp";

      /**
       * Compare last matches competition with upcoming match
       * Consider weight values of level in competitions played
       * If upcoming match is ATP and last match was Challenger, last match value drops 0.25
       * If upcoming match is ATP and last match was ITF, last match value drops 0.5
       * Opposite works as well. Upcoming is ITF, last was ATP? Match value is 1.5
       */
      const wins = lastMatches
        // Sort from most recent to oldest matches
        .sort((a, b) =>
          moment(b.date).valueOf() > moment(a.date).valueOf() ? 1 : -1
        )
        .reduce((acc, { tournament, home, result }) => {
          const won = home === result?.winner;

          const isChallenger = tournament?.toLowerCase().includes("chall");
          const isITF = tournament?.toLowerCase().includes("itf");
          const matchTourLevel = isChallenger
            ? "challenger"
            : isITF
            ? "itf"
            : "atp";

          let resultValue = 0;

          // Add a positive to the avg
          if (won) {
            switch (upcomingTourLevel) {
              // Value weighed around independent upcoming match tour level
              // If the upcoming match is an ATP
              case "atp":
                // And the match just won was an ATP
                resultValue =
                  matchTourLevel === "atp"
                    ? 1
                    : matchTourLevel === "challenger"
                    ? 0.75
                    : 0.5;
                return acc + resultValue;

              // If the upcoming match is a challenger
              case "challenger":
                resultValue =
                  matchTourLevel === "atp"
                    ? 1.25
                    : matchTourLevel === "challenger"
                    ? 1
                    : 0.75;
                return acc + resultValue;

              // If the upcoming match is an ITF
              case "itf":
                resultValue =
                  matchTourLevel === "atp"
                    ? 1.5
                    : matchTourLevel === "challenger"
                    ? 1.25
                    : 1;
                return acc + resultValue;
            }
          }

          // Match lost, but some credit to be given for playing higher level competitions, if so
          else {
            switch (upcomingTourLevel) {
              // If the upcoming match is an ATP
              case "atp":
                // And the match just lost was a...
                resultValue =
                  matchTourLevel === "atp"
                    ? 0
                    : matchTourLevel === "challenger"
                    ? -0.25
                    : -0.5;
                return acc + resultValue;

              // If the upcoming match is a challenger
              case "challenger":
                resultValue =
                  matchTourLevel === "atp"
                    ? 0.25
                    : matchTourLevel === "challenger"
                    ? 0
                    : -0.25;
                return acc + resultValue;

              // If the upcoming match is an ITF
              case "itf":
                // Give credit for playing a high level match
                resultValue =
                  matchTourLevel === "atp"
                    ? 0.5
                    : matchTourLevel === "challenger"
                    ? 0.25
                    : 0;
                return acc + resultValue;
            }
          }
        }, 0);

      // Calculate final winAvg/form
      const winAvg = wins / lastMatches.length;

      // Only give weight if at least 5 matches played
      const form = lastMatches.length > 4 ? winAvg : 0;

      // Update player with form
      // @ts-ignore
      player = { ...player?._doc, form };

      // Push updated player to players array
      updatedPlayersWithForm.push(player);
    }

    // Get best 10 inform players
    updatedPlayersWithForm = updatedPlayersWithForm
      .sort((a, b) => (Number(b.form) > Number(a.form) ? 1 : -1))
      .slice(0, 10);

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
