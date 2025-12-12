import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT, verifyJWTOptional } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  VideoCreateBody,
  VideoIdParam,
  VideoListQuery,
  VideoUpdateBody,
} from "../schemas/video.schemas.js";

const router = Router();

// Public routes (no auth required)
router.get("/", validateRequest({ query: VideoListQuery }), getAllVideos);
router.get(
  "/:videoId",
  verifyJWTOptional,
  validateRequest({ params: VideoIdParam }),
  getVideoById
);

// Protected routes (auth required)

router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validateRequest({ body: VideoCreateBody }), // add this
  publishAVideo
);

router.patch(
  "/:videoId",
  verifyJWT,
  upload.single("thumbnail"),
  validateRequest({ params: VideoIdParam, body: VideoUpdateBody }),
  updateVideo
);
router.delete(
  "/:videoId",
  verifyJWT,
  validateRequest({ params: VideoIdParam }),
  deleteVideo
);
router.patch(
  "/toggle/publish/:videoId",
  verifyJWT,
  validateRequest({ params: VideoIdParam }),
  togglePublishStatus
);

export default router;
