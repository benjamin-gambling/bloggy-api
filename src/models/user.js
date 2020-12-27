const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, minlength: 5, required: true },
    password: { type: String, required: true, minlength: 6 },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
