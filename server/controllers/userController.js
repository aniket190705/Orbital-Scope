import prisma from "../config/prisma.js";
import { createHttpError } from "../utils/httpError.js";
import { getSatelliteById } from "../services/satelliteService.js";

export async function listFavorites(req, res, next) {
  try {
    const favorites = await prisma.favoriteSatellite.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const satellites = await Promise.all(
      favorites.map(async (favorite) => {
        const satellite = await getSatelliteById(favorite.satelliteId);
        return {
          id: favorite.id,
          satelliteId: favorite.satelliteId,
          createdAt: favorite.createdAt,
          satellite,
        };
      })
    );

    res.status(200).json({
      data: satellites,
    });
  } catch (error) {
    next(error);
  }
}

export async function addFavorite(req, res, next) {
  try {
    const satellite = await getSatelliteById(req.params.id);

    const existingFavorite = await prisma.favoriteSatellite.findUnique({
      where: {
        userId_satelliteId: {
          userId: req.user.id,
          satelliteId: satellite.id,
        },
      },
    });

    if (existingFavorite) {
      return res.status(200).json({
        data: existingFavorite,
        message: "Satellite is already in favorites.",
      });
    }

    const favorite = await prisma.favoriteSatellite.create({
      data: {
        userId: req.user.id,
        satelliteId: satellite.id,
        satelliteName: satellite.name,
      },
    });

    return res.status(201).json({
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const favorite = await prisma.favoriteSatellite.findUnique({
      where: {
        userId_satelliteId: {
          userId: req.user.id,
          satelliteId: req.params.id,
        },
      },
    });

    if (!favorite) {
      throw createHttpError(404, "Favorite satellite not found.");
    }

    await prisma.favoriteSatellite.delete({
      where: {
        id: favorite.id,
      },
    });

    res.status(200).json({
      message: "Favorite removed successfully.",
    });
  } catch (error) {
    next(error);
  }
}
