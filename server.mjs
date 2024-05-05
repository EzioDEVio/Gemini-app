
import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static('public'));

// Fallback route handler for the root to serve 'index.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/generate-text', async (req, res) => {
    const textPrompt = req.body.prompt;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.API_KEY}`;
    const requestBody = {
        "contents": [{
            "parts": [{
                "text": textPrompt
            }]
        }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2)); // Debug output

        // Correctly extracting text based on the structure shown in your API response
        const generatedText = data.candidates[0].content.parts.map(part => part.text).join('\n');
        res.json({ generatedText });
    } catch (error) {
        console.error('Error calling Google Gemini API:', error);
        res.status(500).send('Failed to generate text');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
