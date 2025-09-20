import { Router } from "express";
import { AppError, catchAsync } from "../middlewares/error.middleware.js";
import { User } from "../models/users.model.js";

const router = Router();

// A simple test route to check if the server is running

router.get("/error", (req, res, next) => {
  next(new AppError("This is a test error", 400));
});

//Test async error handling

router.get(
  "/async-error",
  catchAsync(async (req, res, next) => {
    throw new AppError("This is a test async error", 400);
  })
);

router.get(
  "/db-error/:id",
  catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.json(user);
  })
);

export default router;
