// Load environment variables FIRST before importing anything else
import dotenv from 'dotenv';
dotenv.config({
  path: './.env'
});

import { app } from './app.js';
import connectDB from './db/db.js';
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;

    const server = app.listen(PORT, () => {
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
