import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Use jsdom for frontend components
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Use Babel for JavaScript and TypeScript
  },

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
    "^@/(.*)$": "<rootDir>/src/$1", // Support path aliasing for `@`
  },
  transformIgnorePatterns: [
    "node_modules/(?!(your-module)/)", // Customize if specific node_modules need transformation
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Optional Jest setup
};

export default config;
