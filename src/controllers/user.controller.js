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

import jwt from 'jsonwebtoken';
import { User } from '../models/users.model.js';
import { ApiError } from '../utils/apierror.js';
import { ApiResponse } from '../utils/Apiresponse.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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
};




const registerUser = asyncHandler(async (req, res) => {
  // res.status(201).json({message : "User registered successfully"});
  // Multer (upload.fields) should have populated req.body & req.files for multipart/form-data
  // console.log('Incoming raw register body:', req.body); // debug
  // Normalize keys (trim accidental leading/trailing spaces like ' password') and trim string values
  const normalizedBody = Object.fromEntries(
    Object.entries(req.body).map(([k, v]) => [k.trim(), typeof v === 'string' ? v.trim() : v])
  );
  // console.log('Normalized register body:', normalizedBody);
  const { username, email, fullName, password } = normalizedBody;
  // Basic presence + non-empty string check
  if ([username, email, fullName, password].some(f => typeof f !== 'string' || f.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError(400, "Invalid email");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new ApiError(409, "User already registered with this email or username");
  }
  // console.log(req.files);


  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');
  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }
  return res.status(201).json(
    new ApiResponse(createdUser, 201, 'User registered successfully')
  );
});


const loginUser = asyncHandler(async (req, res) => {

  if (!req.body) {
    throw new ApiError(400, 'Request body is missing. Set Content-Type: application/json');
  }

  const { email, username, password } = req.body || {};
  console.log('Login attempt payload:', req.body);

  if ((!email && !username) || !password) {
    throw new ApiError(400, 'Provide email or username AND password');
  }

  const user = await User.findOne({
    $or: [email ? { email } : null, username ? { username } : null].filter(Boolean)
  });

  if (!user) {
    throw new ApiError(404, 'User not found, please register');
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
  const sanitizedUser = await User.findById(user._id).select('-password -refreshToken');

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' //Protects against CSRF by not sending cookies
    //                     on most cross-site requests,
    //                     but still works for normal navigation
    //                     (like clicking links).
  };

  return res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .cookie('accessToken', accessToken, cookieOptions)
    .json(
      new ApiResponse({ user: sanitizedUser, accessToken, refreshToken }, 200, 'Login successful')
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse({}, 200, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(new ApiResponse({ accessToken, refreshToken }, 200, "Access token refreshed successfully"));
  } catch (e) {
    throw new ApiError(401, e?.message || "Invalid refresh token");
  }
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
  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});



const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, username, email } = req.body || {};

  // Validate presence and non-empty strings
  if (![fullName, username, email].every(v => typeof v === 'string' && v.trim() !== '')) {
    throw new ApiError(400, "All fields are required");
  }

  const normalized = {
    fullName: fullName.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
  };


  const conflict = await User.findOne({
    _id: { $ne: req.user._id },
    $or: [{ username: normalized.username }, { email: normalized.email }]
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
    .json(new ApiResponse(updatedUser, 200, "Account details updated successfully"));
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
  const updateCoverImage = await User.findByIdAndUpdate(req.user?._id, {
    $set: {
      coverImage: coverImage.url

    },
  }, { new: true }).select("-password");

  return res.status(200).json(new ApiResponse(200, updateCoverImage, "CoverImage updated successfully"));
});


const getUserChannelProfile = asyncHandler(async (req, res) => {
  const paramUsername = (req.params?.username || '').trim().toLowerCase();
  if (!paramUsername) {
    throw new ApiError(400, "Username param required");
  }

  const channelAgg = await User.aggregate([
    { $match: { username: paramUsername } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeToChannels"
      }
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        channelSubscribedTo: { $size: "$subscribeToChannels" },
        isSubscribed: {
          $in: [req.user?._id, "$subscribers.subscriber"]
        }
      }
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
        isSubscribed: 1
      }
    },
    { $limit: 1 }
  ]);

  const channel = channelAgg[0];
  console.dir(channel, { depth: null });
  
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(channel, 200, "Channel profile fetched"));
});

export { changeUserPassword, getCurrentUser, loginUser, logOutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile};



// aggregate pipeline: mongoose model function that allows us to perform complex data processing and transformation operations on the documents in a collection




