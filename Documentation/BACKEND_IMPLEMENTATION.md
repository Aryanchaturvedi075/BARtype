# Backend Implementation

## Core Service Layer

The backend implementation begins with the core services that handle text processing, performance metrics, and real-time communication. These services form the foundation of our typing test application.

### Text Processing Service

First, create the text processing service that handles text generation and analysis:

```javascript
// backend/src/core/typing/TextService.js
import { nanoid } from 'nanoid';
import { z } from 'zod';
import fastDiff from 'fast-diff';

const TextRequestSchema = z.object({
    wordCount: z.number().int().min(10).max(200).default(50)
});

export class TextService {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
        this.activeSessions = new Map();
    }

    generateSession(params) {
        const validated = TextRequestSchema.parse(params);
        const sessionId = nanoid();
        const text = this.generateText(validated.wordCount);
        
        const session = {
            id: sessionId,
            text,
            startTime: null,
            endTime: null,
            metrics: null
        };

        this.activeSessions.set(sessionId, session);
        return session;
    }

    analyzeInput(sessionId, input) {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const diffs = fastDiff(session.text.substring(0, input.length), input);
        const analysis = this.processTextDiffs(diffs);

        this.eventEmitter.emit('text:analyzed', {
            sessionId,
            analysis
        });

        return analysis;
    }

    private processTextDiffs(diffs) {
        return diffs.map(([type, value]) => ({
            type,
            value,
            timestamp: Date.now()
        }));
    }
}
```

### Performance Metrics Service

Create the service responsible for calculating typing performance metrics:

```javascript
// backend/src/core/metrics/MetricsService.js
export class MetricsService {
    calculateMetrics(session, input) {
        const duration = (Date.now() - session.startTime) / 1000;
        const words = input.trim().split(/\s+/).length;
        const errors = this.calculateErrors(session.text, input);

        return {
            wpm: this.calculateWPM(words, duration),
            accuracy: this.calculateAccuracy(errors, input.length),
            duration,
            errorCount: errors
        };
    }

    private calculateWPM(wordCount, duration) {
        return Math.round((wordCount / duration) * 60);
    }

    private calculateAccuracy(errors, totalLength) {
        return ((totalLength - errors) / totalLength * 100).toFixed(2);
    }
}
```

### WebSocket Server Implementation

Implement real-time communication for instant feedback:

```javascript
// backend/src/websocket/WSServer.js
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

    private async handleMessage(ws, message) {
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
```

### API Routes Implementation

Create the REST API endpoints:

```javascript
// backend/src/routes/typing.js
import { Router } from 'express';
import { z } from 'zod';

export function createTypingRoutes(textService, metricsService) {
    const router = Router();

    router.post('/sessions', async (req, res) => {
        try {
            const session = await textService.generateSession(req.body);
            res.json(session);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.get('/sessions/:sessionId/metrics', async (req, res) => {
        try {
            const metrics = await metricsService.getMetrics(req.params.sessionId);
            res.json(metrics);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });

    return router;
}
```

### Error Handling Middleware

Implement comprehensive error handling:

```javascript
// backend/src/middleware/errorHandler.js
import { z } from 'zod';

export class ApplicationError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (err, req, res, next) => {
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors
        });
    }

    if (err instanceof ApplicationError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    console.error('Unhandled Error:', err);
    return res.status(500).json({
        error: 'Internal Server Error'
    });
};
```

### Application Entry Point

Finally, tie everything together in the main application file:

```javascript
// backend/src/index.js
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
```

The next session explores the Frontend Implementation section. It will cover:

1. SSR Configuration
2. Component Architecture
3. State Management
4. WebSocket Integration
5. API Integration
6. Error Handling