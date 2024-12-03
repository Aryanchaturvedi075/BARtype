// backend/src/websocket/handlers/typingHandler.spec.js
import { test, expect } from "@playwright/test";
import { TypingHandler } from "./typingHandler.js";
import { StateManager } from "../../core/session/StateManager.js";
import { TextAnalyzer } from "../../core/typing/TextAnalyzer.js";
import { MetricsCalculator } from "../../core/typing/MetricsCalculator.js";

test.describe("Typing Handler", () => {
  let typingHandler;
  let stateManager;
  let textAnalyzer;
  let metricsCalculator;
  let mockWsServer;

  test.beforeEach(() => {
    stateManager = new StateManager();
    textAnalyzer = new TextAnalyzer();
    metricsCalculator = new MetricsCalculator();
    mockWsServer = {
      sendMessage: test.fn(),
    };
    typingHandler = new TypingHandler(
      stateManager,
      textAnalyzer,
      metricsCalculator,
    );
  });

  test("processes input updates correctly", async () => {
    const session = stateManager.createSession();
    session.text = "test text";
    session.startTime = Date.now();
    stateManager.updateSession(session.id, session);

    await typingHandler.handleInputUpdate(session, mockWsServer, {
      input: "test",
    });

    expect(mockWsServer.sendMessage).toHaveBeenCalledWith(
      session.id,
      "METRICS_UPDATE",
      expect.objectContaining({
        analysis: expect.any(Object),
        metrics: expect.any(Object),
      }),
    );
  });

  test("handles session completion", async () => {
    const session = stateManager.createSession();
    session.text = "test";
    session.startTime = Date.now() - 1000; // Started 1 second ago
    stateManager.updateSession(session.id, session);

    await typingHandler.handleInputUpdate(session, mockWsServer, {
      input: "test",
    });

    expect(mockWsServer.sendMessage).toHaveBeenCalledWith(
      session.id,
      "SESSION_COMPLETE",
      expect.objectContaining({
        sessionId: session.id,
        metrics: expect.any(Object),
      }),
    );

    const updatedSession = stateManager.getSession(session.id);
    expect(updatedSession.status).toBe("completed");
  });
});
