// backend/src/index.js                         --> Main entry point for the backend server
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { TextService } from './core/typing/TextService.js';
import { MetricsService } from './core/metrics/MetricsService.js';
import { TypingWebSocketServer } from './websocket/WSServer.js';
import { createTypingRoutes } from './routes/typing.js';
import { errorHandler } from './middleware/errorHandler.js';
import { EventEmitter } from 'events';

const app = express();
const server = createServer(app);
const eventEmitter = new EventEmitter();

// Initialize services
const textService = new TextService(eventEmitter);
const metricsService = new MetricsService();
const wsServer = new TypingWebSocketServer(server, textService, metricsService);

// Configure middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Configure routes
app.use('/api', createTypingRoutes(textService, metricsService));

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

server.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
    console.log(`WebSocket Server running on port ${WS_PORT}`);
});