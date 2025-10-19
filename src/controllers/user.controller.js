// Logic to register a user
// get user details from frontend
//  validate inpute
// Check if user already registered : using email, username
// check for images and avatars
// upload to cloudinary
// create user object - create entry in db
// remove password from response
// check for user creation errors
// send success response

// ---------Log in------------
// get email and password from frontend
// validate input
// check if user existe
// check for password match
// generate jwt token
//generate refresh token
// store refresh token in db against user
// send success response with tokens

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { AppError, catchAsync } from "../middlewares/error.middleware.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessandRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch {
    throw new ApiError(500, "Error generating tokens");
  }

  // What I have done so far:
  // 1. Fetched user by ID
  // 2. Generated access and refresh tokens
  // 3. Stored refresh token in DB
  // 4. Returned tokens
  // Next steps:
  // - Handle errors and edge cases (e.g., user not found)
};

const registerUser = asyncHandler(async (req, res) => {
  // Zod already validated and normalized req.body fields
  const { username, email, fullName, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "User already registered with this email or username"
    );
  }
  // console.log(req.files);

  const avatarLocalPath = req.files?.avatar?.[0]?.path; // get path of uploaded avatar file
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar is required");
  // }

  let avatar = null;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(500, "Error while uploading avatar");
    }
  }

  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // Removed the redundant avatar check since avatar is now optional

  const user = await User.create({
    fullName,
    avatar: avatar?.url || null, // Handle null avatar
    coverImage: coverImage?.url || null,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }
  return res
    .status(201)
    .json(new ApiResponse(createdUser, 201, "User registered successfully"));

  // What I have done so far:
  // 1. Fetched and normalized input data
  // 2. Validated required fields and formats
  // 3. Checked for existing user conflicts
  // 4. Handled file uploads to Cloudinary
  // 5. Created new user in DB
  // 6. Returned sanitized user data in response
  // Next steps:
  // - Handle edge cases and errors (e.g., Cloudinary upload failures)
  // - Test the endpoint with various scenarios (missing fields, invalid data, etc.)
});

const loginUser = asyncHandler(async (req, res) => {
  // Zod already ensured either email or username and password are provided
  const { email, username, password } = req.body;

  const user = await User.findOne({
    $or: [email ? { email } : null, username ? { username } : null].filter(
      Boolean
    ),
  });
  if(!user) {
    throw new ApiError(401, "Invalid credentials");
  }
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );
  const sanitizedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", //Protects against CSRF by not sending cookies
    //                     on most cross-site requests,
    //                     but still works for normal navigation
    //                     (like clicking links).
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        { user: sanitizedUser, accessToken, refreshToken },
        200,
        "Login successful"
      )
    );

  // What I have done so far:
  // 1. Validated input presence
  // 2. Fetched user by email/username
  // 3. Verified password
  // 4. Generated tokens
  // 5. Sent response with cookies and user data
  // Next steps:
  // - Handle edge cases (e.g., account locked)
  // - Test with various scenarios (valid/invalid credentials)
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  }; // sameSite: 'lax' protects against CSRF by not sending cookies on most cross-site requests, but still works for normal navigation (like clicking links).

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse({}, 200, "Logged out successfully"));

  // What I have done so far:
  // 1. Cleared refresh token in DB
  // 2. Cleared auth cookies
  // 3. Sent success response
  // Next steps:
  // - Test the endpoint to ensure cookies are cleared properly
  // - Handle edge cases (e.g., user not found)
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded?._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new ApiResponse(
          { accessToken, refreshToken },
          200,
          "Access token refreshed successfully"
        )
      );
  } catch (e) {
    throw new ApiError(401, e?.message || "Invalid refresh token");
  }

  // What I have done so far:
  // 1. Validated presence of incoming refresh token
  // 2. Verified token and fetched user
  // 3. Generated new tokens
  // 4. Sent response with new tokens in cookies
  // Next steps:
  // - Handle edge cases (e.g., expired token)
  // - Test the endpoint with valid and invalid tokens
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req?.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse({}, 200, "Password changed successfully"));
});

const getCurrentUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: user,
  });
});

// What I have done so far:
// 1. Retrieved user from req (set by auth middleware)
// 2. Sent user data in response
// Next steps:
// - Ensure sensitive fields are excluded (e.g., password)
// - Test the endpoint to verify it returns correct user data

const updateAccountDetails = asyncHandler(async (req, res) => {
  // Zod already validated and normalized these fields
  const { fullName, username, email } = req.body;

  const normalized = { fullName, username, email };

  const conflict = await User.findOne({
    _id: { $ne: req.user._id },
    $or: [{ username: normalized.username }, { email: normalized.email }],
  }).lean();

  if (conflict) {
    throw new ApiError(409, "Email or username already in use");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: normalized },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(updatedUser, 200, "Account details updated successfully")
    );

  // What I have done so far:
  // 1. Validated input fields
  // 2. Checked for email/username conflicts
  // 3. Updated user details in DB
  // 4. Returned updated user data
  // Next steps:
  // - Handle edge cases (e.g., invalid email format)
  // - Test the endpoint with various scenarios (conflicts, successful update)
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(updated, 200, "Avatar updated successfully"));

  // What I have done so far:
  // 1. Validated presence of uploaded file
  // 2. Uploaded avatar to Cloudinary
  // 3. Updated user record with new avatar URL
  // 4. Returned updated user data
  // Next steps:
  // - Handle upload errors and edge cases
  // - Test the endpoint with valid and invalid files
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage file is missing");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }
  const updateCoverImage = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updateCoverImage, "CoverImage updated successfully")
    );

  // What I have done so far:
  // 1. Validated presence of uploaded file
  // 2. Uploaded cover image to Cloudinary
  // 3. Updated user record with new cover image URL
  // 4. Returned updated user data
  // Next steps:
  // - Handle upload errors and edge cases
  // - Test the endpoint with valid and invalid files
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // Zod validated via UsernameParamSchema; already normalized in schema
  const { username } = req.params;

  const channelAgg = await User.aggregate([
    { $match: { username } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeToChannels",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        channelSubscribedTo: { $size: "$subscribeToChannels" },
        isSubscribed: {
          $in: [req.user?._id, "$subscribers.subscriber"],
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,

        createdAt: 1,
        subscribersCount: 1,
        channelSubscribedTo: 1,
        isSubscribed: 1,
      },
    },
    { $limit: 1 },
  ]);

  const channel = channelAgg[0];
  console.dir(channel, { depth: null });

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(channel, 200, "Channel profile fetched"));

  // What I have done so far:
  // 1. Validated username param
  // 2. Queried user by username
  // 3. Aggregated subscription data
  // 4. Structured response with channel info
  // Next steps:
  // - Test the endpoint with valid and invalid usernames
  // - Handle edge cases (e.g., user not found)
});

const getWatchHistory = asyncHandler(async (req, res) => {
  // Ensure we have a proper ObjectId
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const normalizedUserId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId; // already an ObjectId

  const userAgg = await User.aggregate([
    { $match: { _id: normalizedUserId } },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
            },
          },
          { $unwind: "$owner" },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              duration: 1,
              createdAt: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    { $project: { watchHistory: 1 } },
  ]);

  const watchHistory = userAgg[0]?.watchHistory || [];

  return res
    .status(200)
    .json(new ApiResponse({ watchHistory }, 200, "Watch history fetched"));

  // What I have done so far:
  // 1. Validated user ID from req
  // 2. Aggregated user's watch history with video and owner details
  // 3. Structured response with watch history array
  // Next steps:
  // - Test the endpoint to ensure correct data is returned
  // - Handle edge cases (e.g., no watch history)
});

export {
  changeUserPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};

// aggregate pipeline: mongoose model function that allows us to perform complex data processing and transformation operations on the documents in a collection

// What is aggregation?
// Aggregation is a way of processing a large number of documents in a collection by means of passing them through different stages. The stages make up what is known as a pipeline. The stages in a pipeline can filter, sort, group, reshape and modify documents that pass through the pipeline.

// Each stage transforms the document as they pass through the pipeline.

// Each stage performs an operation on the input documents. The output of one stage is passed to the next stage as input.

// Common stages include $match (filtering), $group (grouping by fields), $sort (sorting), $project (reshaping documents), and $lookup (joining collections).

// Example: Get total sales per product category
// db.sales.aggregate([
//   { $group: { _id: "$category", totalSales: { $sum: "$amount" } } },
//   { $sort: { totalSales: -1 } }
// ])

// In this example, sales documents are grouped by category, summing the amount for each category, and then sorted by total sales in descending order.
