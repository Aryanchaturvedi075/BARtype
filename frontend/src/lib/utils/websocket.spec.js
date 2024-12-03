// src/lib/utils/websocket.spec.js
import { test, expect } from "@playwright/test";
import { WebSocketClient } from "./websocket";

test.describe("WebSocketClient", () => {
  let wsClient;
  const mockServerUrl = "ws://localhost:3001";

  test.beforeEach(() => {
    wsClient = new WebSocketClient(mockServerUrl);
  });

  test("initializes with correct configuration", () => {
    expect(wsClient.baseUrl).toBe(mockServerUrl);
    expect(wsClient.socket).toBeNull();
    expect(wsClient.reconnectAttempts).toBe(0);
  });

  test("handles message subscription and unsubscription", () => {
    const handler = () => {};
    const unsubscribe = wsClient.on("TEST_EVENT", handler);

    expect(
      wsClient.messageHandlers.get("TEST_EVENT").has(handler),
    ).toBeTruthy();

    unsubscribe();
    expect(wsClient.messageHandlers.get("TEST_EVENT").has(handler)).toBeFalsy();
  });

  test("limits reconnection attempts", async () => {
    wsClient.maxReconnectAttempts = 2;
    let reconnectCount = 0;

    // Mock connection failure
    wsClient.connect = () => {
      reconnectCount++;
      return Promise.reject(new Error("Connection failed"));
    };

    await expect(wsClient.handleDisconnect({})).rejects.toThrow();
    expect(reconnectCount).toBeLessThanOrEqual(2);
  });
});
