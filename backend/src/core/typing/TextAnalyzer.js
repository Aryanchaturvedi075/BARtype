// backend/src/core/typing/TextAnalyzer.js
import fastDiff from 'fast-diff';

export class TextAnalyzer {
    analyzeDifferences(targetText, inputText) {
        const diffs = fastDiff(targetText, inputText);
        return this.processDifferences(diffs, targetText);
    }

    processDifferences(diffs, targetText) {
        let position = 0;
        const errors = [];
        const analysis = {
            correctCharacters: 0,
            incorrectCharacters: 0,
            missingCharacters: 0,
            extraCharacters: 0,
            errors: [],
            context: {} // Enhanced error context
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
                        type: "missing",
                        position,
                        expected: value,
                        actual: "",
                        context: this.getErrorContext(targetText, position)
                    });
                    break;
                case 1: // Addition
                    analysis.extraCharacters += value.length;
                    analysis.incorrectCharacters += value.length;
                    errors.push({
                        type: "extra",
                        position,
                        expected: "",
                        actual: value,
                        context: this.getErrorContext(targetText, position)
                    });
                    position += value.length;
                    break;
            }
        });

        analysis.errors = errors;
        analysis.context = {
            totalWords: targetText.split(' ').length,
            errorDistribution: this.calculateErrorDistribution(errors, targetText.length),
            overallAccuracy: this.calculateAccuracy(analysis)
        };

        return analysis;
    }

    getErrorContext(text, position) {
        const contextSize = 5;
        const start = Math.max(0, position - contextSize);
        const end = Math.min(text.length, position + contextSize);
        return {
            before: text.slice(start, position),
            after: text.slice(position, end),
            wordPosition: this.getWordPosition(text, position)
        };
    }

    calculateErrorDistribution(errors, textLength) {
        return {
            beginning: errors.filter(e => e.position < textLength * 0.33).length,
            middle: errors.filter(e => e.position >= textLength * 0.33 && e.position < textLength * 0.66).length,
            end: errors.filter(e => e.position >= textLength * 0.66).length
        };
    }

    calculateAccuracy(analysis) {
        const totalExpectedCharacters = analysis.correctCharacters + analysis.missingCharacters;
        if (totalExpectedCharacters === 0) { return 100; }
        return (analysis.correctCharacters / totalExpectedCharacters) * 100;
    }

    getWordPosition(text, position) {
        const wordsBeforePosition = text.slice(0, position).split(' ').length;
        const totalWords = text.split(' ').length;
        return {
            wordNumber: wordsBeforePosition,
            wordPercentage: (wordsBeforePosition / totalWords) * 100
        };
    }
}