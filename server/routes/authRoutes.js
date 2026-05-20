import { Router } from "express";

import {
  completeGoogleAuth,
  getCurrentUser,
  logout,
  startGoogleAuth,
} from "../controllers/authController.js";

const router = Router();

router.get("/google", startGoogleAuth);
router.get("/google/callback", completeGoogleAuth);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

export default router;
