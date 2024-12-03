// tests/integration/typing-session/real-time-updates.spec.js
import { test, expect } from "@playwright/test";
import { setupTypingSession } from "../../setup/test-environment.js";

test.describe("Real-time Updates During Typing", () => {
  test("provides immediate feedback", async ({ page }) => {
    await setupTypingSession(page);

    const input = page.locator('[data-testid="typing-input"]');
    await input.type("t");

    // Verify immediate character highlighting
    await expect(page.locator(".character").first()).toHaveClass(/correct/);
  });
});
