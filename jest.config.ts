/** @jest-config-loader ts-node */
import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transformIgnorePatterns: ["node_modules/(?!(sucrase)/)"],
    transform: {
      "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
    },
  };
};
