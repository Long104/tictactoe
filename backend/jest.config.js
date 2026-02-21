// Setup file for Jest tests
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/__tests__"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverageFrom: ["<rootDir>/src"],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageOnlyFrom: ["src"],
  testTimeout: 10000
};
