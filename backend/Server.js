import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import ChatRoutes from "./routes/ChatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/Passport.js";

dotenv.config();

const app = express();

// Parse JSON bodies
app.use(express.json());

// CORS: make sure origin matches your frontend
app.use(cors({ origin: "http://localhost:8081", credentials: true }));

// Other middleware
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/api", ChatRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
