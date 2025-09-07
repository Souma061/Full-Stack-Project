import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asynchandler';
import { ApiError } from '../utils/apierror.js';
import { User } from '../models/users.model.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized, token missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESSS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select('-password -refreshToken');
    if(!user) {
      throw new ApiError(401, "Unauthorized, user not found");

    }
     req.user = user;
      next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized, invalid token");
  }
});
