import mongoose from "mongoose";
import { MatchEntity } from "../types";

const { models, Schema } = mongoose;

const MatchSchema = new Schema<MatchEntity>(
  {
    matchId: {
      type: String,
      required: true,
    },
    tournament: {
      type: String,
      required: true,
    },
    tournamentId: {
      type: String,
      required: true,
    },
    tournamentLink: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    surface: {
      type: String,
      required: false,
    },
    round: {
      type: String,
      required: false,
    },
    date: {
      type: Schema.Types.Mixed,
      required: false,
    },
    homeLink: {
      type: String,
      required: false,
    },
    awayLink: {
      type: String,
      required: false,
    },
    home: {
      type: String,
      required: true,
    },
    away: {
      type: String,
      required: true,
    },
    homeH2h: {
      type: Number,
      required: false,
    },
    awayH2h: {
      type: Number,
      required: false,
    },
    homeOdds: {
      type: Number,
      required: true,
    },
    awayOdds: {
      type: Number,
      required: true,
    },
    matchLink: {
      type: String,
      required: true,
    },
    result: {
      type: Schema.Types.Mixed,
      required: false,
    },
    odds: {
      type: Schema.Types.Mixed,
      required: false,
    },
    headToHeadMatches: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

const modelDb = mongoose.connection.useDb("model");

// Prevent model overwrite upon initial compile
const Match = models.Match || modelDb.model<MatchEntity>("Match", MatchSchema);

export { Match };
