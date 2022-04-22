import mongoose from "mongoose";
import { TestEntity } from "../types";

const { model, models, Schema } = mongoose;

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

// Prevent model overwrite upon initial compile
const Test = models.Test || model<TestEntity>("Test", TestSchema);

export { Test };
