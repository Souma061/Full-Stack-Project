export default {
  testEnvironment: "node",

  // Test file patterns
  testMatch: ["<rootDir>/src/tests/**/*.test.js"],

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup/testSetup.js"],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/tests/**",
    "!src/db/**",
    "!src/index.js",
  ],

  // Module resolution for ES modules
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  // Transform configuration for ES modules
  transform: {},

  // Timeout
  testTimeout: 30000,

  // Verbose output
  verbose: true,
};
