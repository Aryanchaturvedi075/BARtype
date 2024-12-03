import { test, expect } from "@playwright/test";
import { StateManager } from "./StateManager.js";

test.describe("StateManager", () => {
  let stateManager;

  test.beforeEach(() => {
    stateManager = new StateManager();
  });

  test("creates a new session with unique ID", () => {
    const session = stateManager.createSession();
    expect(session.id).toBeDefined();
    expect(session.status).toBe("initialized");
  });

  test("updates existing session", () => {
    const session = stateManager.createSession();
    const updated = stateManager.updateSession(session.id, {
      status: "active",
      startTime: Date.now(),
    });
    expect(updated.status).toBe("active");
    expect(updated.startTime).toBeDefined();
  });

  test("throws error when updating non-existent session", () => {
    expect(() => stateManager.updateSession("invalid-id", {})).toThrow(
      "Session not found",
    );
  });
});
