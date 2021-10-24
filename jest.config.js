const { compilerOptions } = require("./tsconfig");

module.exports = {
  testEnvironment: "node",
  transform: {
    "\\.(ts|tsx)$": "ts-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
