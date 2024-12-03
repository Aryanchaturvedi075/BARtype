// src/routes/+page.spec.js
import { test, expect } from "@playwright/experimental-ct-svelte";
import Page from "./+page.svelte";

test.describe("Main Page", () => {
  test("renders initial state correctly", async ({ mount }) => {
    const component = await mount(Page);

    await expect(component.locator("h1")).toHaveText("BARtype");
    await expect(component.locator(".typing-text-container")).toBeVisible();
    await expect(component.locator("textarea")).toBeEnabled();
  });

  test("handles error states", async ({ mount }) => {
    const component = await mount(Page, {
      props: {
        error: "Test error message",
      },
    });

    await expect(component.locator(".alert")).toContainText(
      "Test error message",
    );
  });
});
