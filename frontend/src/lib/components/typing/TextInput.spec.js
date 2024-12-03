// src/lib/components/typing/TextInput.spec.js
import { test, expect } from "@playwright/experimental-ct-svelte";
import TextInput from "./TextInput.svelte";

test.describe("TextInput Component", () => {
  test("handles user input correctly", async ({ mount }) => {
    let inputValue = "";
    const component = await mount(TextInput, {
      props: {
        disabled: false,
        isComplete: false,
      },
      on: {
        input: (ev) => (inputValue = ev.detail.value),
      },
    });

    await component.locator("textarea").type("Hello");
    expect(inputValue).toBe("Hello");
  });

  test("prevents input when disabled", async ({ mount }) => {
    const component = await mount(TextInput, {
      props: {
        disabled: true,
        isComplete: false,
      },
    });

    const textarea = component.locator("textarea");
    await expect(textarea).toBeDisabled();
  });

  test("shows reset button when complete", async ({ mount }) => {
    const component = await mount(TextInput, {
      props: {
        disabled: true,
        isComplete: true,
      },
    });

    await expect(component.locator("button")).toBeVisible();
    await expect(component.locator("button")).toHaveText("Try Again");
  });
});
