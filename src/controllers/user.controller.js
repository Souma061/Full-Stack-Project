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

import { User } from '../models/users.model.js';
import { ApiError } from '../utils/apierror.js';
import { ApiResponse } from '../utils/Apiresponse.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';



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
    new ApiResponse(201, 'User registered successfully', createdUser)
  );






});


export { registerUser };


