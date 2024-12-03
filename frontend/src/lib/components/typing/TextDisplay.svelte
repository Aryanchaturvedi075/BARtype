<script>
    import { onMount } from 'svelte';
    
    export let text = '';
    export let input = '';
    export let isComplete = false;
  
    $: characters = text.split('').map((char, index) => {
      const inputChar = input[index];
      let status = 'pending';
      
      if (inputChar !== undefined) {
        status = inputChar === char ? 'correct' : 'incorrect';
      }
      
      return { char, status };
    });
  </script>
  
  <div class="typing-text-container" class:complete={isComplete}>
    {#each characters as { char, status }, index}
      <span 
        class="character {status}"
        data-testid="character-{index}"
      >
        {char}
      </span>
    {/each}
  </div>
  
  <style lang="scss">
    .typing-text-container {
      @apply font-mono text-lg leading-relaxed p-4 bg-white rounded-lg shadow-sm;
      
      &.complete {
        @apply opacity-50;
      }
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