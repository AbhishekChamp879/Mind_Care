import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔹 Google OAuth callback triggered");
        console.log("🔹 Profile:", profile.emails[0].value);

        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;

        // Parse state param safely
        let requestedRole = "student";
        if (req.query.state) {
          try {
            const stateData = JSON.parse(req.query.state);
            requestedRole = stateData.role || "student";
          } catch (err) {
            console.warn("⚠️ Failed to parse state:", err);
          }
        }

        let user = await User.findOne({ email });

        if (user) {
          console.log("✅ User found in DB:", user.email);
          if (user.role !== requestedRole) {
            console.log(
              `❌ Role mismatch: existing=${user.role}, requested=${requestedRole}`
            );
            return done(
              null,
              false,
              { message: `Role mismatch: You are already registered as a ${user.role}` }
            );
          }
          return done(null, user);
        }

        console.log("🆕 Creating new user...");
        const newUser = await User.create({
          googleId,
          email,
          name: profile.displayName,
          role: requestedRole,
        });

        console.log("✅ User created:", newUser);
        return done(null, newUser);
      } catch (err) {
        console.error("🔥 Error in GoogleStrategy:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
