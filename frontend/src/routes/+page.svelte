<!-- frontend/src/routes/+page.svelte  Main Page Implementation -->
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