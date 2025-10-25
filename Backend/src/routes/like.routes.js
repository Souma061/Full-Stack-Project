import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  LikeCommentIdParam,
  LikeTweetIdParam,
  LikeVideoIdParam,
  LikedVideosQuery,
} from "../schemas/like.schemas.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/toggle/v/:videoId")
  .post(validateRequest({ params: LikeVideoIdParam }), toggleVideoLike);
router
  .route("/toggle/c/:commentId")
  .post(validateRequest({ params: LikeCommentIdParam }), toggleCommentLike);
router
  .route("/toggle/t/:tweetId")
  .post(validateRequest({ params: LikeTweetIdParam }), toggleTweetLike);
router
  .route("/videos")
  .get(validateRequest({ query: LikedVideosQuery }), getLikedVideos);

export default router;
