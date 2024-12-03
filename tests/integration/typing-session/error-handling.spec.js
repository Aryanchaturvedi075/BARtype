// tests/integration/typing-session/error-handling.spec.js
import { test, expect } from "@playwright/test";
import { setupTypingSession } from "../../setup/test-environment.js";

test.describe("Error Handling in Typing Session", () => {
  test("recovers from typing errors", async ({ page }) => {
    await setupTypingSession(page);

    // Type with deliberate errors
    const input = page.locator('[data-testid="typing-input"]');
    await input.type("wrongtext");
    await input.press("Backspace".repeat(9));
    await input.type("correct text");

    // Verify error recovery
    const accuracy = await page
      .locator('[data-testid="accuracy-value"]')
      .textContent();
    expect(Number(accuracy)).toBeLessThan(100);
  });
});
