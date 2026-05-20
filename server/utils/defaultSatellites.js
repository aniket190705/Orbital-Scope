import { createHttpError } from "./httpError.js";

export const DEFAULT_SATELLITE_IDS = [
  "25544",
  "20580",
  "44714",
  "43013",
  "25994",
  "40697",
  "49260",
  "28129",
  "37846",
  "48274",
];

export function normalizeNoradId(value) {
  const normalized = String(value ?? "").trim();

  if (!/^\d{1,10}$/.test(normalized)) {
    throw createHttpError(400, "Satellite id must be a valid NORAD catalog number.");
  }

  return normalized;
}
