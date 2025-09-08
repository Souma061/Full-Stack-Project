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
  } catch (error) {
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
  User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined }
  },
    {
      new: true,
    });
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
    new ApiResponse(200, {}, "Logged out successfully")
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }
  try {

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: true
    };

    const { accessToken, newRefreshToken } = await generateAccessandRefreshToken(user._id);

    return res.status(200).cookie("refreshToken", newRefreshToken, options).cookie("accessToken", accessToken, options).json(
      new ApiResponse({ accessToken, refreshToken: newRefreshToken }, 200, "Access token refreshed successfully")
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});



export { loginUser, logOutUser, registerUser,refreshAccessToken };


