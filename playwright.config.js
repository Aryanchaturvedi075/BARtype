// playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  timeout: 30000,
  expect: { timeout: 5000 },
  // Force all tests to be run sequentially
  // workers: 1,

  projects: [
    {
      name: "unit",
      testMatch: [
        "./backend/src/**/!(websocket)/*.spec.js",
        "./frontend/src/lib/utils/!(websocket)*.spec.js",
      ],
    },
    {
      name: "websocket-unit",
      testMatch: [
        "./backend/src/websocket/**/*.spec.js",
        "./frontend/src/lib/utils/websocket.spec.js",
      ],
      use: {
        actionTimeout: 5000,
        testTimeout: 10000,
      },
    },
    {
      name: "integration",
      testDir: "./tests/integration",
      testMatch: "**/*.spec.js",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "e2e",
      testDir: "./tests/e2e",
      testMatch: "**/*.spec.js",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "cd backend && npm run dev",
      port: 3001,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "cd frontend && npm run dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
