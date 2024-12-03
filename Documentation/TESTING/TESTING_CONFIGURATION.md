# Finalised Playwright Configuration for BARtype

## Introduction

This document outlines the finalised Playwright testing configuration for the BARtype typing test application. The configuration supports comprehensive testing across unit, integration, and end-to-end testing scenarios while maintaining clear separation of concerns and optimal test execution efficiency.

## Configuration Structure

The testing configuration is divided into two main files: a general configuration file handling unit, integration, and end-to-end tests, and a specialized configuration for Svelte component testing.

### Component Testing Configuration

The following configuration, stored in `playwright.component.config.js` in the root directory, handles all Svelte component testing:

```javascript
import { defineConfig } from '@playwright/experimental-ct-svelte';

export default defineConfig({
  testDir: './frontend/src',
  testMatch: [
    './lib/components/typing/*.spec.js',
    './routes/*!(.server).spec.js'
  ],
  timeout: 10000,                                                   // Global test timeout
  use: {
    ctPort: 3100,                                                   // Port for the Component Test server
    ctViteConfig: { plugins: ['@sveltejs/vite-plugin-svelte'] },    // Vite config for the Component Test server
  },
});
```

### Main Testing Configuration

The primary configuration file, stored as `playwright.config.js` in the root directory, manages unit tests, WebSocket-specific tests, integration tests, and end-to-end tests:

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30000,
  expect: { timeout: 5000 },
  // Force all tests to be run sequentially
  workers: 1,

  projects: [
    {
      name: 'unit',
      testMatch: [
        './backend/src/**/!(websocket)/*.spec.js',
        './frontend/src/lib/utils/!(websocket)*.spec.js'
      ]
    },
    {
      name: 'websocket-unit',
      testMatch: [
        './backend/src/websocket/**/*.spec.js',
        './frontend/src/lib/utils/websocket.spec.js'
      ],
      use: {
        actionTimeout: 5000,
        testTimeout: 10000
      }
    },
    {
      name: 'integration',
      testDir: './tests/integration',
      testMatch: '**/*.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000'
      },
      dependencies: ['unit']
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      testMatch: '**/*.spec.js',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3000'
      },
      dependencies: ['integration']
    }
  ],
  webServer: [
    {
      command: 'cd backend && npm run dev',
      port: 3001,
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'cd frontend && npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI
    }
  ]
});
```

## Test Execution Configuration

The following scripts in the root `package.json` file enable comprehensive test execution:

```json
{
  "scripts": {
    "test:unit": "playwright test --project=unit",
    "test:websocket": "playwright test --project=websocket-unit",
    "test:components": "playwright test -c playwright.component.config.js",
    "test:integration": "playwright test --project=integration",
    "test:e2e": "playwright test --project=e2e",
    "test": "npm run test:unit && npm run test:websocket && npm run test:components && npm run test:integration && npm run test:e2e",
    "test:debug": "playwright test --debug",
    "test:ui": "playwright test --ui"
  }
}
```

## Coverage Analysis

This configuration provides comprehensive coverage for all test files in the project structure:

1. Unit Tests
   - Backend service and utility tests
   - Frontend utility tests
   - WebSocket-specific unit tests with appropriate timeout settings

2. Component Tests
   - Svelte component tests
   - Page component tests
   - Route-related tests

3. Integration Tests
   - API integration tests
   - Feature integration tests
   - WebSocket integration scenarios

4. End-to-End Tests
   - Complete user flow scenarios
   - Performance testing
   - Edge case testing

## Special Considerations

The configuration accounts for several specific requirements:

1. WebSocket Testing
   - Dedicated project configuration with appropriate timeouts
   - Separate execution script for focused testing

2. Browser Requirements
   - Browser environment only for integration and E2E tests
   - Component tests use specialized Svelte testing environment
   - Unit tests execute without browser dependencies

3. Development Server
   - Automatic handling of frontend and backend server startup
   - Proper server reuse settings for development and CI environments

## Conclusion

This configuration structure ensures reliable and efficient test execution across all aspects of the BARtype application while maintaining clear separation between different types of tests. The configuration is optimized for JavaScript testing and provides appropriate environments for each test category.