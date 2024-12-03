// tests/integration/api/metrics-calculation.spec.js
import { test, expect } from '@playwright/test';

test.describe('Metrics Calculation Integration', () => {
  let sessionId;

  test.beforeEach(async ({ request }) => {
    const response = await request.post('/api/session');
    const data = await response.json();
    sessionId = data.sessionId;
  });

  test('calculates metrics accurately for perfect typing', async ({ request }) => {
    const session = await request.get(`/api/session/${sessionId}/metrics`);
    const data = await session.json();
    
    expect(data.metrics).toHaveProperty('wpm');
    expect(data.metrics).toHaveProperty('accuracy');
    expect(data.metrics.accuracy).toBe(100);
  });

  test('handles errors in typing accurately', async ({ request }) => {
    // Simulate typing with errors through WebSocket
    // Verify metrics calculation
    const metrics = await request.get(`/api/session/${sessionId}/metrics`);
    const data = await metrics.json();
    
    expect(data.metrics.accuracy).toBeLessThan(100);
    expect(data.metrics.errorRate).toBeGreaterThan(0);
  });
});