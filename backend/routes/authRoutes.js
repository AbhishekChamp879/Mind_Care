import express from "express";
import passport from "passport";
import { User } from "../models/user.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { signupValidation, loginValidation } from "../middleware/validator.js";
import { authLimiter, signupLimiter } from "../middleware/rateLimiter.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";

const router = express.Router();

// ============================================
// LOCAL AUTHENTICATION ENDPOINTS
// ============================================

/**
 * POST /auth/signup - Register new user with email/password
 */
router.post(
  "/signup",
  signupLimiter,
  signupValidation,
  catchAsync(async (req, res, next) => {
    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already registered. Please login instead.", 400));
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Set cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: accessToken,
      },
    });
  })
);

/**
 * POST /api/auth/login - Login with email/password
 */
router.post(
  "/api/auth/login",
  authLimiter,
  loginValidation,
  catchAsync(async (req, res, next) => {
    const { email, password, role } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Check if user has password (not OAuth-only user)
    if (!user.password) {
      return next(
        new AppError(
          "This account was created with Google. Please use Google Sign-In.",
          401
        )
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Check role matches
    if (user.role !== role) {
      return next(
        new AppError(
          `Role mismatch. You are registered as a ${user.role}, not ${role}.`,
          403
        )
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError("Account is deactivated. Please contact support.", 403));
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set cookies
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Update last active
    user.updateLastActive();

    res.json({
      status: "success",
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: accessToken,
      },
    });
  })
);

/**
 * GET /api/auth/me - Get current user info
 */
router.get(
  "/api/auth/me",
  requireAuth(),
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        university: user.university,
        major: user.major,
        year: user.year,
      },
    });
  })
);

/**
 * POST /api/auth/logout - Logout user
 */
router.post(
  "/api/auth/logout",
  catchAsync(async (req, res) => {
    // Clear cookies
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    // Destroy session if exists
    if (req.session) {
      req.session.destroy();
    }

    res.json({
      status: "success",
      message: "Logged out successfully",
    });
  })
);

/**
 * POST /api/auth/refresh - Refresh access token
 */
router.post(
  "/api/auth/refresh",
  catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError("Refresh token not found. Please log in again.", 401));
    }

    try {
      const decoded = verifyToken(refreshToken, "refresh");

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        return next(new AppError("User no longer exists or is inactive.", 401));
      }

      // Generate new access token
      const newAccessToken = generateAccessToken(user);

      // Set new cookie
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      res.json({
        status: "success",
        token: newAccessToken,
      });
    } catch (err) {
      return next(new AppError("Invalid refresh token. Please log in again.", 401));
    }
  })
);

// ============================================
// GOOGLE OAUTH ENDPOINTS (Enhanced)
// ============================================

/**
 * GET /auth/google - Initiate Google OAuth
 */
router.get("/google", (req, res, next) => {
  const role = req.query.role || "student";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: JSON.stringify({ role }),
  })(req, res, next);
});

/**
 * GET /auth/google/callback - Google OAuth callback
 */
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate(
      "google",
      { session: false },
      async (err, user, info) => {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8081";

        if (err) {
          console.error("Passport error:", err);
          return res.redirect(`${frontendUrl}/login?error=internal`);
        }

        if (!user) {
          const message = info?.message || "Authentication failed";
          return res.redirect(
            `${frontendUrl}/login?error=${encodeURIComponent(message)}`
          );
        }

        // Generate JWT tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Set cookies
        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Update last active
        user.updateLastActive();

        // Redirect based on role
        let redirectUrl = `${frontendUrl}/app/dashboard`;
        if (user.role === "student") redirectUrl = `${frontendUrl}/app/student-dashboard`;
        if (user.role === "counselor") redirectUrl = `${frontendUrl}/app/counselor-dashboard`;
        if (user.role === "admin") redirectUrl = `${frontendUrl}/app/users`;

        res.redirect(redirectUrl);
      }
    )(req, res, next);
  }
);

// ============================================
// PROTECTED ROUTE EXAMPLES (Keep for backward compatibility)
// ============================================

router.get("/student/dashboard", requireAuth(["student"]), (req, res) => {
  res.json({ message: "Welcome Student!", user: req.user });
});

router.get("/counselor/dashboard", requireAuth(["counselor"]), (req, res) => {
  res.json({ message: "Welcome Counselor!", user: req.user });
});

router.get("/admin/dashboard", requireAuth(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!", user: req.user });
});

export default router;
