// tests/e2e/scenarios/typing-experience/complete-session.spec.js
import { test, expect } from "@playwright/test";
import { setupTypingSession } from "../../../setup/test-environment.js";
import typingTexts from "../../fixtures/typing-texts.json";

test.describe("Complete Typing Session", () => {
  test("completes entire typing flow successfully", async ({ page }) => {
    await setupTypingSession(page);

    // Complete typing test
    await page
      .locator('[data-testid="typing-input"]')
      .type(typingTexts.shortText);

    // Verify results
    await expect(page.locator('[data-testid="results"]')).toBeVisible();
    await expect(page.locator('[data-testid="wpm-value"]')).toBeVisible();
    await expect(page.locator('[data-testid="accuracy-value"]')).toBeVisible();

    // Verify reset functionality
    await page.locator('[data-testid="reset-button"]').click();
    await expect(page.locator('[data-testid="typing-input"]')).toBeEmpty();
  });
});
