import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params; // Zod validated
  // TODO: toggle subscription
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  // prevent user from subscribing to himself

  if (channelId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  let message;
  let isSubscribed;

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    isSubscribed = false;
    message = "Unsubscribed successfully";
  } else {
    await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
    isSubscribed = true;
    message = "Subscribed successfully";
  }

  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res.status(200).json(
    new ApiResponse(
      {
        isSubscribed,
        subscriberCount,
        channelInfo: {
          channelId: channel._id,
          channelName: channel.fullName,
          username: channel.username,
        },
      },
      200,
      message
    )
  );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params; // Zod validated
  const { page = 1, limit = 20 } = req.query; // Zod coerced

  const skip = (page - 1) * limit;
  ///get subscriber list with user details

  const subscribers = await Subscription.find({
    channel: channelId,
  })
    .populate({
      path: "subscriber",
      select: "username fullName avatar",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });
  const totalPages = Math.max(1, Math.ceil(totalSubscribers / limit));

  return res.status(200).json(
    new ApiResponse(
      {
        subscribers: subscribers.map((sub) => sub.subscriber),
        pagination: {
          page,
          limit,
          totalDocs: totalSubscribers,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      200,
      "Subscribers fetched successfully"
    )
  );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params; // Zod validated
  const { page = 1, limit = 20 } = req.query; // Zod coerced

  const skip = (page - 1) * limit;
  ///get subscriber list with user details

  const subscriptions = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate({
      path: "channel",
      select: "username fullName avatar",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalSubscriptions = await Subscription.countDocuments({
    subscriber: subscriberId,
  });
  const totalPages = Math.max(1, Math.ceil(totalSubscriptions / limit));

  return res.status(200).json(
    new ApiResponse(
      {
        channels: subscriptions.map((sub) => sub.channel),
        pagination: {
          page,
          limit,
          totalDocs: totalSubscriptions,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      200,
      "Subscribed channels fetched successfully"
    )
  );
});

export { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription };
