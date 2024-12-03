import fastDiff from 'fast-diff';

export class TextAnalyzer {
  analyzeDifferences(targetText, inputText) {
    const diffs = fastDiff(targetText, inputText);
    return this.processDifferences(diffs, targetText);
  }

  processDifferences(diffs, targetText) {                               // TODO: Clarify whether targetText is needed
    let position = 0;
    const errors = [];
    const analysis = {
      correctCharacters: 0,
      incorrectCharacters: 0,
      missingCharacters: 0,
      extraCharacters: 0,
      errors: []
    };

    diffs.forEach(([type, value]) => {
      switch (type) {
        case 0: // Match
          analysis.correctCharacters += value.length;
          position += value.length;
          break;
        case -1: // Deletion
          analysis.missingCharacters += value.length;
          errors.push({
            type: 'missing',
            position,
            expected: value,
            actual: ''
          });
          break;
        case 1: // Addition
          analysis.extraCharacters += value.length;
          analysis.incorrectCharacters += value.length;
          errors.push({
            type: 'extra',
            position,
            expected: '',
            actual: value
          });
          position += value.length;
          break;
      }
    });

    analysis.errors = errors;
    return analysis;
  }

  calculateAccuracy(analysis) {
    const totalExpectedCharacters = analysis.correctCharacters + analysis.missingCharacters;
    if (totalExpectedCharacters === 0) { return 100; }
    return (analysis.correctCharacters / totalExpectedCharacters) * 100;
  }
}