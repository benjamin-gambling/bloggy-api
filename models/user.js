import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
