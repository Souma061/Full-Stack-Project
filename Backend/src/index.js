import dotenv from 'dotenv';
import path from 'path';

// Resolve path to root .env file (assuming CWD is Backend/)
dotenv.config({
  path: path.resolve(process.cwd(), '../.env')
});

console.log("DEBUG: Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "LOADED" : "MISSING " + process.cwd());

// Trigger restart 6
import { app } from './app.js';
import connectDB from './db/db.js';
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      throw new Error("Could not start server");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });











/*import express from 'express';
const app = express();

(async ()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB}/${DB_NAME}`);
    console.log("Connected to MongoDB");
    app.on("error",(error)=>{
      console.error("Error connecting to MongoDB",error);
      throw new Error("Could not connect to MongoDB");

    })
    app.listen(process.env.PORT,()=>{
      console.log(`Server is running on port ${process.env.PORT}`);
    })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Could not connect to MongoDB");


  }

})()*/
