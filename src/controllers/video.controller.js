import mongoose, { isValidObjectId } from "mongoose";
import { User } from '../models/users.model.js';
import { Video } from "../models/video.model.js";
import { ApiError } from '../utils/apierror.js';
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    let pageNum = parseInt(page, 10);
    let limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum < 1) pageNum = 1; // default to page 1 if invalid
    if (isNaN(limitNum) || limitNum < 1) limitNum = 10;
    if (limitNum > 50) limitNum = 50; // hard cap

    const filter = {
        isPublished: true
    };
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        filter.owner = new mongoose.Types.ObjectId(userId);
    }

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: 'i' } }
        ]; // it does a case-insensitive search in title and description
    }
    const sortOptions = {}; // Initialize empty sort options
    if (sortBy) {
        const validSortFields = ['views', 'createdAt', 'title', 'duration', 'createdAt', 'updatedAt'];
        if (validSortFields.includes(sortBy)) {
            sortOptions[sortBy] = sortType === 'asc' ? 1 : -1;
        }
    } else {
        sortOptions.createdAt = -1; // default sort by createdAt desc
    } // default sort by createdAt desc

    const skip = (pageNum - 1) * limitNum; // Calculate documents to skip

    // Using aggregation to join with users collection to get owner details

    const videos = await Video.aggregate([ // Using aggregation to join with users collection to get owner details
        { $match: filter },
        {
            $lookup: {  // join with users collection to get owner details
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,

                        }
                    }
                ]
            }
        },
        { $unwind: '$owner' }, // unwind : deconstructs the array field from the input documents to output a document for each element
        { $sort: sortOptions }, // sort the results based on sortOptions
        { $skip: skip }, // skip the first (pageNum - 1) * limitNum documents
        { $limit: limitNum }, // limit the results to limitNum
        {
            $project: {  // project only necessary fields
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                views: 1,
                createdAt: 1,
                owner: 1
            }
        }
    ]);

    const totalDocs = await Video.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalDocs / limitNum)); // Calculate total pages


    return res.status(200).json(
        new ApiResponse(
            {
                videos,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalDocs,
                    totalPages,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1
                }
            },
            200,
            "Videos fetched successfully"
        )
    );
    // What I have done so far:
    // 1. Parsed and validated pagination parameters (page, limit)
    // 2. Constructed filter object based on query and userId
    // 3. Set up sorting options based on sortBy and sortType
    // 4. Used aggregation pipeline to fetch videos with owner details
    // 5. Calculated total documents and total pages for pagination
    // 6. Returned structured response with videos and pagination info
    // Next steps:
    // - Test the endpoint with various query parameters
    // - Handle edge cases (e.g., no videos found, invalid userId)
    // - Optimize performance if needed (e.g., indexing in MongoDB)
    // - Add caching if necessary for frequently requested data
    // - Ensure proper error handling and logging
    // - Write unit and integration tests for this functionality
    // - Update API documentation to reflect new query parameters and response structure
    // - Review code for best practices and potential improvements
    // - Deploy changes to staging environment for further testing
    // - Monitor performance and user feedback after deployment
    // - Iterate based on feedback and any issues encountered

});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video
    if (!title || !title.trim()) {
        throw new ApiError(400, "Video title is required");

    }

    if (!description || !description.trim()) {
        throw new ApiError(400, "Video description is required");

    }
    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Video thumbnail is required");
    }

    // upload to cloudinary

    const videoFile = await uploadOnCloudinary(videoFileLocalPath); // upload to cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile?.url) {
        throw new ApiError(500, "Could not upload video file. Please try again later");
    }
    if (!thumbnail?.url) {
        throw new ApiError(500, "Could not upload video thumbnail. Please try again later");
    }

    const video = await Video.create({  // create video document in db
        title: title.trim(),
        description: description.trim(),
        videoFiles: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration || 0,
        owner: req.user._id,
        isPublished: true,
    });
    const createVideo = await Video.findById(video?._id).populate('owner', // populate owner details
        'username fullName avatar'
    ).select('-__v'); // exclude __v field

    return res.status(201).json(new ApiResponse(createVideo, 201, "Video published successfully"));


    // What I have done so far:
    // 1. Validated required fields (title, description, video file, thumbnail)
    // 2. Uploaded video file and thumbnail to Cloudinary
    // 3. Created a new video document in the database
    // 4. Populated owner details for the created video
    // 5. Returned structured response with the created video details
    // Next steps:
    // - Test the endpoint with valid and invalid data
    // - Handle edge cases (e.g., upload failures, database errors)
    // - Optimize performance if needed (e.g., async uploads)
    // - Ensure proper error handling and logging
    // - Write unit and integration tests for this functionality
    // - Update API documentation to reflect new endpoint and request/response structure
    // - Review code for best practices and potential improvements
    // - Deploy changes to staging environment for further testing
    // - Monitor performance and user feedback after deployment
    // - Iterate based on feedback and any issues encountered


});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    ).select('-__v').populate('owner', 'username fullName avatar');
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (!video.isPublished && video.owner._id.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Video is not published");
    }


    // also add this video to user's watch history
    if (req.user?._id) {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { watchHistory: video._id }
            }, { new: true }
        );  // addToSet ensures no duplicates
    }

    return res.status(200).json(new ApiResponse(video, 200, "Video fetched successfully"));
    // What I have done so far:
    // 1. Validated video ID
    // 2. Fetched video by ID and incremented view count
    // 3. Checked if video exists and is published (if not owner)
    // 4. Added video to user's watch history if authenticated
    // 5. Returned structured response with video details
    // Next steps:
    // - Test the endpoint with various scenarios (valid ID, invalid ID, unpublished video)
    // - Handle edge cases (e.g., video not found, database errors)
    // - Optimize performance if needed (e.g., indexing in MongoDB)
    // - Ensure proper error handling and logging
    // - Write unit and integration tests for this functionality
    // - Update API documentation to reflect new endpoint and response structure
    // - Review code for best practices and potential improvements
    // - Deploy changes to staging environment for further testing
    // - Monitor performance and user feedback after deployment
    //
    // - Iterate based on feedback and any issues encountered
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params; // video ID from params
    const { title, description } = req.body;
    //TODO: update video details like title, description, thumbnail
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }
    if (title !== undefined && (!title || !title.trim())) {
        throw new ApiError(400, "Video title cannot be empty");
    }
    if (description !== undefined && (!description || !description.trim())) {
        throw new ApiError(400, "Video description cannot be empty");
    }

    const updateFields = {};
    if (title) updateFields.title = title.trim();  // update title if provided
    if (description) updateFields.description = description.trim(); // update description if provided

    const thumbnailLocalPath = req.file?.path;  // thumbnail file from multer
    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail?.url) {
            throw new ApiError(500, "Could not upload video thumbnail. Please try again later");
        }
        updateFields.thumbnail = thumbnail.url; // update thumbnail if uploaded

    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields
        }, { new: true }
    ).populate('owner', 'username fullName avatar').select('-__v');  // populate owner details and exclude __v field

    return res.status(200).json(
        new ApiResponse(
            {
                video: updatedVideo
            }
            , 200, "Video updated successfully"
        )
    );
    // What I have done so far:
    // 1. Validated video ID and ownership
    // 2. Validated input fields (title, description)
    // 3. Handled optional thumbnail upload and update
    // 4. Updated video document in the database
    // 5. Returned structured response with updated video details
    // Next steps:
    // - Test the endpoint with various scenarios (valid update, invalid data)

});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);
    return res.status(200).json(
        new ApiResponse(
            {
                video: deletedVideo
            }
            , 200, "Video deleted successfully"
        )
    );
    // What I have done so far:
    // 1. Validated video ID and ownership
    // 2. Deleted video document from the database
    // 3. Returned structured response with deleted video details
    // Next steps:
    // - Test the endpoint with various scenarios (valid ID, invalid ID, unauthorized user)
    // - Handle edge cases (e.g., video not found, database errors)
    // - Optimize performance if needed
    // - Ensure proper error handling and logging
    // - Write unit and integration tests for this functionality
    // - Update API documentation to reflect new endpoint and response structure
    // - Review code for best practices and potential improvements
    // - Deploy changes to staging environment for further testing
    // - Monitor performance and user feedback after deployment
    // - Iterate based on feedback and any issues encountered
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    const updatedVideo = await Video.findByIdAndUpdate(    // toggle isPublished status
        videoId,
        { $set: { isPublished: !video.isPublished } }, // toggle the isPublished status
        { new: true }
    ).populate('owner', 'username fullName avatar').select('-__v');

    const statusMessage = updatedVideo.isPublished ? "Video is now published" : "Video is now unpublished";

    return res.status(200).json(
        new ApiResponse(
            {
                video: updatedVideo
            }
            , 200, statusMessage
        )
    );
    // What I have done so far:
    // 1. Validated video ID and ownership
    // 2. Toggled the isPublished status of the video
    // 3. Returned structured response with updated video details and status message
    // Next steps:
    // - Test the endpoint with various scenarios (valid ID, invalid ID, unauthorized user)
    // - Handle edge cases (e.g., video not found, database errors)
    // - Optimize performance if needed
    // - Ensure proper error handling and logging
    // - Write unit and integration tests for this functionality
    // - Update API documentation to reflect new endpoint and response structure
    // - Review code for best practices and potential improvements
    // - Deploy changes to staging environment for further testing
    // - Monitor performance and user feedback after deployment
    // - Iterate based on feedback and any issues encountered
});

export {
    deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo
};
