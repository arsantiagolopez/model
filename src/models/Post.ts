import mongoose from "mongoose";
import { PostEntity } from "../types";

const { model, models, Schema } = mongoose;

const PostSchema = new Schema<PostEntity>(
  {
    platformId: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageHtml: {
      type: String,
      required: false,
    },
    timestamp: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: false,
    },
    comments: {
      type: Number,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Post = models.Post || model<PostEntity>("Post", PostSchema);

export { Post };
