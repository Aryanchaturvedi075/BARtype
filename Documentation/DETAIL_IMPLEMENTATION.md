# BARtype: Complete Implementation Guide (Revised)

## Table of Contents
1. [Project Setup](#project-setup)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Docker Configuration](#docker-configuration)
5. [Integration and Testing](#integration-and-testing)

## Project Setup

### Initialize Project Structure
```bash
# Create project directory
mkdir bartype
cd bartype

# Initialize git repository
git init

# Create backend directory
mkdir backend
```

### Backend Setup
```bash
cd backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express@4.18.3 cors@2.8.5 helmet@7.1.0 zod@3.22.4 nanoid@5.0.6 fast-diff@1.3.0

# Install development dependencies
npm install -D nodemon@3.1.0

# Create source directories
mkdir -p src/{config,services,middleware,routes,utils}
touch src/index.js
```

### Frontend Setup
```bash
# Create new SvelteKit project
npx sv create frontend

# Select the following options:
# - Skeleton project
# - No TypeScript
# - ESLint
# - Prettier
# - Vitest for unit testing
# - Playwright for browser testing

cd frontend

# Install dependencies
npm install

# Install UI and utility libraries
npm install zod@3.22.4 nanoid@5.0.6 fast-diff@1.3.0

# Install Flowbite and TailwindCSS dependencies
npm install flowbite-svelte@1.0.7
npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.19 sass@1.72.0

# Initialize Tailwind CSS
npx tailwindcss init -p
```

### Frontend Project Structure
```
frontend/
├── src/
│   ├── app.html
│   ├── app.scss               # Global SCSS styles
│   ├── routes/
│   │   └── +page.svelte      # Main typing test page
│   │   └── +layout.svelte    # Root layout
│   └── lib/
│       ├── components/       # Reusable components
│       │   ├── typing/
│       │   │   ├── TextDisplay.svelte
│       │   │   ├── TextInput.svelte
│       │   │   └── Stats.svelte
│       │   └── common/
│       │       ├── Button.svelte
│       │       └── Modal.svelte
│       ├── stores/          # State management
│       │   └── typing.js
│       ├── services/        # API and business logic
│       │   └── typingTest.js
│       └── utils/           # Utility functions
│           ├── text.js
│           └── performance.js
```

### Configure TailwindCSS
Create `frontend/tailwind.config.js`:
```javascript
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
};
```

Create `frontend/src/app.scss`:
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

// Custom global styles
@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

// Custom utility classes
@layer utilities {
  .typing-text {
    @apply font-mono text-lg leading-relaxed;
  }
}
```

### Backend Implementation

The backend implementation remains largely the same as before, but let's update the export/import syntax to match the current Node.js standards:

Create `backend/src/index.js`:
```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import { typingRoutes } from './routes/typing.js';
import { CONFIG } from './config/environment.js';

const app = express();

app.use(cors({
  origin: CONFIG.CORS_ORIGIN
}));
app.use(helmet());
app.use(express.json());

app.use('/api', typingRoutes);
app.use(errorHandler);

app.listen(CONFIG.PORT, () => {
  console.log(`Server running on port ${CONFIG.PORT}`);
});
```

Update `backend/package.json`:
```json
{
  "name": "bartype-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```
The next section will cover:

1. Detailed Svelte component implementations
2. Store configurations
3. Service layer implementations
4. Backend route handlers and middleware
5. Error handling specifics