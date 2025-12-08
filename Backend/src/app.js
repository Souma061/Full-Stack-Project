import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import {
  AppError,
  globalErrorHandler,
} from "./middlewares/error.middleware.js";

const app = express();

// -----------------------------------------------------
// CORS CONFIGURATION (WORKING + CORRECT FOR CREDENTIALS)
// -----------------------------------------------------
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// app.options("(.*)", cors());

// -----------------------------------------------------
// CORE MIDDLEWARES
// -----------------------------------------------------
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true, limit: "15kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// -----------------------------------------------------
// ROOT ENDPOINT
// -----------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Full Stack API",
    version: "1.0.0",
    status: "API is running!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: {
      health: "/health",
      api: "/api/v1",
    },
  });
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "API is running!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// FAVICON (prevent 404 spam)
app.get("/favicon.ico", (req, res) => res.status(204).end());

// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------
import commentRouter from "./routes/comment.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import router from "./routes/test.route.js";
import tweetRouter from "./routes/tweet.routers.js";
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";


// -----------------------------------------------------
// ROUTES (must be BEFORE error handlers)
// -----------------------------------------------------

// Healthcheck FIRST (to avoid conflicts)
app.use("/api/v1/healthcheck", healthcheckRouter);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/videos/:videoId/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/test", router);
app.use("/api/v1/tweets", tweetRouter);

// Handle undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);


export { app };
