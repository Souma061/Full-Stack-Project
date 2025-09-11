import { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }
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
        subscriber: req.user._id
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
            subscriber: req.user._id
        });
        isSubscribed = true;
        message = "Subscribed successfully";
    }

    const subscriberCount = await Subscription.countDocuments({ channel: channelId });

    return res.status(200).json(new ApiResponse({
        isSubscribed,
        subscriberCount,
        channelInfo: {
            channelId: channel._id,
            channelName: channel.fullName,
            username: channel.username,
        }
    }, 200, message)
    );

});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    let pageNum = parseInt(page, 10);
    let limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
    if (isNaN(limitNum) || limitNum < 1) limitNum = 10;
    if (limitNum > 50) limitNum = 50; // hard cap

    const skip = (pageNum - 1) * limitNum;
    ///get subscriber list with user details

    const subscribers = await Subscription.find({
        channel: channelId
    }).populate({
        path: "subscriber",
        select: "username fullName avatar"
    }).sort({ createdAt: - 1 }).skip(skip).limit(limitNum).lean();

    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalPages = Math.max(1, Math.ceil(totalSubscribers / limitNum));

    return res.status(200).json(new ApiResponse({
        subscribers: subscribers.map(sub => sub.subscriber),
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalDocs: totalSubscribers,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }
    }, 200, "Subscribers fetched successfully"));

});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    // const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id");
    }

    let pageNum = parseInt(page, 10);
    let limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
    if (isNaN(limitNum) || limitNum < 1) limitNum = 10;
    if (limitNum > 50) limitNum = 50; // hard cap

    const skip = (pageNum - 1) * limitNum;
    ///get subscriber list with user details

    const subscriptions = await Subscription.find({
        subscriber: subscriberId
    }).populate({
        path: "channel",
        select: "username fullName avatar"
    }).sort({ createdAt: - 1 }).skip(skip).limit(limitNum).lean();

    const totalSubscriptions = await Subscription.countDocuments({ subscriber: subscriberId });
    const totalPages = Math.max(1, Math.ceil(totalSubscriptions / limitNum));

    return res.status(200).json(new ApiResponse({
        channels: subscriptions.map(sub => sub.channel),
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalDocs: totalSubscriptions,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }
    }, 200, "Subscribed channels fetched successfully"));
});

export {
    getSubscribedChannels, getUserChannelSubscribers, toggleSubscription
};

