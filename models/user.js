import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    googleId: { type: String },
    role: { type: String, default: "student" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
