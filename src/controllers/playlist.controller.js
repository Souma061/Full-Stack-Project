import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
// Add this import
import { ApiError } from '../utils/apierror.js';
import { ApiResponse } from '../utils/Apiresponse.js'; // Add this import
import { asyncHandler } from '../utils/asynchandler.js';


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    //TODO: create playlist
    if (!name?.trim()) {
        throw new ApiError(400, "Playlist name is required");
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description?.trim() || "",
        owner: req.user._id,
        videos: [],
        creationDate: new Date()
    });
    return res.status(201).json(new ApiResponse(playlist, 201, "Playlist created successfully"));

});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }
    let pageNum = parseInt(page, 10);
    let limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1) pageNum = 1;
    if (isNaN(limitNum) || limitNum < 1) limitNum = 10;
    if (limitNum > 50) limitNum = 50;

    const skip = (pageNum - 1) * limitNum;



    const playlists = await Playlist.find({
        owner: userId
    }).populate("owner", "username fullName avatar").sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean();

    const playlistsWithCount = await Promise.all(
        playlists.map(async (playlist) => {
            const videoCount = playlist.videos.length;
            return {
                ...playlist.toObject(),
                videoCount
            };
        })
    );

    const totalPlaylists = await Playlist.countDocuments({
        owner: userId
    });
    const totalPages = Math.max(1, Math.ceil(totalPlaylists / limitNum));

    return res.status(200).json(new ApiResponse({
        playlists: playlistsWithCount,
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalDocs: totalPlaylists,
            totalPages,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1
        }
    }, 200, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist

});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist
});

export {
    addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist
};

