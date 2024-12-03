<script>
    import { onMount, onDestroy } from 'svelte';
    import { WebSocketClient } from '$lib/utils/websocket';
    import TextDisplay from '$lib/components/typing/TextDisplay.svelte';
    import TextInput from '$lib/components/typing/TextInput.svelte';
    import Results from '$lib/components/typing/Results.svelte';
    import { Alert } from 'flowbite-svelte';
  
    let wsClient;
    let sessionId = '';
    let text = '';
    let input = '';
    let isComplete = false;
    let error = null;
    let metrics = {
      wpm: 0,
      accuracy: 0,
      duration: 0,
      errorRate: 0
    };
  
    onMount(async () => {
      try {
        const response = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wordCount: 50 })
        });
  
        if (!response.ok) throw new Error('Failed to start session');
  
        const data = await response.json();
        sessionId = data.sessionId;
        text = data.text;
  
        wsClient = new WebSocketClient(import.meta.env.VITE_WS_URL);
        await wsClient.connect(sessionId);
  
        wsClient.on('METRICS_UPDATE', handleMetricsUpdate);
        wsClient.on('SESSION_COMPLETE', handleSessionComplete);
        wsClient.on('ERROR', handleError);
  
      } catch (err) {
        error = err.message;
      }
    });
  
    onDestroy(() => {
      if (wsClient) {
        wsClient.disconnect();
      }
    });
  
    function handleInput(event) {
      input = event.detail.value;
      wsClient?.send('INPUT_UPDATE', { input });
    }
  
    function handleStart() {
      wsClient?.send('START_SESSION', { sessionId });
    }
  
    function handleMetricsUpdate(data) {
      metrics = data.metrics;
    }
  
    function handleSessionComplete(data) {
      isComplete = true;
      metrics = data.metrics;
    }
  
    function handleError(data) {
      error = data.message;
    }
  
    async function handleReset() {
      try {
        wsClient?.disconnect();
        input = '';
        isComplete = false;
        await onMount();
      } catch (err) {
        error = err.message;
      }
    }
  </script>
  
  <div class="typing-test-container">
    <h1 class="page-title">BARtype</h1>
  
    {#if error}
      <Alert color="red" class="mb-6" dismissable>
        {error}
      </Alert>
    {/if}
  
    <div class="test-content">
      <TextDisplay {text} {input} {isComplete} />
  
      <TextInput
        disabled={isComplete}
        {isComplete}
        on:input={handleInput}
        on:start={handleStart}
        on:reset={handleReset}
      />
  
      <Results metrics={metrics} isVisible={isComplete} />
    </div>
  </div>
  
  <style lang="scss">
    .typing-test-container {
      @apply max-w-4xl mx-auto px-4 py-8;
    }
  
    .page-title {
      @apply text-3xl font-bold text-center mb-8 text-gray-900;
    }
  
    .test-content {
      @apply space-y-6;
    }
  </style>