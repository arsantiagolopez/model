import mongoose from "mongoose";
import { MatchEntity } from "../types";

const { model, models, Schema } = mongoose;

const MatchSchema = new Schema<MatchEntity>(
  {
    startTime: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    tournament: {
      type: String,
      required: true,
    },
    homeId: {
      type: String,
      required: true,
    },
    awayId: {
      type: String,
      required: true,
    },
    home: {
      type: String,
      required: true,
    },
    away: {
      type: String,
      required: true,
    },
    h2hHome: {
      type: Number,
      required: true,
    },
    h2hAway: {
      type: Number,
      required: true,
    },
    homeOdds: {
      type: Number,
      required: false,
    },
    awayOdds: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Match = models.Match || model<MatchEntity>("Match", MatchSchema);

export { Match };
