import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id;

    const channelStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "videolikes"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "owner",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: { $size: "$videolikes" } },
                totalSubscribers: { $first: { $size: "$subscribers" } }
            }
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
                totalViews: 1,
                totalLikes: 1,
                totalSubscribers: 1
            }
        }
    ]);
    const stats = channelStats[0] || {
        totalVideos: 0,
        totalViews: 0,
        totalLikes: 0,
        totalSubscribers: 0
    };
    if (stats.totalVideos === 0) {
        const subscriberCount = await Subscription.countDocuments({ channel: channelId });
        stats.totalSubscribers = subscriberCount;
    }

    return res.status(200).json(new ApiResponse(stats, 200, "Channel stats fetched successfully"));



});

const getChannelVideos = asyncHandler(async (req, res) => {
    // Get all the videos uploaded by the channel
    const channelId = req.user._id;
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

    let pageNum = parseInt(page, 10);
    let limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
    if (isNaN(limitNum) || limitNum < 1) limitNum = 10;
    if (limitNum > 50) limitNum = 50;

    const skip = (pageNum - 1) * limitNum;
    const validSortFields = ["createdAt", "views", "likesCount", "title"];
    const validSortTypes = ["asc", "desc"];

    const actualSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const actualSortType = validSortTypes.includes(sortType) ? sortType : "desc";

    const sortOrder = actualSortType === "desc" ? -1 : 1;

    // aggregation pipeline to get video along with like count
    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "videolikes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "videocomments"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$videolikes"
                },
                commentsCount: { $size: "$videocomments" }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                videoFile: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1,
                likesCount: 1,
                commentsCount: 1

            }
        },
        {
            $sort: {
                [actualSortBy]: sortOrder
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNum
        }

    ]);

    // get total count for pagination

    const totalVideos = await Video.countDocuments({ owner: channelId });
    const totalPages = Math.max(1, Math.ceil(totalVideos / limitNum));

    return res.status(200).json(new ApiResponse({
        videos,
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalDocs: totalVideos,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        },
        sortInfo: {
            sortBy: actualSortBy,
            sortType: actualSortType
        }
    }, 200, "Channel videos fetched successfully"));



});



export {
    getChannelStats,
    getChannelVideos
};

