// require('dotenv').config({path:'./.env'});
import dotenv from 'dotenv';

// import mongoose from 'mongoose';
// import {DB_NAME} from './constant.js';
import connectDB from './db/db.js';

dotenv.config({
  path:'./.env'
})

connectDB();











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
