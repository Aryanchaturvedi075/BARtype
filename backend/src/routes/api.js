// backend/src/routes/api.js
import { FastifyPlugin } from 'fastify';
import { z } from 'zod';
import { CONFIG } from '../config/environment.js';
import { AppError } from '../middleware/errorHandler.js';

const sessionRequestSchema = z.object({
  wordCount: z.number()
    .int()
    .min(CONFIG.MIN_WORD_COUNT)
    .max(CONFIG.MAX_WORD_COUNT)
    .default(CONFIG.DEFAULT_WORD_COUNT)
});

export const apiRoutes = async (fastify) => {
  // Create new typing session
  fastify.post('/api/session', {
    schema: {
      body: sessionRequestSchema
    },
    handler: async (request, reply) => {                            // TODO: verify if reply is needed
      const { wordCount } = request.body;
      const stateManager = fastify.stateManager;
      const textGenerator = fastify.textGenerator;

      try {
        const text = await textGenerator.generateText(wordCount);
        const session = stateManager.createSession();
        
        session.text = text;
        stateManager.updateSession(session.id, { text });

        return {
          sessionId: session.id,
          text: session.text,
          wordCount
        };
      } catch (error) {
        throw new AppError('Failed to create session', 500);
      }
    }
  });

  // Get session metrics
  fastify.get('/api/session/:sessionId/metrics', {
    schema: {
      params: z.object({
        sessionId: z.string()
      })
    },
    handler: async (request, reply) => {
      const { sessionId } = request.params;
      const stateManager = fastify.stateManager;

      try {
        const session = stateManager.getSession(sessionId);
        if (!session) {
          throw new AppError('Session not found', 404);
        }

        return {
          sessionId,
          metrics: session.metrics
        };
      } catch (error) {
        if (error instanceof AppError) { throw error; }
        throw new AppError('Failed to retrieve metrics', 500);
      }
    }
  });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return { status: 'healthy' };
  });
};