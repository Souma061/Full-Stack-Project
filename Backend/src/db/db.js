import mongoose from 'mongoose';
import { DB_NAME } from "../constant.js";

// Builds a safe connection using the dbName option so we don't corrupt the URI
// when the base URI already contains query parameters (?retryWrites=true...)
const connectDB = async () => {
  try {
    if (!process.env.MONGODB) {
      throw new Error('MONGODB env variable not set');
    }
    // Use mongoose dbName option instead of manual string concatenation
    const connectionInstance = await mongoose.connect(process.env.MONGODB, {
      dbName: DB_NAME,
    });
    console.log(`\n MongoDB Connected!! ${connectionInstance.connection.host}/${DB_NAME}`);
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
