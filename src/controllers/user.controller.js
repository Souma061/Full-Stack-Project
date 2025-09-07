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

import { asyncHandler } from '../utils/asynchandler.js';
import  {ApiError} from '../utils/apierror.js';
import { User } from '../models/users.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/Apiresponse.js';


const registerUser = asyncHandler(async (req, res) => {
  // res.status(201).json({message : "User registered successfully"});
  const {username, email, fullName, password} = req.body
  console.log(email);
  console.log(password);
  if(
    [username,email,fullName,password].some((field)=>
    field?.trim() === "" || field === undefined)
  ){
    throw new ApiError(400, "All fields are required");
  }
  if(password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }
  if(!/^\S+@\S+\.\S+$/.test(email)){
    throw new ApiError(400, "Invalid email");
  }

  const existingUser = await User.findOne({
    $or: [{username},{email}]
  })

  if(existingUser) {
    throw new ApiError(409, "User already registered with this email or username");
  }

  const avatarLoaclPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLoaclPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLoaclPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage : coverImage?.url || "",
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if(!createdUser) {
    throw new ApiError(500, "User not created");
  }
  return res.staus(201).json(new ApiResponse(200, "User registered successfully", createdUser
    
  ))






});


export { registerUser };


