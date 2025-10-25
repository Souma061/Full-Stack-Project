import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { DashboardVideosQuery } from "../schemas/dashboard.schemas.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router
  .route("/videos")
  .get(validateRequest({ query: DashboardVideosQuery }), getChannelVideos);

export default router;
