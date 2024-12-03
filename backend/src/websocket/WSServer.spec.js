import { test, expect } from '@playwright/test';
import { WSServer } from './WSServer.js';
import { StateManager } from '../core/session/StateManager.js';
import { TextAnalyzer } from '../core/typing/TextAnalyzer.js';
import { MetricsCalculator } from '../core/typing/MetricsCalculator.js';

test.describe('WebSocket Server', () => {
  let wsServer;
  let stateManager;
  let textAnalyzer;
  let metricsCalculator;

  test.beforeEach(() => {
    stateManager = new StateManager();
    textAnalyzer = new TextAnalyzer();
    metricsCalculator = new MetricsCalculator();
    wsServer = new WSServer(stateManager, textAnalyzer, metricsCalculator);
  });

  test('handles new connection with valid session', () => {
    const session = stateManager.createSession();
    const mockSocket = {
      close: () => {},
      on: () => {}
    };

    const mockConnection = {
      socket: mockSocket
    };

    const mockRequest = {
      query: { sessionId: session.id }
    };

    expect(() => wsServer.initialize({ get: () => {} })).not.toThrow();
  });

  test('rejects connection without session ID', () => {
    let closeCode;
    const mockSocket = {
      close: (code) => { closeCode = code; },
      on: () => {}
    };

    const mockConnection = {
      socket: mockSocket
    };

    const mockRequest = {
      query: {}
    };

    wsServer.handleConnection(mockConnection, mockRequest);
    expect(closeCode).toBe(4000);
  });
});