export default {
  testEnvironment: "node",

  // Test file patterns
  testMatch: ["<rootDir>/Backend/src/tests/**/*.test.js"],

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/Backend/src/tests/setup/testSetup.js"],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    "Backend/src/**/*.js",
    "!Backend/src/tests/**",
    "!Backend/src/db/**",
    "!Backend/src/index.js",
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
