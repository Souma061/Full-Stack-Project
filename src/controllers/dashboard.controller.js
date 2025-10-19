import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // Zod not required here; no external inputs beyond auth
  const channelId = req.user._id;

  const channelStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videolikes",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$videolikes" } },
        totalSubscribers: { $first: { $size: "$subscribers" } },
      },
    },
    {
      $project: {
        _id: 0,
        totalVideos: 1,
        totalViews: 1,
        totalLikes: 1,
        totalSubscribers: 1,
      },
    },
  ]);
  const stats = channelStats[0] || {
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSubscribers: 0,
  };
  if (stats.totalVideos === 0) {
    const subscriberCount = await Subscription.countDocuments({
      channel: channelId,
    });
    stats.totalSubscribers = subscriberCount;
  }

  return res
    .status(200)
    .json(new ApiResponse(stats, 200, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // Zod validated via DashboardVideosQuery in routes
  const channelId = req.user._id;
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const skip = (page - 1) * limit;
  const sortOrder = sortType === "desc" ? -1 : 1;

  // aggregation pipeline to get video along with like count
  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videolikes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "videocomments",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$videolikes",
        },
        commentsCount: { $size: "$videocomments" },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        videoFiles: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        commentsCount: 1,
      },
    },
    { $sort: { [sortBy]: sortOrder } },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  // get total count for pagination

  const totalVideos = await Video.countDocuments({ owner: channelId });
  const totalPages = Math.max(1, Math.ceil(totalVideos / limit));

  return res.status(200).json(
    new ApiResponse(
      {
        videos,
        pagination: {
          page,
          limit,
          totalDocs: totalVideos,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        sortInfo: {
          sortBy,
          sortType,
        },
      },
      200,
      "Channel videos fetched successfully"
    )
  );
});

export { getChannelStats, getChannelVideos };
