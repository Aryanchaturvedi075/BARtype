<script>
    import { createEventDispatcher } from 'svelte';
    import { Button } from 'flowbite-svelte';
  
    const dispatch = createEventDispatcher();
  
    export let disabled = false;
    export let isComplete = false;
  
    let inputElement;
    let startTime;
  
    function handleInput(event) {
      if (!startTime) {
        startTime = Date.now();
        dispatch('start');
      }
  
      dispatch('input', {
        value: event.target.value,
        timestamp: Date.now()
      });
    }
  
    function handleKeyPress(event) {
      if (isComplete) {
        event.preventDefault();
        return;
      }
    }
  
    function handlePaste(event) {
      event.preventDefault();
    }
  
    function resetInput() {
      if (inputElement) {
        inputElement.value = '';
        startTime = null;
        dispatch('reset');
      }
    }
  </script>
  
  <div class="input-container">
    <textarea
      bind:this={inputElement}
      on:input={handleInput}
      on:keypress={handleKeyPress}
      on:paste={handlePaste}
      {disabled}
      class="typing-input"
      placeholder="Start typing..."
      rows="3"
      data-testid="typing-input"
    ></textarea>
  
    {#if isComplete}
      <Button 
        color="blue" 
        on:click={resetInput}
        data-testid="reset-button"
      >
        Try Again
      </Button>
    {/if}
  </div>
  
  <style lang="scss">
    .input-container {
      @apply flex flex-col gap-4;
    }
  
    .typing-input {
      @apply w-full p-4 font-mono text-lg border rounded-lg focus:ring-2 focus:ring-blue-500;
      
      &:disabled {
        @apply bg-gray-100 cursor-not-allowed;
      }
    }
  </style>