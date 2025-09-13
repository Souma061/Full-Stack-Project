import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
// import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

// GET /api/v1/videos/:videoId/comments?page=1&limit=10
// Returns paginated comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params; // validated by Zod
  const { page = 1, limit = 10 } = req.query; // validated/coerced by Zod

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
          hasPrevPage: page > 1,
        },
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
  const { videoId } = req.params; // validated by Zod
  const { content } = req.body; // validated by Zod

  const comment = await Comment.create({
    video: videoId,
    owner: req.user._id,
    content: content.trim(),
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
  const { commentId } = req.params; // validated by Zod
  const { content } = req.body; // validated by Zod

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
  const { commentId } = req.params; // validated by Zod

  const deleted = await Comment.findOneAndDelete({
    _id: commentId,
    owner: req.user._id,
  });
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
