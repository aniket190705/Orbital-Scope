import { Router } from "express";

import {
  createCustomSatellite,
  getSatellite,
  listSatellitePasses,
  listSatellites,
} from "../controllers/satelliteController.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  customSatelliteBodySchema,
  satelliteIdParamsSchema,
  satellitePassQuerySchema,
} from "../utils/validators.js";

const router = Router();

router.get("/", listSatellites);
router.post("/custom", validateRequest(customSatelliteBodySchema), createCustomSatellite);
router.get("/:id", validateRequest(satelliteIdParamsSchema, "params"), getSatellite);
router.get(
  "/:id/passes",
  validateRequest(satelliteIdParamsSchema, "params"),
  validateRequest(satellitePassQuerySchema, "query"),
  listSatellitePasses
);

export default router;
