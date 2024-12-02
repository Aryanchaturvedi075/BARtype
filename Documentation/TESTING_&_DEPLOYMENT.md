# Testing and Deployment Guide

## Testing Strategy

Our testing approach follows a comprehensive strategy that covers unit testing, integration testing, and end-to-end testing for both frontend and backend components. We will implement testing in phases to ensure complete coverage while maintaining code quality.

### Backend Testing Implementation

First, let's configure Jest for backend testing:

```javascript
// backend/jest.config.js
export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/tests/**/*.js',
    ],
};
```

Create the test setup file:

```javascript
// backend/src/tests/setup.js
import { TextService } from '../core/typing/TextService';
import { MetricsService } from '../core/metrics/MetricsService';
import { EventEmitter } from 'events';

global.TextService = TextService;
global.MetricsService = MetricsService;
global.EventEmitter = EventEmitter;
```

Implement unit tests for core services:

```javascript
// backend/src/tests/unit/TextService.test.js
describe('TextService', () => {
    let textService;
    let eventEmitter;

    beforeEach(() => {
        eventEmitter = new EventEmitter();
        textService = new TextService(eventEmitter);
    });

    test('generates session with valid parameters', () => {
        const session = textService.generateSession({ wordCount: 50 });
        expect(session).toHaveProperty('id');
        expect(session).toHaveProperty('text');
        expect(session.text.split(' ').length).toBe(50);
    });

    test('analyzes input correctly', () => {
        const session = textService.generateSession({ wordCount: 10 });
        const analysis = textService.analyzeInput(session.id, 'test input');
        expect(analysis).toHaveProperty('type');
        expect(analysis).toHaveProperty('timestamp');
    });
});
```

### Frontend Testing Implementation

Configure Vitest for frontend testing:

```javascript
// frontend/vitest.config.js
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte({ hot: !process.env.VITEST })],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/tests/setup.js'],
        deps: {
            inline: [/^svelte/]
        }
    },
});
```
Create the Test Setup File
```
// frontend/src/tests/setup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// Mock Browser APIs that aren't available in the test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));
```


Implement component testing:

```javascript
// frontend/src/tests/components/TextDisplay.test.js
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TextDisplay from '../../lib/components/typing/TextDisplay.svelte';

describe('TextDisplay', () => {
    it('renders text correctly', () => {
        const text = 'Hello World';
        render(TextDisplay, { props: { text } });
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('highlights correct characters', () => {
        const text = 'Test';
        const input = 'Te';
        render(TextDisplay, { props: { text, input } });
        
        const characters = screen.getAllByRole('presentation');
        expect(characters[0]).toHaveClass('correct');
        expect(characters[1]).toHaveClass('correct');
        expect(characters[2]).toHaveClass('pending');
    });
});
```

## Deployment Configuration

### Docker Optimization

Create optimized production Dockerfiles:

```dockerfile
# backend/Dockerfile.prod
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

```dockerfile
# frontend/Dockerfile.prod
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "build/index.js"]
```

Create a production-ready docker-compose configuration:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - PORT=3001
      - WS_PORT=3002
    ports:
      - "3001:3001"
      - "3002:3002"
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - PUBLIC_BACKEND_URL=http://backend:3001
      - PUBLIC_WS_URL=ws://backend:3002
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_healthy
```

### Deployment Scripts

Create deployment utilities:

```bash
#!/bin/bash
# scripts/deploy.sh

# Load environment variables
set -a
source .env.prod
set +a

# Build and deploy services
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Health check
./scripts/health-check.sh

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Environment Configuration

Create production environment configuration:

```bash
# .env.prod
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
PORT=3001
WS_PORT=3002
LOG_LEVEL=info
```

## Performance Monitoring

Implement basic health and performance monitoring:

```javascript
// backend/src/middleware/performanceMonitor.js
export const performanceMonitor = (req, res, next) => {
    const start = process.hrtime();
    
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000;
        
        console.log({
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration.toFixed(2)}ms`
        });
    });
    
    next();
};
```

## Continuous Integration

Create a GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install Dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci
        
    - name: Run Tests
      run: |
        cd backend && npm test
        cd ../frontend && npm test
        
    - name: Build
      run: |
        cd backend && npm run build
        cd ../frontend && npm run build
```

## Deployment Commands

To deploy the application:

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Development deployment
docker-compose up -d

# View logs
docker-compose logs -f

# Scale services (if needed)
docker-compose up -d --scale backend=2
```

This completes our testing and deployment guide.