import { test, expect } from "@playwright/test";
import { MetricsCalculator } from "./MetricsCalculator.js";

test.describe("MetricsCalculator", () => {
  let calculator;

  test.beforeEach(() => {
    calculator = new MetricsCalculator();
  });

  test("calculates WPM correctly", () => {
    const totalCharacters = 250; // 50 five-character words
    const durationInMinutes = 1;

    const wpm = calculator.calculateWPM(totalCharacters, durationInMinutes);
    expect(wpm).toBe(50);
  });

  test("calculates error rate correctly", () => {
    const errorCount = 10;
    const durationInMinutes = 2;

    const errorRate = calculator.calculateErrorRate(
      errorCount,
      durationInMinutes,
    );
    expect(errorRate).toBe(5);
  });

  test("calculates net WPM correctly", () => {
    const grossWPM = 50;
    const errorCount = 10;
    const durationInMinutes = 1;

    const netWPM = calculator.calculateNetWPM(
      grossWPM,
      errorCount,
      durationInMinutes,
    );
    expect(netWPM).toBe(48);
  });

  test("calculates comprehensive metrics", () => {
    const analysis = {
      correctCharacters: 240,
      incorrectCharacters: 10,
      errors: new Array(5),
      accuracy: 96,
    };
    const startTime = Date.now() - 60000; // 1 minute ago
    const endTime = Date.now();

    const metrics = calculator.calculateMetrics(analysis, startTime, endTime);

    expect(metrics).toEqual({
      wpm: 50,
      accuracy: 96,
      duration: 1,
      errorRate: 5,
    });
  });
});
