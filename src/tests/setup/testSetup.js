import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer;

// Global setup and teardown for tests

beforeAll(async () => {
  try {
    // Start in-memory MongoDB server with minimal configuration for compatibility
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: "test",
      },
      // Let MongoDB Memory Server auto-detect the best version for this system
    });

    const mongoUri = mongoServer.getUri();

    // Connect to test database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Test database connected");

    // Set test environment variables
    process.env.NODE_ENV = "test";
    process.env.MONGODB_URI = mongoUri;
    process.env.JWT_SECRET = "test-jwt-secret-key";
    process.env.ACCESS_TOKEN_SECRET = "test-access-token-secret";
    process.env.REFRESH_TOKEN_SECRET = "test-refresh-token-secret";
    process.env.ACCESS_TOKEN_EXPIRY = "15m";
    process.env.REFRESH_TOKEN_EXPIRY = "7d";
    process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
    process.env.CLOUDINARY_API_KEY = "test-key";
    process.env.CLOUDINARY_API_SECRET = "test-secret";

    // Global test user data
    global.testUser = {
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
      fullName: "Test User",
    };
  } catch (error) {
    console.log("❌ Test database setup failed:", error.message);
    // Don't exit process - just log error and continue without database
    console.log("⚠️  Tests will run without database connection");
  }
}, 60000);

// Global cleanup after all tests
afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log("✅ Test database cleaned up");
  } catch (error) {
    console.error("❌ Test cleanup failed:", error);
  }
}, 30000);

// Cleanup after each test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Simple console mocking for tests (optional)
// global.console.log = jest.fn();
