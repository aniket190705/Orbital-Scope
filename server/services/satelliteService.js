import * as satellite from "satellite.js";

import env from "../config/env.js";
import { getCachedValue, setCachedValue } from "../config/redis.js";
import { DEFAULT_SATELLITE_IDS, normalizeNoradId } from "../utils/defaultSatellites.js";
import { findFallbackSatellite } from "../utils/fallbackSatellites.js";
import { createHttpError } from "../utils/httpError.js";
import { predictSatellitePasses } from "./passPredictor.js";

function buildCelestrakUrl(id) {
  const configuredBaseUrl = env.CELESTRAK_BASE_URL.trim();

  if (configuredBaseUrl.includes("gp.php")) {
    return `${configuredBaseUrl}?CATNR=${id}&FORMAT=TLE`;
  }

  // Fall back to the known working gp.php endpoint if an older docs URL was configured.
  const fallbackBaseUrl = "https://celestrak.org/NORAD/elements/gp.php";
  return `${fallbackBaseUrl}?CATNR=${id}&FORMAT=TLE`;
}

function extractNoradIdFromTle(tle1) {
  const match = tle1.match(/^1\s+(\d+)/);
  return match?.[1] ?? null;
}

function validateTlePair(tle1, tle2) {
  if (!tle1.startsWith("1 ") || !tle2.startsWith("2 ")) {
    throw createHttpError(400, "TLE lines must begin with '1 ' and '2 '.");
  }

  const satrec = satellite.twoline2satrec(tle1, tle2);
  if (typeof satrec.error === "number" && satrec.error !== 0) {
    throw createHttpError(400, "Invalid TLE data supplied.");
  }

  return satrec;
}

function buildCacheKey(id) {
  return `tle:${id}`;
}

function buildCurrentPosition(tle1, tle2) {
  const satrec = validateTlePair(tle1, tle2);
  const now = new Date();
  const propagation = satellite.propagate(satrec, now);
  const { position, velocity } = propagation;

  if (!position || !velocity) {
    return null;
  }

  const gmst = satellite.gstime(now);
  const geodetic = satellite.eciToGeodetic(position, gmst);
  const speedKph =
    Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2) * 3600;

  return {
    timestamp: now.toISOString(),
    latitude: Number(satellite.degreesLat(geodetic.latitude).toFixed(4)),
    longitude: Number(satellite.degreesLong(geodetic.longitude).toFixed(4)),
    altitudeKm: Number(geodetic.height.toFixed(3)),
    speedKph: Number(speedKph.toFixed(2)),
  };
}

function normalizeSatelliteRecord(baseRecord) {
  return {
    id: normalizeNoradId(baseRecord.id ?? extractNoradIdFromTle(baseRecord.tle1)),
    name: baseRecord.name.trim(),
    tle1: baseRecord.tle1.trim(),
    tle2: baseRecord.tle2.trim(),
    currentPosition: buildCurrentPosition(baseRecord.tle1, baseRecord.tle2),
  };
}

function parseTleResponse(rawText, requestedId) {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 3) {
    throw createHttpError(
      502,
      `Unexpected TLE response format received for NORAD ${requestedId}.`
    );
  }

  const [name, tle1, tle2] = lines;
  return normalizeSatelliteRecord({
    id: requestedId,
    name,
    tle1,
    tle2,
  });
}

async function fetchTleFromUpstream(id) {
  const url = buildCelestrakUrl(id);

  console.log(`Fetching TLE: ${url}`);

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });


    clearTimeout(timeout);

    console.log(`Response status for ${id}: ${response.status}`);

    if (!response.ok) {
      throw createHttpError(
        response.status,
        `Failed to fetch TLE data for NORAD ${id}`
      );
    }

    const rawText = await response.text();

    console.log(`Received TLE for ${id}`);

    return parseTleResponse(rawText, id);

  } catch (error) {
    clearTimeout(timeout);
    console.error(`Failed to fetch TLE for ${id}:`, error);
    throw error;


  }
}


export async function getSatelliteById(id) {
  const normalizedId = normalizeNoradId(id);
  const cacheKey = buildCacheKey(normalizedId);
  const cachedRecord = await getCachedValue(cacheKey);

  if (cachedRecord) {
    return normalizeSatelliteRecord(cachedRecord);
  }

  try {
    const satelliteRecord = await fetchTleFromUpstream(normalizedId);
    await setCachedValue(cacheKey, satelliteRecord, env.REDIS_TTL_SECONDS);
    return satelliteRecord;
  } catch (error) {
    const fallbackSatellite = findFallbackSatellite(normalizedId);

    if (fallbackSatellite) {
      console.warn(
        `Falling back to bundled TLE data for NORAD ${normalizedId} after upstream failure.`
      );
      return normalizeSatelliteRecord(fallbackSatellite);
    }

    throw error;
  }
}

export async function getDefaultSatellites() {
  const results = await Promise.allSettled(
    DEFAULT_SATELLITE_IDS.map(async (id) => getSatelliteById(id))
  );

  const satellites = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Failed to fetch satellite ${DEFAULT_SATELLITE_IDS[index]}:`,
        result.reason
      );
    }
  });

  if (satellites.length === 0) {
    throw createHttpError(
      502,
      "Unable to load satellite data from Celestrak. Check CELESTRAK_BASE_URL and backend logs."
    );
  }

  return satellites;
}


export function createCustomSatelliteRecord(input) {
  const satrec = validateTlePair(input.tle1, input.tle2);
  const fallbackId = extractNoradIdFromTle(input.tle1) ?? input.id ?? "custom";

  if (typeof satrec.error === "number" && satrec.error !== 0) {
    throw createHttpError(400, "Custom satellite TLE data is invalid.");
  }

  return normalizeSatelliteRecord({
    id: fallbackId,
    name: input.name ?? `Custom Satellite ${fallbackId}`,
    tle1: input.tle1,
    tle2: input.tle2,
  });
}

export async function getSatellitePasses(id, observer) {
  const satelliteRecord = await getSatelliteById(id);
  const passes = predictSatellitePasses(
    satelliteRecord.tle1,
    satelliteRecord.tle2,
    {
      lat: observer.lat,
      lng: observer.lng,
      altitudeKm: observer.altitudeKm ?? 0,
    }
  );

  return {
    satellite: satelliteRecord,
    observer: {
      lat: observer.lat,
      lng: observer.lng,
      altitudeKm: observer.altitudeKm ?? 0,
    },
    passes,
  };
}
