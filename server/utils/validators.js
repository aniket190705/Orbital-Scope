import { z } from "zod";

export const satelliteIdParamsSchema = z.object({
  id: z.string().regex(/^\d{1,10}$/, "Satellite id must be a NORAD catalog number."),
});

export const customSatelliteBodySchema = z.object({
  id: z
    .string()
    .regex(/^\d{1,10}$/)
    .optional(),
  name: z.string().trim().min(1).max(100).optional(),
  tle1: z.string().trim().min(10).max(120),
  tle2: z.string().trim().min(10).max(120),
});

export const satellitePassQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  altitudeKm: z.coerce.number().min(0).max(10).default(0),
});
