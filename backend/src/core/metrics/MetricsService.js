// backend/src/core/metrics/MetricsService.js                       --> The Metrics Calculation Service
export class MetricsService {
    calculateMetrics(session, input) {
        const duration = (Date.now() - session.startTime) / 1000;
        const words = input.trim().split(/\s+/).length;
        const errors = this.calculateErrors(session.text, input);

        return {
            wpm: this.calculateWPM(words, duration),
            accuracy: this.calculateAccuracy(errors, input.length),
            duration,
            errorCount: errors
        };
    }

    #calculateWPM(wordCount, duration) {                            // private class method
        return Math.round((wordCount / duration) * 60);
    }

    #calculateAccuracy(errors, totalLength) {                       // private class method
        return ((totalLength - errors) / totalLength * 100).toFixed(2);
    }
}