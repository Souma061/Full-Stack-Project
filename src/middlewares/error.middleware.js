import { success } from "zod/v4";
import { ApiError } from "../utils/apierror";

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  //lg the error for dev

  console.log("ERROR: ", err);

  // mongoose bad objectID

  if (err.name === "CastError") {
    const message = `Resource not found.Invalid ${err.path}: ${err.value}.`;
    error = new AppError(message, 400);
  }

  // mongoose duplicate key

  if(err.code === 11000) {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Dupicate field value: ${value}. Please use another value!`;
    error = new ApiError(message,400)

  }

  // mongoose validation error
  if(err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(val => val.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    error = new ApiError(message,400)
  }

  // jwt error
  if(err.name  === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again!";
    error = new ApiError(message,401)

  }

  if(err.name === "TokenExpiredError") {
    const message = "Your token has expired! Please log in again.";
    error = new ApiError(message,401)
  }

  //send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack })

    }
  })
};

// catch async errors
export const catchAsync = (fn) => (req,res,next) =>{
  Promise.resolve(fn(req,res,next)).catch(next);
}
