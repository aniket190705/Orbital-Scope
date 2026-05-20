import {
  createCustomSatelliteRecord,
  getDefaultSatellites,
  getSatelliteById,
  getSatellitePasses,
} from "../services/satelliteService.js";

export async function listSatellites(req, res, next) {
  try {
    const satellites = await getDefaultSatellites();

    res.status(200).json({
      data: satellites,
      meta: {
        count: satellites.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSatellite(req, res, next) {
  try {
    const satellite = await getSatelliteById(req.params.id);

    res.status(200).json({
      data: satellite,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCustomSatellite(req, res, next) {
  try {
    const satellite = createCustomSatelliteRecord(req.body);

    res.status(201).json({
      data: satellite,
    });
  } catch (error) {
    next(error);
  }
}

export async function listSatellitePasses(req, res, next) {
  try {
    const passes = await getSatellitePasses(req.params.id, {
      lat: req.query.lat,
      lng: req.query.lng,
      altitudeKm: req.query.altitudeKm,
    });

    res.status(200).json({
      data: passes,
    });
  } catch (error) {
    next(error);
  }
}
