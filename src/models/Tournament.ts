import mongoose from "mongoose";
import { TournamentEntity } from "../types";

const { model, models, Schema } = mongoose;

const TournamentShema = new Schema<Partial<TournamentEntity>>(
  {
    tournamentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: false,
    },
    surface: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    prize: {
      type: String,
      required: true,
    },
    pastYearsResults: {
      type: Schema.Types.Mixed,
      required: false,
    },
    details: {
      type: Schema.Types.Mixed,
      required: false,
    },
    nextMatches: {
      type: Schema.Types.Mixed,
      required: false,
    },
    results: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Tournament =
  models.Tournament ||
  model<Partial<TournamentEntity>>("Tournament", TournamentShema);

export { Tournament };
