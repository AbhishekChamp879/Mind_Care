import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";

// Import routes
import ChatRoutes from "./routes/ChatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Import middleware
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Import config
import { connectDB } from "./config/db.js";
import "./config/Passport.js";

// Load environment variables
dotenv.config();

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// Enable CORS with credentials
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:8081",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compress responses
app.use(compression());

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// Parse JSON bodies (limit to 10kb)
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Parse cookies
app.use(cookieParser());

// ============================================
// SESSION & PASSPORT MIDDLEWARE
// ============================================

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret_change_in_production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ============================================
// REQUEST LOGGING (Development only)
// ============================================

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// DATABASE CONNECTION
// ============================================

connectDB();

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Mount routes
app.use("/auth", authRoutes);
app.use("/api", authRoutes); // For /api/auth/* endpoints
app.use("/api", ChatRoutes);
app.use("/api", sessionRoutes);
app.use("/api", forumRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// Handle 404 errors
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🧠 Mind Care Backend Server                                                     
Status: ✅ Running                                      
Port: ${PORT}                                              
Environment: ${process.env.NODE_ENV || 'development'}                                 
Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8081'}             
 `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

export default app;
