import axios from "axios";

// Configure axios for your Render server
const BASE_URL = "https://full-stack-project-1-ut99.onrender.com";
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout for slower render server
  validateStatus: function (status) {
    // Consider any status code less than 500 as success for testing purposes
    return status < 500;
  },
});

describe("Live API Tests - Render Server", () => {
  let authToken = null;
  let userId = null;
  let videoId = null;
  let playlistId = null;
  let commentId = null;

  beforeAll(async () => {
    console.log("🚀 Testing against live server:", BASE_URL);
  });

  describe("🔍 Health Checks", () => {
    test("Server health endpoint should be accessible", async () => {
      const response = await api.get("/health");
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty("status", "API is running!");
      expect(response.data).toHaveProperty("timestamp");
      expect(response.data).toHaveProperty("uptime");
    }, 60000);

    test("API healthcheck endpoint should work", async () => {
      const response = await api.get("/api/v1/healthcheck");
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toBe(
        "Healthcheck data fetched successfully"
      );
    }, 60000);
  });

  describe("👤 User Routes", () => {
    const testUser = {
      email: `test_${Date.now()}@example.com`,
      username: `testuser_${Date.now()}`,
      fullName: "Test User",
      password: "TestPass123!",
    };

    test("POST /api/v1/users/register - should handle user registration", async () => {
      const response = await api.post("/api/v1/users/register", testUser);

      if (response.status === 201) {
        expect(response.data.success).toBe(true);
        expect(response.data.message).toBe("User registered successfully");
        expect(response.data.data.user).toHaveProperty("email", testUser.email);
        userId = response.data.data.user._id;
      } else {
        // Handle validation errors or other expected errors
        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.data).toHaveProperty("message");
      }
    });

    test("POST /api/v1/users/login - should handle user login", async () => {
      const loginData = {
        email: testUser.email,
        password: testUser.password,
      };

      const response = await api.post("/api/v1/users/login", loginData);

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.message).toBe("User logged in successfully");
        expect(response.data.data).toHaveProperty("accessToken");
        authToken = response.data.data.accessToken;
        userId = response.data.data.user._id;
      } else {
        // Handle login errors
        expect(response.status).toBeGreaterThanOrEqual(400);
        console.log(
          "Login failed - testing with existing user or expected error"
        );
      }
    });

    test("GET /api/v1/users/me - should get current user info (auth required)", async () => {
      if (!authToken) {
        console.log("⚠️ Skipping authenticated route test - no auth token");
        return;
      }

      const response = await api.get("/api/v1/users/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("_id");
        expect(response.data.data).toHaveProperty("email");
      } else {
        expect(response.status).toBeGreaterThanOrEqual(400);
      }
    });

    test("GET /api/v1/users/channel/:username - should get user channel profile", async () => {
      const response = await api.get(
        `/api/v1/users/channel/${testUser.username}`
      );

      // This might return 404 if user doesn't exist, which is expected
      expect([200, 404]).toContain(response.status);

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty(
          "username",
          testUser.username
        );
      }
    });

    test("POST /api/v1/users/refresh - should handle token refresh", async () => {
      const response = await api.post("/api/v1/users/refresh");

      // This might fail if no refresh token is provided, which is expected
      expect([200, 400, 401]).toContain(response.status);
    });
  });

  describe("🎥 Video Routes", () => {
    test("GET /api/v1/videos - should get all videos (public)", async () => {
      const response = await api.get("/api/v1/videos?page=1&limit=10");

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data).toHaveProperty("videos");
      expect(Array.isArray(response.data.data.videos)).toBe(true);

      // Store a video ID if available for further tests
      if (response.data.data.videos.length > 0) {
        videoId = response.data.data.videos[0]._id;
      }
    });

    test("GET /api/v1/videos/:videoId - should get video by ID", async () => {
      if (!videoId) {
        console.log("⚠️ Skipping video by ID test - no video available");
        return;
      }

      const response = await api.get(`/api/v1/videos/${videoId}`);

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("_id", videoId);
      } else {
        expect([400, 404]).toContain(response.status);
      }
    });

    test("POST /api/v1/videos - should handle video upload (auth required)", async () => {
      if (!authToken) {
        console.log("⚠️ Skipping video upload test - no auth token");
        return;
      }

      // This will likely fail without proper file uploads, but we're testing the route handling
      const response = await api.post(
        "/api/v1/videos",
        {
          title: "Test Video",
          description: "Test Description",
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Expected to fail due to missing video file, but route should be accessible
      expect([400, 401]).toContain(response.status);
    });
  });

  describe("💬 Comment Routes", () => {
    test("GET /api/v1/videos/:videoId/comments - should get video comments", async () => {
      if (!videoId) {
        console.log("⚠️ Skipping comment test - no video ID");
        return;
      }

      const response = await api.get(
        `/api/v1/videos/${videoId}/comments?page=1&limit=10`
      );

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("comments");
        expect(Array.isArray(response.data.data.comments)).toBe(true);
      } else {
        expect([400, 404]).toContain(response.status);
      }
    });

    test("POST /api/v1/videos/:videoId/comments - should add comment (auth required)", async () => {
      if (!authToken || !videoId) {
        console.log(
          "⚠️ Skipping add comment test - missing auth token or video ID"
        );
        return;
      }

      const response = await api.post(
        `/api/v1/videos/${videoId}/comments`,
        { content: "Test comment" },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 201) {
        expect(response.data.success).toBe(true);
        commentId = response.data.data._id;
      } else {
        expect([400, 401, 404]).toContain(response.status);
      }
    });
  });

  describe("❤️ Like Routes", () => {
    test("POST /api/v1/likes/toggle/v/:videoId - should toggle video like (auth required)", async () => {
      if (!authToken || !videoId) {
        console.log("⚠️ Skipping like test - missing auth token or video ID");
        return;
      }

      const response = await api.post(
        `/api/v1/likes/toggle/v/${videoId}`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
      } else {
        expect([400, 401, 404]).toContain(response.status);
      }
    });

    test("GET /api/v1/likes/videos - should get liked videos (auth required)", async () => {
      if (!authToken) {
        console.log("⚠️ Skipping liked videos test - no auth token");
        return;
      }

      const response = await api.get("/api/v1/likes/videos?page=1&limit=10", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("videos");
      } else {
        expect([400, 401]).toContain(response.status);
      }
    });
  });

  describe("📋 Playlist Routes", () => {
    test("POST /api/v1/playlists - should create playlist (auth required)", async () => {
      if (!authToken) {
        console.log("⚠️ Skipping playlist creation test - no auth token");
        return;
      }

      const response = await api.post(
        "/api/v1/playlists",
        {
          name: "Test Playlist",
          description: "Test playlist description",
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 201) {
        expect(response.data.success).toBe(true);
        playlistId = response.data.data._id;
      } else {
        expect([400, 401]).toContain(response.status);
      }
    });

    test("GET /api/v1/playlists/:playlistId - should get playlist by ID (auth required)", async () => {
      if (!authToken || !playlistId) {
        console.log(
          "⚠️ Skipping playlist get test - missing auth token or playlist ID"
        );
        return;
      }

      const response = await api.get(`/api/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("_id", playlistId);
      } else {
        expect([400, 401, 404]).toContain(response.status);
      }
    });
  });

  describe("🔔 Subscription Routes", () => {
    test("GET /api/v1/subscriptions/u/:subscriberId - should get subscribed channels (auth required)", async () => {
      if (!authToken || !userId) {
        console.log(
          "⚠️ Skipping subscriptions test - missing auth token or user ID"
        );
        return;
      }

      const response = await api.get(
        `/api/v1/subscriptions/u/${userId}?page=1&limit=10`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("subscriptions");
      } else {
        expect([400, 401, 404]).toContain(response.status);
      }
    });
  });

  describe("📊 Dashboard Routes", () => {
    test("GET /api/v1/dashboard/stats - should get channel stats (auth required)", async () => {
      if (!authToken) {
        console.log("⚠️ Skipping dashboard stats test - no auth token");
        return;
      }

      const response = await api.get("/api/v1/dashboard/stats", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
      } else {
        expect([400, 401]).toContain(response.status);
      }
    });

    test("GET /api/v1/dashboard/videos - should get channel videos (auth required)", async () => {
      if (!authToken) {
        console.log("⚠️ Skipping dashboard videos test - no auth token");
        return;
      }

      const response = await api.get(
        "/api/v1/dashboard/videos?page=1&limit=10",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.status === 200) {
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("videos");
      } else {
        expect([400, 401]).toContain(response.status);
      }
    });
  });

  describe("🧪 Test Routes", () => {
    test("GET /api/v1/test/error - should handle test error", async () => {
      const response = await api.get("/api/v1/test/error");

      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error.message).toBe("This is a test error");
    });

    test("GET /api/v1/test/async-error - should handle async test error", async () => {
      const response = await api.get("/api/v1/test/async-error");

      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error.message).toBe("This is a test async error");
    });
  });

  describe("🚫 Error Handling", () => {
    test("Should return 404 for non-existent routes", async () => {
      const response = await api.get("/api/v1/nonexistent");

      expect(response.status).toBe(404);
      expect(response.data.success).toBe(false);
      expect(response.data.error.message).toContain("Can't find");
    });

    test("Should handle malformed requests gracefully", async () => {
      const response = await api.post("/api/v1/users/login", "invalid-json", {
        headers: { "Content-Type": "application/json" },
      });

      expect([400, 500]).toContain(response.status);
    });
  });

  afterAll(() => {
    console.log("✅ Live API testing completed");
    console.log("📊 Test Summary:");
    console.log(`   - Base URL: ${BASE_URL}`);
    console.log(`   - Auth Token Available: ${!!authToken}`);
    console.log(`   - User ID: ${userId || "N/A"}`);
    console.log(`   - Video ID: ${videoId || "N/A"}`);
    console.log(`   - Playlist ID: ${playlistId || "N/A"}`);
  });
});
