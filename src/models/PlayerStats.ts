import mongoose from "mongoose";
import { PlayerStatsEntity } from "../types";

const { models, Schema } = mongoose;

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

const modelDb = mongoose.connection.useDb("model");

// Prevent model overwrite upon initial compile
const PlayerStats =
  models.PlayerStats ||
  modelDb.model<PlayerStatsEntity>("PlayerStats", PlayerStatsSchema);

export { PlayerStats };
