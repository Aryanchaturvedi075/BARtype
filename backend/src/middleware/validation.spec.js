import { test, expect } from '@playwright/test';
import { createValidationMiddleware, sessionRequestSchema, updateSessionSchema } from './validation.js';
import { ZodError } from 'zod';

test.describe('Validation Middleware', () => {
  test('validates correct session request data', async () => {
    const middleware = createValidationMiddleware(sessionRequestSchema);
    const request = {
      body: { wordCount: 50 },
      query: {},
      params: {}
    };

    await middleware(request, {});
    expect(request.validated.body.wordCount).toBe(50);
  });

  test('applies default word count when not provided', async () => {
    const middleware = createValidationMiddleware(sessionRequestSchema);
    const request = {
      body: {},
      query: {},
      params: {}
    };

    await middleware(request, {});
    expect(request.validated.body.wordCount).toBe(50);
  });

  test('rejects invalid word count', async () => {
    const middleware = createValidationMiddleware(sessionRequestSchema);
    const request = {
      body: { wordCount: 1000 },
      query: {},
      params: {}
    };

    await expect(middleware(request, {})).rejects.toThrow(ZodError);
  });

  test('validates correct session update data', async () => {
    const middleware = createValidationMiddleware(updateSessionSchema);
    const request = {
      body: { input: 'test input' },
      params: { sessionId: '123' },
      query: {}
    };

    await middleware(request, {});
    expect(request.validated.body.input).toBe('test input');
  });

  test('rejects invalid session update data', async () => {
    const middleware = createValidationMiddleware(updateSessionSchema);
    const request = {
      body: { input: 123 },
      params: { sessionId: '123' },
      query: {}
    };

    await expect(middleware(request, {})).rejects.toThrow(ZodError);
  });
});