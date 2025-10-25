// Simple test to verify Jest is working

describe("Jest Setup Verification", () => {
  test("Jest is working perfectly", () => {
    expect(1 + 1).toBe(2);
  });

  test("Test environment is set", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });

  test("Global test user is available", () => {
    expect(global.testUser).toBeDefined();
    expect(global.testUser.email).toBe("test@example.com");
  });
});
