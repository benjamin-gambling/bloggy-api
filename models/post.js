import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("Post", PostSchema);
