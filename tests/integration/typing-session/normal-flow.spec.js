// tests/integration/typing-session/normal-flow.spec.js
import { test, expect } from "@playwright/test";
import { setupTypingSession } from "../../setup/test-environment.js";

test.describe("Normal Typing Flow", () => {
  test("completes typing session successfully", async ({ page }) => {
    await setupTypingSession(page);

    // Type text perfectly
    await page.locator('[data-testid="typing-input"]').type("test text");

    // Verify completion
    await expect(page.locator('[data-testid="results"]')).toBeVisible();
    const wpm = await page.locator('[data-testid="wpm-value"]').textContent();
    expect(Number(wpm)).toBeGreaterThan(0);
  });
});
