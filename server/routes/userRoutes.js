import { Router } from "express";

import {
  addFavorite,
  listFavorites,
  removeFavorite,
} from "../controllers/userController.js";
import authenticateJwt from "../middleware/authenticateJwt.js";
import validateRequest from "../middleware/validateRequest.js";
import { satelliteIdParamsSchema } from "../utils/validators.js";

const router = Router();

router.use(authenticateJwt);
router.get("/favorites", listFavorites);
router.post(
  "/favorites/:id",
  validateRequest(satelliteIdParamsSchema, "params"),
  addFavorite
);
router.delete(
  "/favorites/:id",
  validateRequest(satelliteIdParamsSchema, "params"),
  removeFavorite
);

export default router;
