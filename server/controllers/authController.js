import passport from "passport";

import env from "../config/env.js";
import prisma from "../config/prisma.js";
import { isGoogleAuthConfigured } from "../config/passport.js";
import {
  AUTH_COOKIE_NAME,
  buildAuthCookieOptions,
  extractTokenFromRequest,
  signAccessToken,
  verifyAccessToken,
} from "../utils/jwt.js";
import { createHttpError } from "../utils/httpError.js";

function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}

function buildFrontendAuthRedirect(token) {
  const redirectUrl = new URL("/?auth=success", env.CLIENT_ORIGIN);
  redirectUrl.searchParams.set("token", token);
  return redirectUrl.toString();
}

export function startGoogleAuth(req, res, next) {
  if (!isGoogleAuthConfigured()) {
    return next(
      createHttpError(
        503,
        "Google authentication is not configured. Add Google OAuth environment variables first."
      )
    );
  }

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
}

export function completeGoogleAuth(req, res, next) {
  if (!isGoogleAuthConfigured()) {
    return next(
      createHttpError(
        503,
        "Google authentication is not configured. Add Google OAuth environment variables first."
      )
    );
  }

  return passport.authenticate("google", { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return next(createHttpError(401, "Google authentication failed."));
    }

    const token = signAccessToken(user);
    const authCookieOptions = buildAuthCookieOptions();

    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

    if (req.accepts(["html", "json"]) === "html") {
      return res.redirect(buildFrontendAuthRedirect(token));
    }

    return res.status(200).json({
      message: "Authenticated successfully.",
      token,
      user: serializeUser(user),
    });
  })(req, res, next);
}

export function logout(req, res, next) {
  try {
    res.clearCookie(AUTH_COOKIE_NAME, buildAuthCookieOptions());
    res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res) {
  try {
    const token = extractTokenFromRequest(req);

    if (!token) {
      return res.status(200).json({ data: null });
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      return res.status(200).json({ data: null });
    }

    return res.status(200).json({
      data: serializeUser(user),
    });
  } catch (error) {
    return res.status(200).json({ data: null });
  }
}
