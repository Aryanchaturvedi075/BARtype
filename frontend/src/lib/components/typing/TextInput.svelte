<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let isStarted = false;
    export let isComplete = false;

    let inputElement;
    let startTime;

    function handleInput(event) {
        if (!isStarted) {
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
        disabled={isComplete}
        class="typing-input border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-yellow-500"
        placeholder="Start typing..."
        rows="3"
        data-testid="typing-input"
    ></textarea>
</div>