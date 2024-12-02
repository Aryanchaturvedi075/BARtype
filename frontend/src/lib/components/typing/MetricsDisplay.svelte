<!-- frontend/src/lib/components/typing/MetricsDisplay.svelte -->
<script>
    export let metrics = null;
</script>

{#if metrics}
    <div class="metrics-grid">
        <div class="metric-item">
            <span class="label">WPM</span>
            <span class="value">{metrics.wpm}</span>
        </div>
        <div class="metric-item">
            <span class="label">Accuracy</span>
            <span class="value">{metrics.accuracy}%</span>
        </div>
        <div class="metric-item">
            <span class="label">Time</span>
            <span class="value">{metrics.duration}s</span>
        </div>
    </div>
{/if}

<style lang="scss">
    .metrics-grid {
        @apply grid grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm;
    }

    .metric-item {
        @apply flex flex-col items-center;

        .label {
            @apply text-sm text-gray-600;
        }

        .value {
            @apply text-2xl font-bold text-gray-900;
        }
    }
</style>