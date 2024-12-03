import { test, expect } from '@playwright/test';
import { TextGenerator } from './TextGenerator.js';

test.describe('TextGenerator', () => {
  let generator;

  test.beforeEach(() => {
    generator = new TextGenerator();
  });

  test('generates text with specified word count', () => {
    const wordCount = 50;
    const text = generator.generateText(wordCount);
    expect(text.split(' ')).toHaveLength(wordCount);
  });

  test('generates different text on subsequent calls', () => {
    const text1 = generator.generateText(10);
    const text2 = generator.generateText(10);
    expect(text1).not.toBe(text2);
  });

  test('allows adding custom words', () => {
    const customNouns = ['computer', 'keyboard'];
    generator.addCustomWords('nouns', customNouns);
    const text = generator.generateText(100);
    const words = text.split(' ');
    expect(words.some(word => customNouns.includes(word))).toBeTruthy();
  });
});