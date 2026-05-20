import jwt from "jsonwebtoken";

import env from "../config/env.js";
import { createHttpError } from "./httpError.js";

export const AUTH_COOKIE_NAME = "orbital_scope_token";

function getJwtSecret() {
  if (!env.JWT_SECRET) {
    throw createHttpError(
      503,
      "JWT authentication is not configured. Add JWT_SECRET to the server environment."
    );
  }

  return env.JWT_SECRET;
}

export function signAccessToken(user) {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (error) {
    throw createHttpError(401, "Authentication token is invalid or expired.");
  }
}

export function extractTokenFromRequest(req) {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;

  return bearerToken ?? req.cookies?.[AUTH_COOKIE_NAME] ?? null;
}

export function buildAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
