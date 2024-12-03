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
│       │   └── environment.js
│       ├── core/
│       │   ├── session/
│       │   │   ├── StateManager.js
│       │   │   └── StateManager.spec.js                [unit test]
│       │   └── typing/
│       │       ├── TextGenerator.js
│       │       ├── TextAnalyzer.js
│       │       ├── MetricsCalculator.js
│       │       ├── TextGenerator.spec.js               [unit test]
│       │       ├── TextAnalyzer.spec.js                [unit test]
│       │       └── MetricsCalculator.spec.js           [unit test]
│       ├── middleware/
│       │   ├── errorHandler.js
│       │   ├── validation.js
│       │   ├── errorHandler.spec.js                    [unit test]
│       │   └── validation.spec.js                      [unit test]
│       ├── routes/
│       │   └── api.js
│       └── websocket/
│           ├── WSServer.js
|           ├── WSServer.spec.js
│           └── handlers/
│               ├── typingHandler.js
│               ├── errorHandler.js
│               ├── typingHandler.spec.js               [unit test]
│               └── errorHandler.spec.js                [unit test]
│
├── frontend/
│   └── src/
│       ├── lib/
│       │   ├── components/
│       │   │   └── typing/
│       │   │       ├── TextDisplay.svelte
│       │   │       ├── TextInput.svelte
│       │   │       └── Results.svelte
│       │   └── utils/
│       │       ├── websocket.js
│       │       └── websocket.js                        [unit test]
│       └── routes/
│           ├── +page.server.js
│           └── +page.svelte
└── tests/
    ├── integration/
    │   ├── api/
    │   │   ├── text-generation.spec.js                 [integration test]
    │   │   └── metrics-calculation.spec.js             [integration test]
    │   ├── websocket/
    │   │   └── connection-handling.spec.js             [integration test]
    │   └── typing-session/
    │       ├── normal-flow.spec.js                     [integration test]
    │       ├── error-handling.spec.js                  [integration test]
    │       └── real-time-updates.spec.js               [integration test]
    └── e2e/
        ├── fixtures/
        │   ├── typing-texts.json
        │   └── user-inputs.json
        ├── setup/
        │   ├── global-setup.js
        │   └── test-environment.js
        └── scenarios/
            ├── typing-experience/
            │   └── complete-session.spec.js            [end-to-end test]
            └── responsiveness/
                └── real-time-feedback.spec.js          [end-to-end test]
```
