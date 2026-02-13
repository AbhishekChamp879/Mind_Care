// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  name: String,
  role: { type: String, enum: ["student", "counselor", "admin"], default: "student" },
});

export const User = mongoose.model("User", userSchema);
