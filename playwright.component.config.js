// for the Svelte components tests in the frontend/src/lib/components folder
// and the Svelte page tests in the frontend/src/routes folder 

import { defineConfig } from '@playwright/experimental-ct-svelte';

export default defineConfig({
  testDir: './frontend/src',
  testMatch: [
    './lib/components/typing/*.spec.js',
    './routes/*!(.server).spec.js'
  ],
  timeout: 10000,                                                   // Global test timeout
  use: {
    ctPort: 3000,                                                   // Port for the Component Test server
    ctViteConfig: { plugins: ['@sveltejs/vite-plugin-svelte'] },    // Vite config for the Component Test server
  },
});