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
npm install express@latest cors@latest helmet@latest zod@latest nanoid@latest fast-diff@latest

# Install development dependencies
npm install -D nodemon@latest

npm update

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
npm install zod@latest nanoid@latest fast-diff@latest

# Install Flowbite and TailwindCSS dependencies
npm install flowbite-svelte@latest
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest sass@latest

# Initialize Tailwind CSS
npx tailwindcss init -p

npm update
```

<!-- ### Frontend Project Structure
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
``` -->

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



<!--  Being Restructured -->

# BARtype: Detailed Component Implementation Guide

## Frontend Implementation

### 1. Root Layout Configuration
Create `src/routes/+layout.svelte`:
```svelte
<script>
  import '../app.scss';
  import { Navbar } from 'flowbite-svelte';
</script>

<Navbar>
  <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
    BARtype
  </span>
</Navbar>

<main class="container mx-auto px-4 py-8">
  <slot />
</main>
```

### 2. Store Implementation
Create `src/lib/stores/typing.js`:
```javascript
import { writable, derived } from 'svelte/store';
import { nanoid } from 'nanoid';
import fastDiff from 'fast-diff';

function createTypingStore() {
  const initialState = {
    sessionId: '',
    text: '',
    input: '',
    status: 'idle', // idle, ready, active, finished
    startTime: null,
    endTime: null,
    errors: [],
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    
    initializeTest: (text) => update(state => ({
      ...initialState,
      sessionId: nanoid(),
      text,
      status: 'ready'
    })),

    startTest: () => update(state => ({
      ...state,
      status: 'active',
      startTime: Date.now()
    })),

    updateInput: (input) => update(state => {
      const diffs = fastDiff(state.text.substring(0, input.length), input);
      const errors = diffs.filter(([type]) => type !== 0);
      
      return {
        ...state,
        input,
        errors,
        ...(input.length === state.text.length ? {
          status: 'finished',
          endTime: Date.now()
        } : {})
      };
    }),

    reset: () => set(initialState)
  };
}

export const typingStore = createTypingStore();

// Derived stores for statistics
export const typingStats = derived(typingStore, ($typing) => {
  if ($typing.status !== 'finished') return null;

  const duration = ($typing.endTime - $typing.startTime) / 1000;
  const words = $typing.text.split(' ').length;
  const wpm = Math.round((words / duration) * 60);
  const accuracy = 100 - (($typing.errors.length / $typing.text.length) * 100);

  return {
    wpm,
    accuracy: accuracy.toFixed(2),
    duration: duration.toFixed(2),
    errors: $typing.errors.length
  };
});
```

### 3. Service Layer
Create `src/lib/services/typingTest.js`:
```javascript
const API_BASE = 'http://localhost:3001/api';

export class TypingTestService {
  static async fetchText(wordCount = 50) {
    try {
      const response = await fetch(`${API_BASE}/text?wordCount=${wordCount}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch text');
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Text fetch error:', error);
      throw new Error('Failed to load typing test');
    }
  }

  static async submitResults(results) {
    try {
      const response = await fetch(`${API_BASE}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      });

      if (!response.ok) {
        throw new Error('Failed to submit results');
      }

      return await response.json();
    } catch (error) {
      console.error('Results submission error:', error);
      throw new Error('Failed to save results');
    }
  }
}
```

### 4. Component Implementation

#### Text Display Component
Create `src/lib/components/typing/TextDisplay.svelte`:
```svelte
<script>
  import { typingStore } from '$lib/stores/typing';

  // Computed property for character styling
  $: characters = $typingStore.text.split('').map((char, index) => {
    const inputChar = $typingStore.input[index];
    let status = 'pending';

    if (inputChar !== undefined) {
      status = inputChar === char ? 'correct' : 'incorrect';
    }

    return { char, status };
  });
</script>

<div class="typing-text bg-white p-6 rounded-lg shadow-sm">
  {#each characters as { char, status }}
    <span class="char {status}">
      {char}
    </span>
  {/each}
</div>

<style lang="scss">
  .char {
    &.pending {
      @apply text-gray-500;
    }
    
    &.correct {
      @apply text-green-600;
    }
    
    &.incorrect {
      @apply text-red-600 bg-red-100;
    }
  }
</style>
```

#### Text Input Component
Create `src/lib/components/typing/TextInput.svelte`:
```svelte
<script>
  import { typingStore } from '$lib/stores/typing';
  import { Button } from 'flowbite-svelte';

  let inputElement;

  function handleInput(event) {
    const input = event.target.value;
    
    if ($typingStore.status === 'ready') {
      typingStore.startTest();
    }
    
    typingStore.updateInput(input);
  }

  function handleReset() {
    typingStore.reset();
    inputElement.value = '';
    inputElement.focus();
  }
</script>

<div class="flex flex-col gap-4">
  <textarea
    bind:this={inputElement}
    on:input={handleInput}
    disabled={$typingStore.status === 'finished'}
    class="typing-input w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
    rows="3"
  ></textarea>

  {#if $typingStore.status === 'finished'}
    <Button color="blue" on:click={handleReset}>
      Try Again
    </Button>
  {/if}
</div>
```

#### Stats Component
Create `src/lib/components/typing/Stats.svelte`:
```svelte
<script>
  import { typingStats } from '$lib/stores/typing';
  import { Card } from 'flowbite-svelte';
</script>

{#if $typingStats}
  <Card class="stats-card">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="stat-item">
        <h3 class="text-lg font-semibold">WPM</h3>
        <p class="text-2xl">{$typingStats.wpm}</p>
      </div>
      
      <div class="stat-item">
        <h3 class="text-lg font-semibold">Accuracy</h3>
        <p class="text-2xl">{$typingStats.accuracy}%</p>
      </div>
      
      <div class="stat-item">
        <h3 class="text-lg font-semibold">Time</h3>
        <p class="text-2xl">{$typingStats.duration}s</p>
      </div>
      
      <div class="stat-item">
        <h3 class="text-lg font-semibold">Errors</h3>
        <p class="text-2xl">{$typingStats.errors}</p>
      </div>
    </div>
  </Card>
{/if}
```

### 5. Main Page Implementation
Update `src/routes/+page.svelte`:
```svelte
<script>
  import { onMount } from 'svelte';
  import { typingStore } from '$lib/stores/typing';
  import { TypingTestService } from '$lib/services/typingTest';
  import TextDisplay from '$lib/components/typing/TextDisplay.svelte';
  import TextInput from '$lib/components/typing/TextInput.svelte';
  import Stats from '$lib/components/typing/Stats.svelte';
  import { Alert } from 'flowbite-svelte';

  let error = null;

  async function loadNewTest() {
    try {
      const text = await TypingTestService.fetchText();
      typingStore.initializeTest(text);
      error = null;
    } catch (err) {
      error = err.message;
    }
  }

  onMount(loadNewTest);
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-8">Test Your Typing Speed</h1>

  {#if error}
    <Alert color="red" class="mb-4">
      {error}
    </Alert>
  {/if}

  <div class="flex flex-col gap-6">
    <TextDisplay />
    <TextInput />
    <Stats />
  </div>
</div>
```

Would you like me to continue with:
1. Backend service implementations
2. Error handling specifics
3. Docker configuration details
4. Testing implementation

Please let me know which aspect you'd like me to elaborate on next.