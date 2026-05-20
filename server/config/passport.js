import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import env from "./env.js";
import prisma from "./prisma.js";

const googleAuthConfigured = Boolean(
  env.GOOGLE_CLIENT_ID &&
    env.GOOGLE_CLIENT_SECRET &&
    env.GOOGLE_CALLBACK_URL
);

export function isGoogleAuthConfigured() {
  return googleAuthConfigured;
}

export function configurePassport() {
  if (!googleAuthConfigured) {
    console.warn("Google OAuth is not configured. /api/auth/google will return 503.");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error("Google profile did not include an email address."));
          }

          const user = await prisma.user.upsert({
            where: { email },
            update: {
              googleId: profile.id,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value ?? null,
            },
            create: {
              email,
              googleId: profile.id,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value ?? null,
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}
