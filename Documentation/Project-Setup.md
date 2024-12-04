# BARtype: Complete Implementation Guide

## Initial Project Setup

### Project Initialization

First, create the project structure and initialize the repository:

```bash
# Create project directory
mkdir bartype
cd bartype

# Initialize git repository
git init

# Create necessary directories
mkdir -p backend/src/{config,core/{session,typing},middleware,routes,websocket/handlers}
mkdir -p frontend/src/{lib/{components/typing,utils},routes}
mkdir -p tests/{integration/{api,websocket,typing-session},e2e/{fixtures,setup,scenarios/{typing-experience,responsiveness}}}

# Initialize the root package.json
npm init -y

# Install testing framework
npm install ws
npm install -D @playwright/test@latest
npm install -D @playwright/experimental-ct-svelte@latest
npx playwright install

# Install development utilities
npm install -D prettier@latest concurrently@latest
npm install -D eslint@latest eslint-config-prettier@latest eslint-plugin-svelte@latest
npm update

# Create environment files
touch .env.development .env.test .env.production
```

### Root-level package.json:

```json
{
  "name": "bartype",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "format": "prettier --write .",
    "lint": "prettier --check . && eslint .",
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "dev": "npm run dev:backend & npm run dev:frontend",
    "build": "npm run build:backend && npm run build:frontend",

    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",

    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",

    "test:unit": "playwright test --config=playwright.config.js --project=unit",
    "test:integration": "playwright test --config=playwright.config.js --project=integration",
    "test:e2e": "playwright test --config=playwright.config.js --project=e2e"
  },
  "keywords": [],
  "author": "Basel A., Aryan C., Rafi L.",
  "license": "ISC",
  "devDependencies": {
    "@playwright/experimental-ct-svelte": "^1.49.0",
    "@playwright/test": "^1.49.0",
    "eslint": "^9.16.0",
    "prettier": "^3.4.1"
  }
}
```

### Backend Setup

Initialize the backend Node.js application:

```bash
cd backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install fastify@latest
npm install @fastify/cors@latest
npm install @fastify/websocket@latest
npm install fast-diff@latest
npm install nanoid@latest
npm install zod@latest

# Install development dependencies
npm install -D nodemon@latest

# Update all packages
npm update
```

Update `backend/package.json` with type module support and scripts:

```json
{
  "name": "bartype-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "npm ci"
  },
  "author": "Basel A., Aryan C., Rafi L.",
  "license": "ISC",
  "description": "Backend node components built using the fastify web framework",
  "dependencies": {
    "@fastify/cors": "^10.0.1",
    "@fastify/websocket": "^11.0.1",
    "fast-diff": "^1.3.0",
    "fastify": "^5.1.0",
    "nanoid": "^5.0.9",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

### Frontend Setup

Initialize the SvelteKit application with SSR support:

```bash
cd ../frontend

# Create SvelteKit project
npx sv create .

# Install dependencies
npm install @sveltejs/adapter-node@latest
npm install zod@latest
npm install nanoid@latest
npm install flowbite-svelte@latest
npm install flowbite@latest
npm install particle.js@latest

# Install development dependencies
npm install -D @sveltejs/kit@latest
npm install -D tailwindcss@latest
npm install -D postcss@latest
npm install -D autoprefixer@latest
npm install -D sass@latest

# Update all packages
npm update
```

Update `frontend/package.json` with type module support and scripts:

```json
{
  "name": "bartype-frontend",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  },
  "author": "Basel A., Aryan C., Rafi L.",
  "description": "Frontend SvelteKit components built using the Vite Meta Framework, Tailwind CSS, SASS, and Flowbite-svelte",
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.9.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "sass": "^1.81.0",
    "svelte": "^5.0.0",
    "tailwindcss": "^3.4.15",
    "vite": "^6.0.0"
  },
  "dependencies": {
    "@sveltejs/adapter-node": "^5.2.9",
    "flowbite": "^2.5.2",
    "flowbite-svelte": "^0.47.4",
    "nanoid": "^5.0.9",
    "zod": "^3.23.8"
  }
}
```

Create essential configuration files:

```javascript
// frontend/svelte.config.js
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter(),
    inlineStyleThreshold: 5000
  }
};

// frontend/vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3000
  }
});
```

<!-- ### Docker Configuration

Create Docker configuration files for development and production:

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start"]

# frontend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", build && node build"]
```

Create docker-compose configuration:

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
      - "3002:3002"
    environment:
      - NODE_ENV=development
      - WS_PORT=3002
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - BACKEND_URL=http://backend:3001
      - WS_URL=ws://backend:3002
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
``` -->
