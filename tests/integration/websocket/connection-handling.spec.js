// tests/integration/websocket/connection-handling.spec.js
import { test, expect } from "@playwright/test";
import WebSocket from "ws";

test.describe("WebSocket Connection Handling", () => {
  test("establishes connection with valid session", async ({ request }) => {
    // Create session first
    const response = await request.post("/api/session");
    const { sessionId } = await response.json();

    const ws = new WebSocket(`ws://localhost:3002/ws?sessionId=${sessionId}`);

    await new Promise((resolve) => {
      ws.on("open", () => {
        expect(ws.readyState).toBe(WebSocket.OPEN);
        resolve();
      });
    });
  });

  test("rejects connection without session ID", async () => {
    const ws = new WebSocket("ws://localhost:3002/ws");

    await new Promise((resolve) => {
      ws.on("error", (error) => {
        expect(error).toBeTruthy();
        resolve();
      });
    });
  });
});
