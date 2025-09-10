import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
// import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

// GET /api/v1/videos/:videoId/comments?page=1&limit=10
// Returns paginated comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params; // ensure route uses :videoId
    let { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50; // hard cap

    const filter = { video: new mongoose.Types.ObjectId(videoId) };
    const totalDocs = await Comment.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalDocs / limit));
    const skip = (page - 1) * limit;

    const comments = await Comment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("owner", "username fullName avatar")
        .lean();

    return res.status(200).json(
        new ApiResponse(
            {
                comments,
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
            "Comments fetched successfully"
        )
    );
    // What I have done so far:
    // 1. Validated video ID
    // 2. Parsed and validated pagination parameters (page, limit)
    // 3. Queried comments with pagination and sorting
    // 4. Populated owner details
    // 5. Structured response with comments and pagination metadata
    // Next steps:
    // - Test the endpoint with various scenarios (different page/limit values, no comments, etc.)
});

// POST /api/v1/videos/:videoId/comments
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        video: videoId,
        owner: req.user._id,
        content: content.trim()
    });

    return res
        .status(201)
        .json(new ApiResponse(comment, 201, "Comment added successfully"));

        // What I have done so far:
    // 1. Validated video ID and comment content
    // 2. Created new comment associated with video and user
    // 3. Returned structured response with created comment details
    // Next steps:
    // - Test the endpoint with various scenarios (valid/invalid data)
});


// PATCH /api/v1/videos/comments/:commentId
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }
    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    // atomic update ensuring ownership
    const updated = await Comment.findOneAndUpdate(
        { _id: commentId, owner: req.user._id },
        { $set: { content: content.trim() } },
        { new: true }
    );

    if (!updated) {
        throw new ApiError(404, "Comment not found or not authorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(updated, 200, "Comment updated successfully"));

        // What I have done so far:
    // 1. Validated comment ID and new content
    // 2. Performed atomic update ensuring user ownership
    // 3. Returned structured response with updated comment details
    // Next steps:
    // - Test the endpoint with various scenarios (valid update, invalid data)
});

// DELETE /api/v1/videos/comments/:commentId
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const deleted = await Comment.findOneAndDelete({ _id: commentId, owner: req.user._id });
    if (!deleted) {
        throw new ApiError(404, "Comment not found or not authorized");
    }

    return res
        .status(200)
        .json(new ApiResponse({}, 200, "Comment deleted successfully"));

        // What I have done so far:
    // 1. Validated comment ID
    // 2. Performed atomic delete ensuring user ownership
    // 3. Returned structured response confirming deletion
    // Next steps:
    // - Test the endpoint with various scenarios (valid delete, unauthorized, non-existent comment)
});

export { addComment, deleteComment, getVideoComments, updateComment };

