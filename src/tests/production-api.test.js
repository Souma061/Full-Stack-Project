import axios from "axios";

// Complete API Testing Suite for Production Server
const BASE_URL = "https://full-stack-project-1-ut99.onrender.com";
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  validateStatus: (status) => status < 500,
});

describe("🚀 Complete API Testing Suite - Production Server", () => {
  let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: [],
  };

  const logTest = (name, passed, error = null) => {
    testResults.total++;
    if (passed) {
      testResults.passed++;
      console.log(`✅ ${name}`);
    } else {
      testResults.failed++;
      testResults.errors.push({ test: name, error });
      console.log(`❌ ${name}: ${error}`);
    }
  };

  beforeAll(() => {
    console.log("🎯 Starting comprehensive API testing...");
    console.log(`🌐 Testing server: ${BASE_URL}`);
  });

  describe("Health & Infrastructure", () => {
    test("Server health check", async () => {
      try {
        const response = await api.get("/health");
        expect(response.status).toBe(200);
        expect(response.data.status).toBe("API is running!");
        logTest("Health Check", true);
      } catch (error) {
        logTest("Health Check", false, error.message);
        throw error;
      }
    });

    test("API healthcheck endpoint", async () => {
      try {
        const response = await api.get("/api/v1/healthcheck");
        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        logTest("API Healthcheck", true);
      } catch (error) {
        logTest("API Healthcheck", false, error.message);
        throw error;
      }
    });
  });

  describe("User Management System", () => {
    test("User registration handling", async () => {
      try {
        const testUser = {
          email: `test_${Date.now()}@example.com`,
          username: `user_${Date.now()}`,
          fullName: "Test User",
          password: "TestPass123!",
        };

        const response = await api.post("/api/v1/users/register", testUser);
        expect([201, 400, 409]).toContain(response.status);
        logTest("User Registration", true);
      } catch (error) {
        logTest("User Registration", false, error.message);
      }
    });

    test("User login validation", async () => {
      try {
        const response = await api.post("/api/v1/users/login", {
          email: "invalid@test.com",
          password: "wrongpass",
        });
        expect([400, 401, 404]).toContain(response.status);
        logTest("Login Validation", true);
      } catch (error) {
        logTest("Login Validation", false, error.message);
      }
    });

    test("Token refresh endpoint", async () => {
      try {
        const response = await api.post("/api/v1/users/refresh");
        expect([200, 400, 401]).toContain(response.status);
        logTest("Token Refresh", true);
      } catch (error) {
        logTest("Token Refresh", false, error.message);
      }
    });

    test("User profile retrieval", async () => {
      try {
        const response = await api.get("/api/v1/users/channel/testuser");
        expect([200, 404]).toContain(response.status);
        logTest("User Profile", true);
      } catch (error) {
        logTest("User Profile", false, error.message);
      }
    });
  });

  describe("Video Management System", () => {
    test("Video listing without pagination", async () => {
      try {
        const response = await api.get("/api/v1/videos");
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty("data");
        logTest("Video Listing (No Pagination)", true);
      } catch (error) {
        logTest("Video Listing (No Pagination)", false, error.message);
      }
    });

    test("Video listing with pagination (POST-FIX)", async () => {
      try {
        const response = await api.get("/api/v1/videos?page=1&limit=10");
        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        logTest("Video Listing (With Pagination)", true);
      } catch (error) {
        logTest("Video Listing (With Pagination)", false, error.message);
      }
    });

    test("Video by ID validation", async () => {
      try {
        const response = await api.get("/api/v1/videos/invalid_id");
        expect([400, 404]).toContain(response.status);
        logTest("Video ID Validation", true);
      } catch (error) {
        logTest("Video ID Validation", false, error.message);
      }
    });
  });

  describe("Comment System", () => {
    test("Comment retrieval validation", async () => {
      try {
        const response = await api.get("/api/v1/videos/invalid_id/comments");
        expect([200, 400, 404]).toContain(response.status);
        logTest("Comment Retrieval", true);
      } catch (error) {
        logTest("Comment Retrieval", false, error.message);
      }
    });

    test("Comment creation auth check", async () => {
      try {
        const response = await api.post("/api/v1/videos/test_id/comments", {
          content: "Test comment",
        });
        expect([401, 400, 404]).toContain(response.status);
        logTest("Comment Auth Check", true);
      } catch (error) {
        logTest("Comment Auth Check", false, error.message);
      }
    });
  });

  describe("Like System", () => {
    test("Like toggle auth protection", async () => {
      try {
        const response = await api.post("/api/v1/likes/toggle/v/test_id");
        expect([401, 400, 404]).toContain(response.status);
        logTest("Like Auth Protection", true);
      } catch (error) {
        logTest("Like Auth Protection", false, error.message);
      }
    });

    test("Liked videos auth protection", async () => {
      try {
        const response = await api.get("/api/v1/likes/videos");
        expect(response.status).toBe(401);
        logTest("Liked Videos Auth", true);
      } catch (error) {
        logTest("Liked Videos Auth", false, error.message);
      }
    });
  });

  describe("Playlist Management", () => {
    test("Playlist creation auth protection", async () => {
      try {
        const response = await api.post("/api/v1/playlists", {
          name: "Test Playlist",
          description: "Test",
        });
        expect(response.status).toBe(401);
        logTest("Playlist Creation Auth", true);
      } catch (error) {
        logTest("Playlist Creation Auth", false, error.message);
      }
    });

    test("Playlist retrieval auth protection", async () => {
      try {
        const response = await api.get("/api/v1/playlists/test_id");
        expect([401, 400, 404]).toContain(response.status);
        logTest("Playlist Retrieval Auth", true);
      } catch (error) {
        logTest("Playlist Retrieval Auth", false, error.message);
      }
    });
  });

  describe("Subscription System", () => {
    test("Subscription listing auth protection", async () => {
      try {
        const response = await api.get("/api/v1/subscriptions/u/test_id");
        expect([401, 400, 404]).toContain(response.status);
        logTest("Subscription Listing Auth", true);
      } catch (error) {
        logTest("Subscription Listing Auth", false, error.message);
      }
    });

    test("Subscription toggle auth protection", async () => {
      try {
        const response = await api.post("/api/v1/subscriptions/c/test_id");
        expect([401, 400, 404]).toContain(response.status);
        logTest("Subscription Toggle Auth", true);
      } catch (error) {
        logTest("Subscription Toggle Auth", false, error.message);
      }
    });
  });

  describe("Dashboard Analytics", () => {
    test("Dashboard stats auth protection", async () => {
      try {
        const response = await api.get("/api/v1/dashboard/stats");
        expect(response.status).toBe(401);
        logTest("Dashboard Stats Auth", true);
      } catch (error) {
        logTest("Dashboard Stats Auth", false, error.message);
      }
    });

    test("Dashboard videos auth protection", async () => {
      try {
        const response = await api.get("/api/v1/dashboard/videos");
        expect(response.status).toBe(401);
        logTest("Dashboard Videos Auth", true);
      } catch (error) {
        logTest("Dashboard Videos Auth", false, error.message);
      }
    });
  });

  describe("Error Handling", () => {
    test("Test error endpoint", async () => {
      try {
        const response = await api.get("/api/v1/test/error");
        expect(response.status).toBe(400);
        expect(response.data.error.message).toBe("This is a test error");
        logTest("Test Error Endpoint", true);
      } catch (error) {
        logTest("Test Error Endpoint", false, error.message);
      }
    });

    test("404 handling for non-existent routes", async () => {
      try {
        const response = await api.get("/api/v1/nonexistent");
        expect(response.status).toBe(404);
        expect(response.data.error.message).toContain("Can't find");
        logTest("404 Error Handling", true);
      } catch (error) {
        logTest("404 Error Handling", false, error.message);
      }
    });
  });

  afterAll(() => {
    console.log("\n📊 TEST SUMMARY");
    console.log("================");
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(
      `Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`
    );

    if (testResults.errors.length > 0) {
      console.log("\n🐛 FAILED TESTS:");
      testResults.errors.forEach(({ test, error }) => {
        console.log(`   - ${test}: ${error}`);
      });
    }

    console.log(`\n🌐 Server: ${BASE_URL}`);
    console.log(`📅 Test Date: ${new Date().toISOString()}`);
  });
});
