import type { Config } from "jest";

const ES_MODULES = [
  "filenamify",
  "trim-repeated",
  "escape-string-regexp",
  "filename-reserved-regex",
  "strip-outer",
].join("|");

export default {
  testEnvironment: "node",
  transform: {
    "\\.m?(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [`/node_modules/(?!${ES_MODULES})`],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  extensionsToTreatAsEsm: [".ts"],
} satisfies Config;
