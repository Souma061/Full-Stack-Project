import { Playlist } from "../models/playlist.model.js";
// Add this import
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js"; // Add this import
import { asyncHandler } from "../utils/asynchandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body; // validated by Zod

  const playlist = await Playlist.create({
    name: name.trim(),
    description: description?.trim() || "",
    owner: req.user._id,
    videos: [],
    creationDate: new Date(),
  });
  return res
    .status(201)
    .json(new ApiResponse(playlist, 201, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params; // validated by Zod
  const { page = 1, limit = 10 } = req.query; // validated/coerced by Zod
  //TODO: get user playlists

  let pageNum = parseInt(page, 10);
  let limitNum = parseInt(limit, 10);

  const skip = (pageNum - 1) * limitNum;

  const playlists = await Playlist.find({
    owner: userId,
  })
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const playlistsWithCount = playlists.map((playlist) => {
    const videoCount = playlist.videos.length;
    return {
      ...playlist.toObject(),
      videoCount,
    };
  });

  const totalPlaylists = await Playlist.countDocuments({
    owner: userId,
  });
  const totalPages = Math.max(1, Math.ceil(totalPlaylists / limitNum));

  return res.status(200).json(
    new ApiResponse(
      {
        playlists: playlistsWithCount,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalDocs: totalPlaylists,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      200,
      "Playlists fetched successfully"
    )
  );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params; // validated by Zod
  const { page = 1, limit = 10 } = req.query; // validated/coerced by Zod
  //TODO: get playlist by id
  let pageNum = parseInt(page, 10);
  let limitNum = parseInt(limit, 10);
  if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
  if (isNaN(limitNum) || limitNum < 1) limitNum = 10;
  if (limitNum > 50) limitNum = 50;

  const skip = (pageNum - 1) * limitNum;
  const playlist = await Playlist.findById(playlistId)
    .populate("owner", "username fullName avatar")
    .lean();
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  const totalVideos = playlist.videos.length;
  const paginatedVideoIds = playlist.videos.slice(skip, skip + limitNum);

  // populate video details

  const videos = await Video.find({
    _id: { $in: paginatedVideoIds },
    isPublished: true,
  })
    .populate("owner", "username fullName avatar")
    .lean();
  const totalPages = Math.max(1, Math.ceil(totalVideos / limitNum));

  return res.status(200).json(
    new ApiResponse(
      {
        playlist: {
          _id: playlist._id,
          name: playlist.name,
          description: playlist.description,
          owner: playlist.owner,
          createdAt: playlist.createdAt,
          updatedAt: playlist.updatedAt,
          totalVideos,
        },
        videos,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalDocs: totalVideos,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      200,
      "Playlist fetched successfully"
    )
  );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params; // validated by Zod

  // Check if the video is already in the playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }
  // check if video exists and is published

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (!video.isPublished) {
    throw new ApiError(400, "Cannot add unpublished video to playlist");
  }
  // check if video already in playlist
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in playlist");
  } else {
    playlist.videos.push(videoId);
    await playlist.save();
    return res
      .status(200)
      .json(
        new ApiResponse(playlist, 200, "Video added to playlist successfully")
      );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params; // validated by Zod
  // TODO: remove video from playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }
  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not in playlist");
  } else {
    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
    await playlist.save();
  }
  return res
    .status(200)
    .json(
      new ApiResponse(playlist, 200, "Video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params; // validated by Zod
  // TODO: delete playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }

  await Playlist.findByIdAndDelete(playlistId);
  return res
    .status(200)
    .json(new ApiResponse({}, 200, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params; // validated by Zod
  const { name, description } = req.body; // validated by Zod
  //TODO: update playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  const updateData = {};
  if (name?.trim()) {
    updateData.name = name.trim();
  }
  if (description !== undefined) {
    updateData.description = description.trim();
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    updateData,
    { new: true }
  ).populate("owner", "username fullName avatar");
  return res
    .status(200)
    .json(
      new ApiResponse(updatedPlaylist, 200, "Playlist updated successfully")
    );
});

export {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
};
