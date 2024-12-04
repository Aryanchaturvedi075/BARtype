// backend/src/routes/api.js
import { z } from "zod";
import { CONFIG } from "../config/environment.js";
import { AppError } from "../middleware/errorHandler.js";
import { createValidationMiddleware } from "../middleware/validation.js";

export const sessionRequestSchema = z.object({
  wordCount: z
    .number()
    .int()
    .min(CONFIG.MIN_WORD_COUNT)
    .max(CONFIG.MAX_WORD_COUNT)
    .default(CONFIG.DEFAULT_WORD_COUNT),
});

export const metricsRequestSchema = z.object({
  params: z.object({
      sessionId: z.string()
  })
});

// Convert Zod schema to JSON Schema for Fastify
const zodToJsonSchema = (zodSchema) => {
  return {
      body: {
          type: 'object',
          required: Object.keys(zodSchema.shape),
          properties: {
              wordCount: {
                  type: 'number',
                  minimum: CONFIG.MIN_WORD_COUNT,
                  maximum: CONFIG.MAX_WORD_COUNT
              }
          }
      }
  };
};

const zodParamsToJsonSchema = (zodSchema) => {
  // Extract the params schema shape from our Zod schema
  const paramsShape = zodSchema.shape.params.shape;
  
  return {
      params: {
          type: 'object',
          required: Object.keys(paramsShape),
          properties: Object.entries(paramsShape).reduce((acc, [key, value]) => {
              // Map Zod types to JSON Schema types
              acc[key] = {
                  type: value instanceof z.ZodString ? 'string' :
                        value instanceof z.ZodNumber ? 'number' :
                        'string' // Default fallback
              };
              return acc;
          }, {})
      }
  };
};

export const apiRoutes = async (fastify) => {
  // Create new typing session
  fastify.post("/api/session", {
    schema: zodToJsonSchema(sessionRequestSchema),
    preValidation: createValidationMiddleware(sessionRequestSchema),
    handler: async (request, reply) => {
      const { wordCount } = request.body;
      const { stateManager, textGenerator } = fastify;
  
      try {
          const text = await textGenerator.generateText(wordCount);
          const session = stateManager.createSession();
  
          session.text = text;
          stateManager.updateSession(session.id, { text });
  
          reply.code(201); // Set appropriate status code
          return {
              sessionId: session.id,
              text: session.text,
              wordCount,
          };
      } catch (error) {
          console.error('Session creation error:', error);
          throw new AppError("Failed to create session", 500);
      }
    }
  });

  // Get session metrics
  fastify.get("/api/session/:sessionId/metrics", {
    schema: zodParamsToJsonSchema(metricsRequestSchema),
    preValidation: createValidationMiddleware(metricsRequestSchema),
    handler: async (request, reply) => {
      const { sessionId } = request.params;
      const { stateManager } = fastify.stateManager;

      try {
        const session = stateManager.getSession(sessionId);
        if (!session) {
          throw new AppError("Session not found", 404);
        }

        reply.code(201); // Set appropriate status code
        return {
          sessionId,
          metrics: session.metrics,
        };
      } catch (error) {
        if (error instanceof AppError) { throw error; }
        console.error('Session creation error:', error);
        throw new AppError("Failed to retrieve metrics", 500);
      }
    },
  });

  // Health check endpoint
  fastify.get("/health", async (request, reply) => {
    const healthStatus = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    };
    reply.code(200).send(healthStatus);
  });
};
