import mongoose from "mongoose";
import { TestEntity } from "../types";

const { models, Schema } = mongoose;

const TestSchema = new Schema<TestEntity>(
  {
    name: {
      type: String,
      required: true,
    },
    passed: {
      type: Boolean,
      default: false,
      required: true,
    },
    date: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const modelDb = mongoose.connection.useDb("model");

// Prevent model overwrite upon initial compile
const Test = models.Test || modelDb.model<TestEntity>("Test", TestSchema);

export { Test };
