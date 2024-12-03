import { AppError } from '../middleware/errorHandler.js';

export class WSServer {
  constructor(stateManager, textAnalyzer, metricsCalculator) {
    this.stateManager = stateManager;
    this.textAnalyzer = textAnalyzer;
    this.metricsCalculator = metricsCalculator;
    this.connections = new Map();
  }

  initialize(fastify) {
    fastify.get('/ws', { websocket: true }, (connection, request) => {
      const sessionId = request.query.sessionId;
      
      if (!sessionId) {
        connection.socket.close(4000, 'Session ID is required');
        return;
      }

      try {
        const session = this.stateManager.getSession(sessionId);            // TODO: Verify if this was meant to be used
        this.connections.set(sessionId, connection.socket);
        
        connection.socket.on('message', (message) => {
          this.handleMessage(sessionId, message);
        });

        connection.socket.on('close', () => {
          this.connections.delete(sessionId);
        });

      } catch (error) {
        connection.socket.close(4001, 'Invalid session');
      }
    });
  }

  handleMessage(sessionId, rawMessage) {
    try {
      const message = JSON.parse(rawMessage);
      const session = this.stateManager.getSession(sessionId);

      switch (message.type) {
        case 'INPUT_UPDATE':
          this.handleInputUpdate(session, message.data);
          break;
        case 'START_SESSION':
          this.handleSessionStart(session);
          break;
        case 'END_SESSION':
          this.handleSessionEnd(session);
          break;
        default:
          throw new AppError('Invalid message type', 400);
      }
    } catch (error) {
      this.sendError(sessionId, error);
    }
  }

  sendMessage(sessionId, type, data) {
    const connection = this.connections.get(sessionId);
    if (connection && connection.readyState === 1) {
      connection.send(JSON.stringify({ type, data }));
    }
  }

  sendError(sessionId, error) {
    this.sendMessage(sessionId, 'ERROR', {
      message: error.message,
      code: error.statusCode || 500
    });
  }
}