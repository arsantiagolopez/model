import mongoose from "mongoose";
import { PlayerEntity } from "../types";

const { model, models, Schema } = mongoose;

const PlayerSchema = new Schema<Partial<PlayerEntity>>(
  {
    playerId: {
      type: String,
      required: true,
    },
    profile: {
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
      birthday: {
        type: Date,
        required: true,
      },
      singlesRank: {
        type: Number,
        required: true,
      },
      // doublesRank: {
      //   type: Number,
      //   required: true,
      // },
      sex: {
        type: String,
        required: true,
      },
      hand: {
        type: String,
        required: true,
      },
    },
    record: {
      type: Schema.Types.Mixed,
      required: false,
    },
    form: {
      type: Number,
      required: false,
    },
    streak: {
      type: Number,
      required: false,
    },
    lastMatches: {
      type: Schema.Types.Mixed,
      required: false,
    },
    upcomingMatch: {
      type: Schema.Types.Mixed,
      required: false,
    },
    pastTournamentResults: {
      type: Schema.Types.Mixed,
      required: false,
    },
    injuries: {
      type: Schema.Types.Mixed,
      required: false,
    },
    playerStats: {
      ref: "PlayerStats",
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
