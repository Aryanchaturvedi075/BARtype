// backend/src/core/typing/TextService.js                   --> The Text Processing Service
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

    #processTextDiffs(diffs) {                          // private class method
        return diffs.map(([type, value]) => ({
            type,
            value,
            timestamp: Date.now()
        }));
    }
}