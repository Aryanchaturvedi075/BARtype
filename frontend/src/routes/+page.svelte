<script>
  import { onMount, onDestroy } from 'svelte';
  import {
      WebSocketClient,
      TextDisplay,
      TextInput,
      Results
  } from '$lib';
  import { Alert } from 'flowbite-svelte';

  let wsClient;
  let sessionId = '';
  let text = '';
  let input = '';
  let isComplete = false;
  let isStarted = false;
  let error = null;
  let metrics = {
      wpm: 0,
      accuracy: 0,
      duration: 0,
      errorRate: 0
  };
  let timerInterval;

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
      clearInterval(timerInterval);
  });

  function handleInput(event) {
      input = event.detail.value;
      wsClient?.send('INPUT_UPDATE', { input });
  }

  function handleStart() {
      isStarted = true;
      wsClient?.send('START_SESSION', { sessionId });
      startTimer();
  }

  function handleMetricsUpdate(data) {
      metrics = data.metrics;
  }

  function handleSessionComplete(data) {
      isComplete = true;
      metrics = data.metrics;
      stopTimer();
  }

  function handleError(data) {
      error = data.message;
  }

  async function handleReset() {
      try {
          wsClient?.disconnect();
          input = '';
          isComplete = false;
          isStarted = false;
          resetTimer();
          await onMount();
      } catch (err) {
          error = err.message;
      }
  }

  function handleStop() {
      isStarted = false;
      stopTimer();
      wsClient?.send('STOP_SESSION', { sessionId });
  }

  function startTimer() {
      let startTime = new Date().getTime();
      timerInterval = setInterval(() => {
          const now = new Date().getTime();
          const distance = now - startTime;

          const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          const milliseconds = Math.floor((distance % 1000) / 10);

          const formattedTimer = `${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
          document.getElementById('timer').textContent = formattedTimer;
      }, 10);
  }

  function stopTimer() {
      clearInterval(timerInterval);
  }

  function resetTimer() {
      stopTimer();
      document.getElementById('timer').textContent = '00:00:00:00';
  }

  // Function to show the modal
  function showModal() {
      const modal = document.getElementById('modal');
      const overlay = document.getElementById('overlay');
      modal.classList.add('active');
      overlay.classList.add('active');
  }

  // Function to close the modal
  function closeModal() {
      const modal = document.getElementById('modal');
      const overlay = document.getElementById('overlay');
      modal.classList.remove('active');
      overlay.classList.remove('active');
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
            {isStarted}
            {isComplete}
            on:input={handleInput}
            on:start={handleStart}
            on:reset={handleReset}
        />

        <div class="controls">
            <button
                class="reset-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-transform duration-300 transform hover:scale-105"
                on:click={handleReset}
                data-testid="reset-button"
            >
                Try Again
            </button>

            {#if isStarted}
                <button
                    class="stop-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-transform duration-300 transform hover:scale-105"
                    on:click={handleStop}
                    data-testid="stop-button"
                >
                    Stop
                </button>
            {/if}
        </div>

        <Results {metrics} {isComplete} on:click={showModal} />
    </div>

    <div id="timer">00:00:00:00</div>
</div>