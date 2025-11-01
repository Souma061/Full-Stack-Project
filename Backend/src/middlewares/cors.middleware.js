import cors from "cors";

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*", // Use environment variable or allow all
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
};

const corsMiddleware = cors(corsOptions);
export default corsMiddleware;
