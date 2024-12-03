<script>
    import { Card } from 'flowbite-svelte';
  
    export let metrics = {
      wpm: 0,
      accuracy: 0,
      duration: 0,
      errorRate: 0
    };
  
    export let isVisible = false;
  </script>
  
  <div class="results-container" class:visible={isVisible}>
    <Card>
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
    </Card>
  </div>
  
  <style lang="scss">
    .results-container {
      @apply opacity-0 transition-opacity duration-300;
  
      &.visible {
        @apply opacity-100;
      }
    }
  
    .metrics-grid {
      @apply grid grid-cols-2 md:grid-cols-4 gap-6;
    }
  
    .metric-item {
      @apply flex flex-col items-center text-center;
    }
  
    .metric-label {
      @apply text-sm font-medium text-gray-600 mb-1;
    }
  
    .metric-value {
      @apply text-2xl font-bold text-gray-900;
    }
  </style>