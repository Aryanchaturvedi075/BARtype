// backend/src/middleware/validation.js
import { z } from "zod";

export const createValidationMiddleware = (schema) => {
  return async (request, reply) => {
    try {
      const validationTarget = {
        body: request.body,
        query: request.query,
        params: request.params,
      };

      const validated = await schema.parseAsync(validationTarget);
      request.validated = validated;

      // Add validation metadata to response headers
      reply.header("X-Validation-Status", "success");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Enhanced error response using reply
        reply.header("X-Validation-Status", "error");
        reply.header(
          "X-Validation-Error-Count",
          error.errors.length.toString(),
        );
        throw error;
      }
      throw new Error("Validation middleware error");
    }
  };
};

// Common validation schemas
export const sessionRequestSchema = z.object({
  body: z
    .object({
      wordCount: z.number().int().min(10).max(200).optional().default(50),
    })
    .strict(),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const updateSessionSchema = z.object({
  body: z
    .object({
      input: z.string(),
    })
    .strict(),
  params: z
    .object({
      sessionId: z.string(),
    })
    .strict(),
  query: z.object({}).strict(),
});
