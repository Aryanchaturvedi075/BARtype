import { test, expect } from '@playwright/test';
import { TextAnalyzer } from './TextAnalyzer.js';

test.describe('TextAnalyzer', () => {
  let analyzer;

  test.beforeEach(() => {
    analyzer = new TextAnalyzer();
  });

  test('correctly identifies matching text', () => {
    const targetText = 'hello world';
    const inputText = 'hello world';
    const analysis = analyzer.analyzeDifferences(targetText, inputText);
    
    expect(analysis.correctCharacters).toBe(11);
    expect(analysis.incorrectCharacters).toBe(0);
    expect(analysis.errors).toHaveLength(0);
  });

  test('identifies missing characters', () => {
    const targetText = 'hello world';
    const inputText = 'helo world';
    const analysis = analyzer.analyzeDifferences(targetText, inputText);
    
    expect(analysis.missingCharacters).toBe(1);
    expect(analysis.errors[0]).toEqual({
      type: 'missing',
      position: 3,
      expected: 'l',
      actual: ''
    });
  });

  test('identifies extra characters', () => {
    const targetText = 'hello world';
    const inputText = 'helllo world';
    const analysis = analyzer.analyzeDifferences(targetText, inputText);
    
    expect(analysis.extraCharacters).toBe(1);
    expect(analysis.errors[0]).toEqual({
      type: 'extra',
      position: 3,
      expected: '',
      actual: 'l'
    });
  });

  test('calculates accuracy percentage correctly', () => {
    const analysis = {
      correctCharacters: 8,
      missingCharacters: 2,
      incorrectCharacters: 0
    };
    
    const accuracy = analyzer.calculateAccuracy(analysis);
    expect(accuracy).toBe(80);
  });
});