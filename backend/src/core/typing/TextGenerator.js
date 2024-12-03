const nouns = [
  "time",
  "year",
  "people",
  "way",
  "day",
  "man",
  "thing",
  "woman",
  "life",
  "child",
  "world",
  "school",
  "state",
  "family",
  "student",
  "group",
  "country",
  "problem",
  "hand",
  "part",
];

const verbs = [
  "be",
  "have",
  "do",
  "say",
  "get",
  "make",
  "go",
  "know",
  "take",
  "see",
  "come",
  "think",
  "look",
  "want",
  "give",
  "use",
  "find",
  "tell",
  "ask",
  "work",
];

const adjectives = [
  "good",
  "new",
  "first",
  "last",
  "long",
  "great",
  "little",
  "own",
  "other",
  "old",
  "right",
  "big",
  "high",
  "different",
  "small",
  "large",
  "next",
  "early",
  "young",
  "important",
];

export class TextGenerator {
  constructor() {
    this.words = { nouns, verbs, adjectives };
  }

  generateText(wordCount = 50) {
    const text = [];
    let prevType = null;

    for (let i = 0; i < wordCount; i++) {
      const types = Object.keys(this.words);
      let type;

      // Avoid repeating the same word type
      do {
        type = types[Math.floor(Math.random() * types.length)];
      } while (type === prevType);

      const wordList = this.words[type];
      const word = wordList[Math.floor(Math.random() * wordList.length)];

      text.push(word);
      prevType = type;
    }

    return text.join(" ");
  }

  addCustomWords(type, words) {
    if (!this.words[type]) {
      throw new Error("Invalid word type");
    }
    this.words[type].push(...words);
  }
}
