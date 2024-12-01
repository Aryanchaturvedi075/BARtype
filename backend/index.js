const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001; // Or your preferred port
const { generateEfficientRandomText } = require('shared/textGenerator');

app.use(cors());

app.get('/api/text', (req, res) => {
    const numWords = req.query.numWords || 50;
    const text = generateEfficientRandomText(numWords);
    res.json({ text });
});

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});