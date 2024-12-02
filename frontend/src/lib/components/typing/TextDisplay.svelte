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