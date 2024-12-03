// src/lib/components/typing/TextDisplay.spec.js
import { test, expect } from "@playwright/experimental-ct-svelte";
import TextDisplay from "./TextDisplay.svelte";

test.describe("TextDisplay Component", () => {
  test("renders text correctly", async ({ mount }) => {
    const text = "Hello World";
    const component = await mount(TextDisplay, {
      props: {
        text,
        input: "",
        isComplete: false,
      },
    });

    for (const char of text) {
      const element = await component.locator(`.character:has-text("${char}")`);
      await expect(element).toBeVisible();
      await expect(element).toHaveClass(/pending/);
    }
  });

  test("highlights correct and incorrect characters", async ({ mount }) => {
    const text = "Hello";
    const input = "Hallo";

    const component = await mount(TextDisplay, {
      props: { text, input, isComplete: false },
    });

    // First character should be correct
    await expect(component.locator(".character").first()).toHaveClass(
      /correct/,
    );

    // Second character should be incorrect
    await expect(component.locator(".character").nth(1)).toHaveClass(
      /incorrect/,
    );
  });

  test("applies complete state styling", async ({ mount }) => {
    const component = await mount(TextDisplay, {
      props: {
        text: "Test",
        input: "Test",
        isComplete: true,
      },
    });

    await expect(component.locator(".typing-text-container")).toHaveClass(
      /complete/,
    );
  });
});
