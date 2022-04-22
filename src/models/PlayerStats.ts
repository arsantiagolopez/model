import mongoose from "mongoose";
import { PlayerStatsEntity } from "../types";

const { model, models, Schema } = mongoose;

const PlayerStatsSchema = new Schema<PlayerStatsEntity>(
  {
    playerId: {
      type: String,
      required: false,
    },
    player: {
      type: String,
      required: true,
    },
    eloRanking: {
      type: Schema.Types.Mixed,
      required: false,
    },
    yEloRanking: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const PlayerStats =
  models.PlayerStats ||
  model<PlayerStatsEntity>("PlayerStats", PlayerStatsSchema);

export { PlayerStats };
