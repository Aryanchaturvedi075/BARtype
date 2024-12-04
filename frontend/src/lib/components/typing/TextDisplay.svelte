<script>
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

<div
    class="typing-text-container border-2 border-gray-400 rounded-lg p-4 overflow-hidden"
    class:complete={isComplete}
>
    <div class="text-overlay">
        {#each characters as { char, status }}
            <span class="character {status}">{char}</span>
        {/each}
    </div>
    <div class="user-input">
        {#each input.split('') as char, index}
            <span class="character">{char}</span>
        {/each}
    </div>
</div>

<style lang="scss">
    .typing-text-container {
        @apply relative font-mono text-lg leading-relaxed bg-gray-800;

        &.complete {
            @apply opacity-50;
        }

        .text-overlay {
            @apply absolute top-0 left-0 w-full h-full;
            white-space: pre-wrap;
        }

        .user-input {
            @apply relative z-10;
            white-space: pre-wrap;
        }
    }
</style>