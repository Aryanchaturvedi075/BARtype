const nouns = [
    "cat", "dog", "bird", "car", "computer", "city", "ocean", "forest", 
    "book", "idea", "mountain", "river", "castle", "kingdom", "planet",
    "journey", "adventure", "friendship", "harmony", "discovery", "universe",
    "dream", "hero", "villain", "machine", "star", "galaxy"
];
const verbs = [
    "jumps", "runs", "flies", "types", "sings", "drives", "builds", "explores",
    "creates", "writes", "imagines", "discovers", "embraces", "fights", "analyzes",
    "climbs", "wanders", "pursues", "realizes", "dreams", "grows", "thinks",
    "observes", "conquers", "understands", "explains"
];
const adjectives = [
    "quick", "lazy", "beautiful", "vast", "bright", "ambitious", "mysterious",
    "eager", "bold", "serene", "majestic", "peaceful","towering", "silent",
    "graceful", "radiant", "ancient", "fascinating", "vivid", "brilliant",
    "shimmering", "glistening", "delicate", "magnificent", "spectacular"
];
const adverbs = [
    "quickly", "silently", "boldly", "brightly", "eagerly", "gracefully",
    "vividly", "happily", "loudly", "peacefully", "relentlessly", "bravely",
    "calmly", "diligently", "steadily", "fearlessly", "thoughtfully",
    "passionately", "curiously", "effortlessly", "meticulously"
];
const prepositions = [
    "over", "under", "beside", "across", "through", "behind", "along", "around",
    "above", "within", "beyond", "toward", "against", "into", "between", "among",
    "upon", "onto", "near", "by"
];

const connectors = [
    "and", "but", "while", "however", "although", "because", "as", "since",
    "when", "after", "before", "until", "if", "where", "though"
];

function generateEfficientRandomText(numWords = 50) {
let result = [];
for (let i = 0; i < numWords; i++) {
    result.push(getRandomWord());
}
return result.join(' ');
}

function getRandomWord() {
const wordTypes = [nouns, verbs, adjectives, adverbs, prepositions];
const randomType = wordTypes[Math.floor(Math.random() * wordTypes.length)];
return randomType[Math.floor(Math.random() * randomType.length)];
}

export { generateEfficientRandomText };