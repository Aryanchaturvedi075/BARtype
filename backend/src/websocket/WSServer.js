// backend/src/websocket/WSServer.js            --> The WebSocket Server Implementation for Real-Time Communication
import { WebSocketServer } from 'ws';
import { z } from 'zod';

const MessageSchema = z.object({
    type: z.enum(['INPUT_UPDATE', 'SESSION_START', 'SESSION_END']),
    sessionId: z.string(),
    data: z.any()
});

export class TypingWebSocketServer {
    constructor(server, textService, metricsService) {
        this.wss = new WebSocketServer({ server });
        this.textService = textService;
        this.metricsService = metricsService;
        this.sessions = new Map();

        this.initialize();
    }

    initialize() {
        this.wss.on('connection', (ws) => {
            ws.on('message', async (message) => {
                try {
                    const parsed = MessageSchema.parse(JSON.parse(message));
                    await this.handleMessage(ws, parsed);
                } catch (error) {
                    this.sendError(ws, error);
                }
            });
        });
    }

    async #handleMessage(ws, message) {                     // private asynchroneous method
        switch (message.type) {
            case 'SESSION_START':
                await this.handleSessionStart(ws, message);
                break;
            case 'INPUT_UPDATE':
                await this.handleInputUpdate(ws, message);
                break;
            case 'SESSION_END':
                await this.handleSessionEnd(ws, message);
                break;
        }
    }
}