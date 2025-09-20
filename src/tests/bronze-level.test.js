import request from "supertest";
import { app } from "../app.js";

describe("Bronze Level - Essential API Tests", () => {
  test("Server health check should work", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.status).toBe("API is running!");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("uptime");
  });

  test("API healthcheck should work", async () => {
    const response = await request(app).get("/api/v1/healthcheck").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("OK");
  });

  test("404 error handling should work", async () => {
    const response = await request(app).get("/api/nonexistent").expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain("Can't find");
  });

  test("Videos endpoint should be accessible", async () => {
    const response = await request(app).get("/api/v1/videos").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("videos");
    expect(Array.isArray(response.body.data.videos)).toBe(true);
  });

  test("User registration validation should work", async () => {
    const response = await request(app)
      .post("/api/v1/users/register")
      .send({ username: "test" }) // Missing required fields
      .expect(400);

    expect(response.body).toHaveProperty("message");
  });

  test("User registration should work without avatar", async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const uniqueUsername = `testuser${Date.now()}`;

    const response = await request(app)
      .post("/api/v1/users/register")
      .send({
        username: uniqueUsername,
        email: uniqueEmail,
        password: "Password123!",
        fullName: "Test User",
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.username).toBe(uniqueUsername);
    expect(response.body.data.avatar).toBe(null); // Avatar should be null when not provided
  });
});
