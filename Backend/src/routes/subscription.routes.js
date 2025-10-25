import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  ChannelIdParam,
  SubscriberIdParam,
  SubscriptionListQuery,
} from "../schemas/subscription.schemas.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(
    validateRequest({ params: ChannelIdParam, query: SubscriptionListQuery }),
    getUserChannelSubscribers
  )
  .post(validateRequest({ params: ChannelIdParam }), toggleSubscription);

router
  .route("/u/:subscriberId")
  .get(
    validateRequest({
      params: SubscriberIdParam,
      query: SubscriptionListQuery,
    }),
    getSubscribedChannels
  );

export default router;
