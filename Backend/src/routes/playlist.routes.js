import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  PlaylistCreateBody,
  PlaylistIdParam,
  PlaylistListQuery,
  PlaylistUpdateBody,
  PlaylistVideoIdParam,
  UserIdParam,
} from "../schemas/playlist.schemas.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/", validateRequest({ body: PlaylistCreateBody }), createPlaylist);

router
  .route("/:playlistId")
  .get(
    validateRequest({ params: PlaylistIdParam, query: PlaylistListQuery }),
    getPlaylistById
  )
  .patch(
    validateRequest({ params: PlaylistIdParam, body: PlaylistUpdateBody }),
    updatePlaylist
  )
  .delete(validateRequest({ params: PlaylistIdParam }), deletePlaylist);

router
  .route("/add/:videoId/:playlistId")
  .patch(
    validateRequest({ params: PlaylistVideoIdParam.merge(PlaylistIdParam) }),
    addVideoToPlaylist
  );
router
  .route("/remove/:videoId/:playlistId")
  .patch(
    validateRequest({ params: PlaylistVideoIdParam.merge(PlaylistIdParam) }),
    removeVideoFromPlaylist
  );

router
  .route("/user/:userId")
  .get(
    validateRequest({ params: UserIdParam, query: PlaylistListQuery }),
    getUserPlaylists
  );

export default router;
