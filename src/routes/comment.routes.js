import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

// mergeParams true so we can access :videoId from the parent mounted route
const router = Router({ mergeParams: true });

// Public: list comments for a video (expects parent route to provide :videoId)
router.get('/', getVideoComments);

// Auth required: create a new comment
router.post('/', verifyJWT, addComment);

// Auth required: update own comment
router.patch('/:commentId', verifyJWT, updateComment);

// Auth required: delete own comment
router.delete('/:commentId', verifyJWT, deleteComment);

export default router;
