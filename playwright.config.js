// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Global test settings
  testDir: './',
  testMatch: '**/*.spec.js',
  timeout: 30000,
  expect: {
    timeout: 5000
  },

  // Force all tests to be run sequentially
  workers: 1,

  // Common reporter configuration
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  // Project-specific configurations
  projects: [
    {
      name: 'unit',
      testDir: './src',
      testMatch: '**/*.spec.js',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'off',
        video: 'off',
        trace: 'off'
      }
    },
    {
      name: 'integration',
      testDir: './tests/integration',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
      },
      dependencies: ['unit']
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000',
        screenshot: 'on',
        video: 'on',
        trace: 'on',
        launchOptions: {
          slowMo: 100
        }
      },
      dependencies: ['integration']
    }
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },

  // Use the same configuration across all projects
  use: {
    // Browser considerations
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Automation configurations
    actionTimeout: 10000,
    navigationTimeout: 15000,

    // Retry configuration
    retry: 2,

    // Test isolation
    testIsolation: true,

    // Artifacts
    preserveOutput: 'failures-only',
  }
});