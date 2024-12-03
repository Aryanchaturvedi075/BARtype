// tests/e2e/scenarios/responsiveness/real-time-feedback.spec.js
import { test, expect } from '@playwright/test';
import { setupTypingSession } from '../../setup/test-environment.js';

test.describe('Real-time Feedback', () => {
  test('provides immediate visual feedback', async ({ page }) => {
    await setupTypingSession(page);
    
    const input = page.locator('[data-testid="typing-input"]');
    
    // Type character by character and verify feedback
    for (const char of 'test') {
      await input.type(char);
      // Verify character highlighting updates
      await expect(page.locator('.character.correct')).toHaveCount(input.value.length);
    }
  });

  test('handles network latency gracefully', async ({ page }) => {
    // Simulate slow network conditions
    await page.route('**/*', (route) => route.continue({ delay: 100 }));
    
    await setupTypingSession(page);
    await page.locator('[data-testid="typing-input"]').type('test');
    
    // Verify UI remains responsive
    await expect(page.locator('.character.correct')).toHaveCount(4);
  });
});