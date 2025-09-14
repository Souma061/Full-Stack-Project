import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from '../utils/apierror.js';
import { ApiResponse } from '../utils/Apiresponse.js';
import { asyncHandler } from '../utils/asynchandler.js';

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params; // Zod validated
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        video: videoId
    });
    let message;

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        message = "Video unliked successfully";
    } else {
        await Like.create({
            likedBy: req.user._id,
            video: videoId
        });
        message = "Video liked successfully";
    }

    const totalLikes = await Like.countDocuments({ video: videoId });
    return res.status(200).json(
        new ApiResponse(
            {
                isLiked: !existingLike,
                totalLikes
            },
            200,
            message
        )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params; // Zod validated

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        likedBy: req.user._id,  // Fixed: user -> likedBy
        comment: commentId
    });
    let message;

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        message = "Comment unliked successfully";
    } else {
        await Like.create({
            likedBy: req.user._id,
            comment: commentId
        });
        message = "Comment liked successfully";
    }
    const totalLikes = await Like.countDocuments({
        comment: commentId
    });

    return res.status(200).json(
        new ApiResponse(
            {
                isLiked: !existingLike,
                totalLikes
            },
            200,
            message
        )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params; // Zod validated
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    const existingLike = await Like.findOne({
        likedBy: req.user._id,
        tweet: tweetId
    });
    let message;
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        message = "Tweet unliked successfully";
    } else {
        await Like.create({
            likedBy: req.user._id,
            tweet: tweetId
        });
        message = "Tweet liked successfully";
    }
    const totalLikes = await Like.countDocuments({ tweet: tweetId });
    return res.status(200).json(
        new ApiResponse(
            {
                isLiked: !existingLike,
                totalLikes
            },
            200,
            message
        )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query; // Zod coerced
    const skip = (page - 1) * limit;

    // Fetch liked videos with pagination
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true, $ne: null }  // Fixed: $exist -> $exists
    }).populate({
        path: 'video',
        select: 'title description videoFiles thumbnail duration views createdAt',  // Fixed: url -> videoFiles
        populate: {
            path: 'owner',
            select: 'username fullName avatar'
        }
    }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    const videos = likedVideos.map(like => like.video).filter(video => video !== null);

    const totalDocs = await Like.countDocuments({
        likedBy: req.user._id,
        video: { $exists: true, $ne: null }  // Fixed: $exist -> $exists
    });
    const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

    return res.status(200).json(
        new ApiResponse(
            {
                videos,
                pagination: {
                    page,
                    limit,
                    totalDocs,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            },
            200,
            "Liked videos fetched successfully"
        )
    );
});

export {
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike
};
