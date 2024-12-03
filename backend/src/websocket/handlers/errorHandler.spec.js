// backend/src/websocket/handlers/errorHandler.spec.js
import { test, expect } from "@playwright/test";
import { WebSocketErrorHandler } from "./errorHandler.js";
import { StateManager } from "../../core/session/StateManager.js";

test.describe("WebSocket Error Handler", () => {
  let errorHandler;
  let stateManager;
  let mockWsServer;

  test.beforeEach(() => {
    stateManager = new StateManager();
    mockWsServer = {
      sendError: test.fn(),
    };
    errorHandler = new WebSocketErrorHandler(stateManager);
  });

  test("handles connection errors appropriately", async () => {
    const session = stateManager.createSession();
    const testError = new Error("Connection lost");

    await errorHandler.handleConnectionError(
      session.id,
      mockWsServer,
      testError,
    );

    const updatedSession = stateManager.getSession(session.id);
    expect(updatedSession.status).toBe("error");
    expect(updatedSession.lastError).toBe("Connection lost");
    expect(mockWsServer.sendError).toHaveBeenCalledWith(
      session.id,
      expect.objectContaining({
        message: "Connection error occurred",
        code: "CONNECTION_ERROR",
      }),
    );
  });

  test("handles session errors appropriately", async () => {
    const session = stateManager.createSession();
    const testError = new Error("Invalid session state");

    await errorHandler.handleSessionError(session.id, mockWsServer, testError);

    const updatedSession = stateManager.getSession(session.id);
    expect(updatedSession.status).toBe("error");
    expect(updatedSession.lastError).toBe("Invalid session state");
    expect(mockWsServer.sendError).toHaveBeenCalledWith(
      session.id,
      expect.objectContaining({
        message: "Session error occurred",
        code: "SESSION_ERROR",
      }),
    );
  });
});
