# BARtype Testing Architecture: Integration and E2E Focus

## Directory Structure

The testing architecture maintains three distinct testing layers: unit tests adjacent to components, integration tests for feature flows, and end-to-end tests for complete application scenarios. Here is the refined structure:

```
bartype/
├── .github/
│   └── workflows/                   // GitHub Actions workflows
│       └── test.yml                 // GitHub Actions test configuration
├── .azure/                          // Azure-specific directory
│   └── azure-pipelines.yml          // Azure Pipelines configuration
├── package.json                     // Project dependencies and scripts
├── package-lock.json                // Lock file for dependencies
├── playwright.config.js             // Playwright configuration
├── README.md                        // Project documentation
│
├── backend/
│   └── src/
│       ├── config/
│       │   ├── environment.js
│       │   └── environment.spec.js
│       ├── core/
│       │   ├── session/
│       │   │   ├── StateManager.js
│       │   │   └── StateManager.spec.js
│       │   └── typing/
│       │       ├── TextGenerator.js
│       │       ├── TextAnalyzer.js
│       │       ├── MetricsCalculator.js
│       │       ├── TextGenerator.spec.js
│       │       ├── TextAnalyzer.spec.js
│       │       └── MetricsCalculator.spec.js
│       ├── middleware/
│       │   ├── errorHandler.js
│       │   ├── validation.js
│       │   ├── errorHandler.spec.js
│       │   └── validation.spec.js
│       ├── routes/
│       │   ├── api.js
│       │   └── api.spec.js
│       └── websocket/
│           ├── WSServer.js
│           ├── handlers/
│           │   ├── typingHandler.js
│           │   └── errorHandler.js
│           ├── WSServer.spec.js
│           └── handlers/
│               ├── typingHandler.spec.js
│               └── errorHandler.spec.js
├── frontend/
│   └── src/
│       ├── lib/
│       │   ├── components/
│       │   │   └── typing/
│       │   │       ├── TextDisplay.svelte
│       │   │       ├── TextInput.svelte
│       │   │       ├── Results.svelte
│       │   │       ├── TextDisplay.spec.js
│       │   │       ├── TextInput.spec.js
│       │   │       └── Results.spec.js
│       │   └── utils/
│       │       ├── websocket.js
│       │       └── websocket.spec.js
│       └── routes/
│           ├── +page.server.js
│           ├── +page.svelte
│           ├── +page.server.spec.js
│           └── +page.spec.js
└── tests/
    ├── integration/
    │   ├── api/
    │   │   ├── text-generation.spec.js
    │   │   ├── metrics-calculation.spec.js
    │   │   └── session-management.spec.js
    │   ├── websocket/
    │   │   ├── connection-handling.spec.js
    │   │   ├── real-time-updates.spec.js
    │   │   └── error-recovery.spec.js
    │   └── features/
    │       ├── typing-session/
    │       │   ├── normal-flow.spec.js
    │       │   ├── error-handling.spec.js
    │       │   └── disconnection-recovery.spec.js
    │       └── performance-tracking/
    │           ├── metrics-accuracy.spec.js
    │           └── real-time-updates.spec.js
    └── e2e/
        ├── fixtures/
        │   ├── typing-texts.json
        │   └── user-inputs.json
        ├── setup/
        │   ├── global-setup.js
        │   └── test-environment.js
        └── scenarios/
            ├── typing-experience/
            │   ├── complete-session.spec.js
            │   ├── input-validation.spec.js
            │   ├── error-handling.spec.js
            │   └── performance-feedback.spec.js
            ├── responsiveness/
            │   ├── real-time-feedback.spec.js
            │   └── websocket-stability.spec.js
            └── edge-cases/
                ├── connection-issues.spec.js
                ├── rapid-typing.spec.js
                └── long-sessions.spec.js
```

## Enhanced Integration Tests

The integration testing suite now provides comprehensive coverage of system interactions through three main categories:

1. API Integration Tests: Verify the correctness of backend service interactions
2. WebSocket Integration Tests: Ensure reliable real-time communication
3. Feature Integration Tests: Validate complete feature workflows

## Comprehensive End-to-End Tests

The end-to-end testing suite examines the application from a user's perspective, organized into three main areas:

1. Core Typing Experience: Tests the primary typing test functionality
2. System Responsiveness: Validates real-time feedback and performance
3. Edge Cases: Ensures reliability under various challenging conditions

# Testing Examples


### Backend Unit Test Example
```javascript
// backend/src/core/typing/TextGenerator.spec.js
const { test, expect } = require('@playwright/test');
const { TextGenerator } = require('./TextGenerator');

test.describe('TextGenerator', () => {
    let generator;

    test.beforeEach(() => {
        generator = new TextGenerator();
    });

    test('generates text of specified length', async () => {
        const wordCount = 50;
        const text = await generator.generateText(wordCount);
        const words = text.split(' ');
        expect(words).toHaveLength(wordCount);
    });

    test('maintains word complexity within bounds', async () => {
        const text = await generator.generateText(20);
        const words = text.split(' ');
        for (const word of words) {
            expect(word.length).toBeLessThanOrEqual(12);
        }
    });
});
```

### Frontend Component Test Example
```javascript
// frontend/src/lib/components/typing/TextDisplay.spec.js
const { test, expect } = require('@playwright/test');
const { mount } = require('@playwright/experimental-ct-svelte');
const TextDisplay = require('./TextDisplay.svelte');

test.describe('TextDisplay Component', () => {
    test('renders text correctly', async ({ mount }) => {
        const text = 'Sample typing text';
        const component = await mount(TextDisplay, {
            props: { text }
        });
        
        await expect(component).toContainText(text);
    });

    test('highlights errors correctly', async ({ mount }) => {
        const text = 'test';
        const input = 'tast';
        const component = await mount(TextDisplay, {
            props: { text, input }
        });
        
        const errorChar = await component.locator('.error').first();
        await expect(errorChar).toBeVisible();
        await expect(errorChar).toHaveText('e');
    });
});
```

### Integration Test Example
```javascript
// tests/integration/flows/typing-session.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Typing Session Flow', () => {
    test('completes full typing session successfully', async ({ page }) => {
        await page.goto('/');
        
        // Start session
        await page.click('[data-testid="start-button"]');
        
        // Simulate typing
        const textInput = page.locator('[data-testid="typing-input"]');
        await textInput.type('The quick brown fox');
        
        // Verify results
        const wpmScore = page.locator('[data-testid="wpm-score"]');
        const accuracyScore = page.locator('[data-testid="accuracy-score"]');
        
        await expect(wpmScore).toBeVisible();
        await expect(accuracyScore).toBeVisible();
    });
});
```

### End-to-End Test Example
```javascript
// tests/e2e/specs/full-application.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Full Application E2E', () => {
    test('handles complete user journey', async ({ page }) => {
        // Load application
        await page.goto('/');
        await expect(page).toHaveTitle(/BARtype/);

        // Start new session
        const startButton = page.locator('[data-testid="start-button"]');
        await startButton.click();

        // Verify text display
        const textDisplay = page.locator('[data-testid="text-display"]');
        await expect(textDisplay).toBeVisible();

        // Complete typing test
        const input = page.locator('[data-testid="typing-input"]');
        const targetText = await textDisplay.textContent();
        await input.type(targetText);

        // Verify results
        const results = page.locator('[data-testid="results-panel"]');
        await expect(results).toBeVisible();
        await expect(results).toContainText('WPM');
        await expect(results).toContainText('Accuracy');
    });
});
```

### Configuration Files

```javascript
// playwright.config.js
module.exports = {
    testDir: './',
    testMatch: ['**/*.spec.js'],
    projects: [
        {
            name: 'unit',
            testMatch: ['src/**/*.spec.js']
        },
        {
            name: 'integration',
            testMatch: ['tests/integration/**/*.spec.js'],
            use: {
                baseURL: 'http://localhost:3000'
            }
        },
        {
            name: 'e2e',
            testMatch: ['tests/e2e/**/*.spec.js'],
            use: {
                baseURL: 'http://localhost:3000',
                screenshot: 'only-on-failure'
            }
        }
    ],
    use: {
        trace: 'on-first-retry'
    }
};
```

# CI Pipeline Test Execution:
For Azure Pipelines:
```
# azure-pipelines.yml

trigger:
  - main

jobs:
  - job: TestExecution
    displayName: 'Execute Test Suite'
    pool:
      vmImage: 'ubuntu-latest'

    steps:
    - task: NodeJS@0
      displayName: 'Install Node.js'
      inputs:
        versionSpec: '18.x'

    - task: Cache@2
      displayName: 'Cache npm packages'
      inputs:
        key: 'npm | "$(Agent.OS)" | package-lock.json'
        restoreKeys: |
          npm | "$(Agent.OS)"
        path: $(npm_config_cache)

    - script: |
        npm ci
      displayName: 'Install Dependencies'

    - script: |
        npx playwright install
      displayName: 'Install Playwright Browsers'

    - script: |
        npm run test:unit
      displayName: 'Execute Unit Tests'
      continueOnError: false

    - script: |
        npm run test:integration
      displayName: 'Execute Integration Tests'
      continueOnError: false

    - script: |
        npm run test:e2e
      displayName: 'Execute E2E Tests'
      continueOnError: false

    - task: PublishTestResults@2
      displayName: 'Publish Test Results'
      inputs:
        testResultsFiles: 'test-results/junit.xml'
        mergeTestResults: true
        testRunTitle: 'BARtype Test Results'

    - task: PublishBuildArtifacts@1
      displayName: 'Publish Test Artifacts'
      inputs:
        pathToPublish: 'test-results'
        artifactName: 'test-results'
```

For GitHub Actions:
```
# .github/workflows/test.yml

name: BARtype Test Suite

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install Dependencies
      run: npm ci

    - name: Install Playwright Browsers
      run: npx playwright install

    - name: Execute Unit Tests
      run: npm run test:unit

    - name: Execute Integration Tests
      run: npm run test:integration

    - name: Execute E2E Tests
      run: npm run test:e2e

    - name: Upload Test Results
      uses: actions/upload-artifact@v4
      if: always()
      with:
        name: test-results
        path: test-results/
        retention-days: 30

    - name: Report Test Results
      uses: dorny/test-reporter@v1
      if: always()
      with:
        name: Test Results
        path: test-results/junit.xml
        reporter: jest-junit
```

To support these CI configurations, we need to update our `package.json` with appropriate test scripts:
```
{
  "scripts": {
    "test:unit": "playwright test --config=playwright.config.js --project=unit",
    "test:integration": "playwright test --config=playwright.config.js --project=integration",
    "test:e2e": "playwright test --config=playwright.config.js --project=e2e",
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```