// backend/src/config/environment.js
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  WS_PORT: z.string().transform(Number).default('3002'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  MAX_WORD_COUNT: z.string().transform(Number).default('200'),
  MIN_WORD_COUNT: z.string().transform(Number).default('10'),
  DEFAULT_WORD_COUNT: z.string().transform(Number).default('50')
});

function validateEnvironment() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Environment validation failed:', error.errors);
    process.exit(1);
  }
}

export const CONFIG = validateEnvironment();

export const isDevelopment = CONFIG.NODE_ENV === 'development';
export const isProduction = CONFIG.NODE_ENV === 'production';
export const isTest = CONFIG.NODE_ENV === 'test';