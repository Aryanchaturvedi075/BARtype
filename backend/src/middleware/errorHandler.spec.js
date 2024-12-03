import { test, expect } from '@playwright/test';
import { AppError, errorHandler } from './errorHandler.js';
import { ZodError, z } from 'zod';                              // TODO: verify if this was intended to be used

test.describe('Error Handler Middleware', () => {
  const mockReply = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    send: function(response) {
      this.response = response;
      return this;
    }
  };

  test('handles AppError correctly', () => {
    const error = new AppError('Custom error message', 400, 'CUSTOM_ERROR');
    errorHandler(error, {}, mockReply);

    expect(mockReply.statusCode).toBe(400);
    expect(mockReply.response).toMatchObject({
      statusCode: 400,
      errorCode: 'CUSTOM_ERROR',
      message: 'Custom error message'
    });
  });

  test('handles ZodError correctly', () => {
    const schema = z.object({ name: z.string() });
    let zodError;
    try {
      schema.parse({ name: 123 });
    } catch (error) {
      zodError = error;
    }

    errorHandler(zodError, {}, mockReply);

    expect(mockReply.statusCode).toBe(400);
    expect(mockReply.response).toMatchObject({
      statusCode: 400,
      errorCode: 'VALIDATION_ERROR',
      message: 'Invalid request data'
    });
    expect(mockReply.response.details).toBeDefined();
  });

  test('handles unexpected errors correctly', () => {
    const error = new Error('Unexpected error');
    errorHandler(error, {}, mockReply);

    expect(mockReply.statusCode).toBe(500);
    expect(mockReply.response).toMatchObject({
      statusCode: 500,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    });
  });
});