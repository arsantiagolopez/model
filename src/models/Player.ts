import mongoose from "mongoose";
import { PlayerEntity } from "../types";

const { model, models, Schema } = mongoose;

const PlayerSchema = new Schema<Partial<PlayerEntity>>(
  {
    platformId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    singlesRank: {
      type: Number,
      required: true,
    },
    doublesRank: {
      type: Number,
      required: true,
    },
    hand: {
      type: String,
      required: true,
    },
    currentTournamentResults: {
      type: Schema.Types.Mixed,
      required: false,
    },
    pastTournamentResults: {
      type: Schema.Types.Mixed,
      required: false,
    },
    lastMatches: {
      type: Schema.Types.Mixed,
      required: false,
    },
    injuries: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Player =
  models.Player || model<Partial<PlayerEntity>>("Player", PlayerSchema);

export { Player };
