import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { VideoParam, CommentIdParam, CommentListQuery, CommentBody } from "../schemas/comment.schemas.js";

// mergeParams true so we can access :videoId from the parent mounted route
const router = Router({ mergeParams: true });

// Public: list comments for a video (expects parent route to provide :videoId)
router.get('/', validateRequest({ params: VideoParam, query: CommentListQuery }), getVideoComments);

// Auth required: create a new comment
router.post('/', verifyJWT, validateRequest({ params: VideoParam, body: CommentBody }), addComment);

// Auth required: update own comment
router.patch('/:commentId', verifyJWT, validateRequest({ params: CommentIdParam, body: CommentBody }), updateComment);

// Auth required: delete own comment
router.delete('/:commentId', verifyJWT, validateRequest({ params: CommentIdParam }), deleteComment);

export default router;
