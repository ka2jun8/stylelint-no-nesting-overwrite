/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-preset-stylelint",
  transform: {
    ".+\\.ts$": ["@swc/jest"],
  },
  testPathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/node_modules"],
};
