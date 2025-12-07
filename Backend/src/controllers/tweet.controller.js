import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/users.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    const userId = req.user?._id;

    if(!content || content.trim == "") {
        throw new ApiError(400, "Tweet content is required")
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: userId
    });
    const createdTweet = await Tweet.findById(tweet._id).populate("owner", "username fullName avatar")

    return res.status(201).json(
        new ApiResponse(201, createdTweet, "Tweet created successfully")
    )

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params;

    if(!isValidObjectId(userId)) {
        throw new ApiError(400,"Invalid userId");
    }

    const user = await User.findById(userId);
    if(!user) {
        throw new ApiError(400, "User not found");
    }

    const tweets = await Tweet.find({owner: userId}).populate("owner", "username fullName avatar").sort({createdAt: -1});

    return res.status(200).json(
        new ApiResponse(200, tweets, "User tweets fethed")
    );

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params;
    const {content} = req.body;
    const userId = req.user?._id;

    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id");
    }

    if(!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.findById(userId);
    if(!tweet) {
        throw new ApiError(400, "Tweet not found");
    }

    if(tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only update tweets if you are the owner");


    }
    tweet.content = content.trim();
    await tweet.save();

    const updatedTweet = await Tweet.findById(tweet._id).populate("owner","username fullName avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully" )
    );

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params;
    const deleted = await Tweet.findByIdAndDelete({
        _id: tweetId,
        owner: req.user?._id
    })
    if(!deleted) {
        throw new ApiError(404,deleted, "Tweet not found");
    }

    res.status(200).json(
        new ApiResponse(200,"Comment deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
