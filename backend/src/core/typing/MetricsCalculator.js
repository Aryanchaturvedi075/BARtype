export class MetricsCalculator {
  calculateMetrics(analysis, startTime, endTime) {
    const durationInMinutes = (endTime - startTime) / 60000;
    const totalCharacters =
      analysis.correctCharacters + analysis.incorrectCharacters;

    return {
      wpm: this.calculateWPM(totalCharacters, durationInMinutes),
      accuracy: analysis.accuracy,
      duration: durationInMinutes,
      errorRate: this.calculateErrorRate(
        analysis.errors.length,
        durationInMinutes,
      ),
    };
  }

  calculateWPM(totalCharacters, durationInMinutes) {
    // Standard calculation assuming average word length of 5 characters
    const words = totalCharacters / 5;
    return Math.round((words / durationInMinutes) * 100) / 100;
  }

  calculateErrorRate(errorCount, durationInMinutes) {
    return Math.round((errorCount / durationInMinutes) * 100) / 100;
  }

  calculateNetWPM(grossWPM, errorCount, durationInMinutes) {
    // Net WPM = Gross WPM - (Number of Errors / Duration in Minutes / 5)
    return Math.max(0, grossWPM - errorCount / durationInMinutes / 5);
  }
}
