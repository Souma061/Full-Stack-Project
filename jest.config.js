export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ['**/_tests_/**/*.test.js',
            '**/tests/**/*.test.js'],
  collectCoverageForm: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/index.js",
    "!src/jobs.js"

  ],
  coverageThreshold: {
    global: {
      branches:70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  },
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testTimeout: 20000
};
