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