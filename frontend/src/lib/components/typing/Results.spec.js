// src/lib/components/typing/Results.spec.js
import { test, expect } from "@playwright/experimental-ct-svelte";
import Results from "./Results.svelte";

test.describe("Results Component", () => {
  const sampleMetrics = {
    wpm: 50.5,
    accuracy: 98.2,
    duration: 1.5,
    errorRate: 2.3,
  };

  test("displays metrics correctly", async ({ mount }) => {
    const component = await mount(Results, {
      props: {
        metrics: sampleMetrics,
        isVisible: true,
      },
    });

    await expect(component.locator('[data-testid="wpm-value"]')).toHaveText(
      "50.5",
    );
    await expect(
      component.locator('[data-testid="accuracy-value"]'),
    ).toHaveText("98.2%");
    await expect(
      component.locator('[data-testid="error-rate-value"]'),
    ).toHaveText("2.3/min");
  });

  test("handles visibility toggle", async ({ mount }) => {
    const component = await mount(Results, {
      props: {
        metrics: sampleMetrics,
        isVisible: false,
      },
    });

    await expect(component.locator(".results-container")).toHaveClass(
      /opacity-0/,
    );

    await component.update({
      isVisible: true,
    });

    await expect(component.locator(".results-container")).toHaveClass(
      /opacity-100/,
    );
  });
});
