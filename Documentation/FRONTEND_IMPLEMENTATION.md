# Frontend Implementation

The frontend implementation focuses on creating an SSR-optimized SvelteKit application with real-time typing feedback and performance metrics visualization.

## SvelteKit Configuration

First, configure SvelteKit for optimal SSR performance and API integration:

```javascript
// frontend/src/hooks.server.js
export async function handle({ event, resolve }) {
  event.locals.apiBaseUrl = process.env.PUBLIC_BACKEND_URL;
  event.locals.wsUrl = process.env.PUBLIC_WS_URL;
  return resolve(event);
}

// frontend/src/lib/config/api.js
export const API_CONFIG = {
  baseUrl: import.meta.env.PUBLIC_BACKEND_URL,
  wsUrl: import.meta.env.PUBLIC_WS_URL,
};
```

## WebSocket Client Implementation

Create a WebSocket client service to handle real-time communication:

```javascript
// frontend/src/lib/services/websocket.js
export class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.handlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      // Bind all event handlers
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = (error) => {
        this.handleError(error);
        reject(new Error("WebSocket connection failed"));
      };

      // Set timeout for connection attempt
      const connectionTimeout = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, 5000);

      // Clear timeout if connection succeeds
      this.ws.onopen = () => {
        clearTimeout(connectionTimeout);
        this.reconnectAttempts = 0;
        resolve();
      };
    });
  }

  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      const handlers = this.handlers.get(message.type);
      if (handlers) {
        handlers.forEach((handler) => handler(message.data));
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  handleClose(event) {
    if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(
        () => this.connect(),
        1000 * Math.pow(2, this.reconnectAttempts),
      );
    }
  }

  handleError(error) {
    console.error("WebSocket error:", error);
    const errorHandlers = this.handlers.get("error");
    if (errorHandlers) {
      errorHandlers.forEach((handler) => handler(error));
    }
  }

  subscribe(eventType, handler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType).add(handler);

    return () => {
      this.handlers.get(eventType).delete(handler);
    };
  }

  send(type, data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    } else {
      throw new Error("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
```

## State Management

Implement a reactive store for managing typing test state:

```javascript
// frontend/src/lib/stores/typing.js
import { writable, derived } from "svelte/store";

function createTypingStore() {
  const initialState = {
    sessionId: null,
    text: "",
    input: "",
    status: "idle",
    metrics: null,
    error: null,
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    initialize: (sessionData) =>
      update((state) => ({
        ...state,
        sessionId: sessionData.id,
        text: sessionData.text,
        status: "ready",
      })),
    updateInput: (input) =>
      update((state) => ({
        ...state,
        input,
        status: input.length === state.text.length ? "complete" : "active",
      })),
    setMetrics: (metrics) =>
      update((state) => ({
        ...state,
        metrics,
      })),
    setError: (error) =>
      update((state) => ({
        ...state,
        error,
      })),
    reset: () => set(initialState),
  };
}

export const typingStore = createTypingStore();

// Derived stores for computed values
export const typingProgress = derived(typingStore, ($store) => ({
  isComplete: $store.status === "complete",
  isActive: $store.status === "active",
  progress: $store.text ? ($store.input.length / $store.text.length) * 100 : 0,
}));

export const typingAccuracy = derived(typingStore, ($store) => {
  if (!$store.text || !$store.input) {
    return 100;
  }
  const correctChars = [...$store.input].filter(
    (char, index) => char === $store.text[index],
  ).length;

  return (correctChars / $store.input.length) * 100;
});
```

## Component Implementation

### Text Display Component

```svelte
<!-- frontend/src/lib/components/typing/TextDisplay.svelte -->
<script>
    import { onMount } from 'svelte';

    export let text = '';
    export let input = '';
    export let characterClass = '';

    $: characters = text.split('').map((char, index) => ({
        char,
        status: getCharacterStatus(char, input[index])
    }));

    function getCharacterStatus(expected, actual) {
        if (actual === undefined) return 'pending';
        return actual === expected ? 'correct' : 'incorrect';
    }
</script>

<div class="typing-text" role="textbox" aria-label="Typing text">
    {#each characters as { char, status }, index}
        <span
            class="character {characterClass} {status}"
            data-position={index}
        >{char}</span>
    {/each}
</div>

<style lang="scss">
    .typing-text {
        @apply font-mono text-lg leading-relaxed whitespace-pre-wrap;
    }

    .character {
        @apply transition-colors duration-100;

        &.pending {
            @apply text-gray-400;
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

### Input Handler Component

```svelte
<!-- frontend/src/lib/components/typing/InputHandler.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    import { typingStore } from '$lib/stores/typing';

    const dispatch = createEventDispatcher();

    export let disabled = false;
    let inputElement;

    function handleInput(event) {
        const value = event.target.value;
        dispatch('input', {
            value,
            timestamp: Date.now()
        });
    }

    function handlePaste(event) {
        event.preventDefault();
    }
</script>

<div class="input-container">
    <textarea
        bind:this={inputElement}
        on:input={handleInput}
        on:paste={handlePaste}
        {disabled}
        class="typing-input"
        rows="3"
        aria-label="Type here"
    ></textarea>
</div>

<style lang="scss">
    .input-container {
        @apply relative w-full;
    }

    .typing-input {
        @apply w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500;
        @apply font-mono text-lg;
    }
</style>
```

### Performance Metrics Component

```svelte
<!-- frontend/src/lib/components/typing/MetricsDisplay.svelte -->
<script>
    export let metrics = null;
</script>

{#if metrics}
    <div class="metrics-grid">
        <div class="metric-item">
            <span class="label">WPM</span>
            <span class="value">{metrics.wpm}</span>
        </div>
        <div class="metric-item">
            <span class="label">Accuracy</span>
            <span class="value">{metrics.accuracy}%</span>
        </div>
        <div class="metric-item">
            <span class="label">Time</span>
            <span class="value">{metrics.duration}s</span>
        </div>
    </div>
{/if}

<style lang="scss">
    .metrics-grid {
        @apply grid grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm;
    }

    .metric-item {
        @apply flex flex-col items-center;

        .label {
            @apply text-sm text-gray-600;
        }

        .value {
            @apply text-2xl font-bold text-gray-900;
        }
    }
</style>
```

### Main Page Implementation

```svelte
<!-- frontend/src/routes/+page.svelte -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { typingStore } from '$lib/stores/typing';
    import { WebSocketClient } from '$lib/services/websocket';
    import TextDisplay from '$lib/components/typing/TextDisplay.svelte';
    import InputHandler from '$lib/components/typing/InputHandler.svelte';
    import MetricsDisplay from '$lib/components/typing/MetricsDisplay.svelte';

    let wsClient;

    onMount(async () => {
        wsClient = new WebSocketClient(import.meta.env.PUBLIC_WS_URL);
        await wsClient.connect();

        wsClient.subscribe('metrics', (metrics) => {
            typingStore.setMetrics(metrics);
        });
    });

    onDestroy(() => {
        if (wsClient) {
            wsClient.disconnect();
        }
    });
</script>

<div class="typing-container">
    <TextDisplay text={$typingStore.text} input={$typingStore.input} />
    <InputHandler
        disabled={$typingStore.status === 'complete'}
        on:input={(e) => typingStore.updateInput(e.detail.value)}
    />
    <MetricsDisplay metrics={$typingStore.metrics} />
</div>

<style lang="scss">
    .typing-container {
        @apply max-w-4xl mx-auto space-y-6 p-4;
    }
</style>
```

The next section established the Testing and Deployment section. It will cover:

1. Unit Testing Setup
2. Integration Testing
3. Docker Deployment Configuration
4. CI/CD Pipeline Setup
5. Performance Monitoring
