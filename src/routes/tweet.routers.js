import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  TweetCreateBody,
  TweetIdParam,
  TweetUpdateBody,
  TweetUserIdParam,
} from "../schemas/tweet.schemas.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(validateRequest({ body: TweetCreateBody }), createTweet);
router
  .route("/user/:userId")
  .get(validateRequest({ params: TweetUserIdParam }), getUserTweets);
router
  .route("/:tweetId")
  .patch(
    validateRequest({ params: TweetIdParam, body: TweetUpdateBody }),
    updateTweet
  )
  .delete(validateRequest({ params: TweetIdParam }), deleteTweet);

// export default router;

export default router;




