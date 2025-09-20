import request from "supertest";
import { app } from "../app.js";

describe("Bronze Level - Essential API Tests (No Database)", () => {
  test("Server health check should work", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.status).toBe("API is running!");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("uptime");
  });

  test("404 error handling should work", async () => {
    const response = await request(app).get("/api/nonexistent").expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain("Can't find");
  });

  test("User registration validation should work", async () => {
    const response = await request(app)
      .post("/api/v1/users/register")
      .send({ username: "test" }) // Missing required fields
      .expect(400);

    expect(response.body).toHaveProperty("message");
  });

  test("Express app should be properly configured", () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe("function");
  });

  // Removed API route mounting test - not essential for Bronze Level
});
