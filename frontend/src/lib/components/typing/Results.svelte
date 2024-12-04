<script>
    import { createEventDispatcher } from 'svelte';

    export let metrics = {
        wpm: 0,
        accuracy: 0,
        duration: 0,
        errorRate: 0
    };

    export let isVisible = false;

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch('click');
    }
</script>

<div
    class="results-container transition-all duration-500 transform"
    class:visible={isVisible}
    on:click={handleClick}
>
    <div class="metrics-grid">
        <div class="metric-item">
            <h3 class="metric-label">WPM</h3>
            <p class="metric-value" data-testid="wpm-value">
                {metrics.wpm.toFixed(1)}
            </p>
        </div>

        <div class="metric-item">
            <h3 class="metric-label">Accuracy</h3>
            <p class="metric-value" data-testid="accuracy-value">
                {metrics.accuracy.toFixed(1)}%
            </p>
        </div>

        <div class="metric-item">
            <h3 class="metric-label">Time</h3>
            <p class="metric-value" data-testid="duration-value">
                {(metrics.duration * 60).toFixed(1)}s
            </p>
        </div>

        <div class="metric-item">
            <h3 class="metric-label">Error Rate</h3>
            <p class="metric-value" data-testid="error-rate-value">
                {metrics.errorRate.toFixed(1)}/min
            </p>
        </div>
    </div>
</div>

<style lang="scss">
    .results-container {
        @apply opacity-0 -translate-y-10 transition-all duration-500 transform;

        &.visible {
            @apply opacity-100 translate-y-0;
        }
    }
</style>