export class WebSocketErrorHandler {
    constructor(stateManager) {
      this.stateManager = stateManager;
    }
  
    handleConnectionError(sessionId, wsServer, error) {
      console.error(`WebSocket error in session ${sessionId}:`, error);
  
      const session = this.stateManager.getSession(sessionId);
      if (session) {
        this.stateManager.updateSession(sessionId, {
          status: 'error',
          lastError: error.message
        });
      }
  
      wsServer.sendError(sessionId, {
        message: 'Connection error occurred',
        code: 'CONNECTION_ERROR'
      });
    }
  
    handleSessionError(sessionId, wsServer, error) {
      console.error(`Session error ${sessionId}:`, error);
  
      const session = this.stateManager.getSession(sessionId);
      if (session) {
        this.stateManager.updateSession(sessionId, {
          status: 'error',
          lastError: error.message
        });
      }
  
      wsServer.sendError(sessionId, {
        message: 'Session error occurred',
        code: 'SESSION_ERROR'
      });
    }
  }