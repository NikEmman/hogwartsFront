module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // Handle CSS imports
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { configFile: "./.babelrc" }],
  },
  // Ensure node_modules are not ignored for transformation if they use ESM
  transformIgnorePatterns: [
    "/node_modules/(?!(@testing-library|jest-fetch-mock)/)",
  ],
};
