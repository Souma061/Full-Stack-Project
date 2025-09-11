import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true, limit: "15kb" }));
app.use(express.static("public"));

app.use(cookieParser());

// routes
import commentRouter from './routes/comment.routes.js';
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import likeRouter from './routes/like.routes.js';


app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/videos/:videoId/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);

export { app };


