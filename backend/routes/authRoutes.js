import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/authMiddleware.js";
import { User } from "../models/user.js";

const router = express.Router();

// Google OAuth login
router.get("/google", (req, res, next) => {
  const role = req.query.role || "student"; // default role if not provided
  // Store role in session temporarily
  // Pass role in OAuth 'state' parameter (Google returns it back safely)
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: JSON.stringify({ role }),
  })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate(
      "google",
      { session: false }, // if you use JWT
      (err, user, info) => {
        if (err) {
          console.error("Passport error:", err);
          return res.redirect(`http://localhost:8081/login?error=internal`);
        }
        if (!user) {
          // This is the role mismatch case
          const message = info?.message || "Authentication failed";
          return res.redirect(
            `http://localhost:8081/login?error=${encodeURIComponent(message)}`
          );
        }

        // User authenticated, generate JWT
        const token = jwt.sign(
          { id: user._id, role: user.role,name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

        // Redirect based on user role
        let redirectUrl = "http://localhost:8081/app/dashboard";
        if (user.role === "student")
          redirectUrl = "http://localhost:8081/app/student-dashboard";
        if (user.role === "counselor")
          redirectUrl = "http://localhost:8081/app/counselor-dashboard";
        if (user.role === "admin") redirectUrl = "http://localhost:8081/app/users";

        res.redirect(redirectUrl);
      }
    )(req, res, next);
  }
);

router.get('/me', requireAuth(), (req, res) => {
  res.json({ user: req.user });
});




// Protected Routes
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
