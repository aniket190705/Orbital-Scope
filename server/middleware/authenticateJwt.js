import prisma from "../config/prisma.js";
import { createHttpError } from "../utils/httpError.js";
import { extractTokenFromRequest, verifyAccessToken } from "../utils/jwt.js";

export async function authenticateJwt(req, res, next) {
  try {
    const token = extractTokenFromRequest(req);

    if (!token) {
      throw createHttpError(401, "Authentication token is required.");
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw createHttpError(401, "Authenticated user could not be found.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default authenticateJwt;
