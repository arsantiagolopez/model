import mongoose from "mongoose";
import { ResultEntity } from "../types";

const { models, Schema } = mongoose;

const ResultSchema = new Schema<ResultEntity>(
  {
    matchId: {
      type: String,
      required: true,
    },
    matchLink: {
      type: String,
      required: true,
    },
    tournament: {
      type: String,
      required: true,
    },
    tournamentLink: {
      type: String,
      required: true,
    },
    winnerLink: {
      type: String,
      required: true,
    },
    loserLink: {
      type: String,
      required: true,
    },
    winner: {
      type: String,
      required: true,
    },
    loser: {
      type: String,
      required: true,
    },
    winnerSets: {
      type: Number,
      required: true,
    },
    loserSets: {
      type: Number,
      required: true,
    },
    gradedBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const modelDb = mongoose.connection.useDb("model");

// Prevent model overwrite upon initial compile
const Result =
  models.Result || modelDb.model<ResultEntity>("Result", ResultSchema);

export { Result };
