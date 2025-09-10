import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public routes (no auth required)
router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);

// Protected routes (auth required)
router.post("/",
    verifyJWT,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    publishAVideo
);

router.patch("/:videoId",
    verifyJWT,
    upload.single("thumbnail"),
    updateVideo
);

router.delete("/:videoId", verifyJWT, deleteVideo);

router.patch("/toggle/publish/:videoId", verifyJWT, togglePublishStatus);

export default router;
