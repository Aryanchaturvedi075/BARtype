// tests/integration/api/text-generation.spec.js
import { test, expect } from '@playwright/test';

test.describe('Text Generation API Integration', () => {
  test('generates text with default word count', async ({ request }) => {
    const response = await request.post('/api/session');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('sessionId');
    expect(data).toHaveProperty('text');
    expect(data.text.split(' ').length).toBe(50);
  });

  test('respects custom word count', async ({ request }) => {
    const wordCount = 75;
    const response = await request.post('/api/session', {
      data: { wordCount }
    });
    
    const data = await response.json();
    expect(data.text.split(' ').length).toBe(wordCount);
  });

  test('validates word count constraints', async ({ request }) => {
    const response = await request.post('/api/session', {
      data: { wordCount: 1000 }
    });
    
    expect(response.status()).toBe(400);
    const error = await response.json();
    expect(error).toHaveProperty('type', 'VALIDATION_ERROR');
  });
});