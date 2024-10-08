const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Add this line to import cors
const { getSubtitles } = require('youtube-captions-scraper');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const msgHistoryPath = path.join(__dirname, 'msgHistory.json');

let lastVideoId = null; // To store the last video ID





// Use CORS middleware to allow requests from other origins
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const clearUserAndAssistantMessages = (jsonFilePath) => {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    // Filter out "user" and "assistant" messages, keeping only the system message
    jsonData.messages = jsonData.messages.filter(msg => msg.role === 'system');

    // Write the updated JSON back to the file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
};

// Function to update message history
function updateMsgHistory(role, content) {
    const history = JSON.parse(fs.readFileSync(msgHistoryPath, 'utf8'));

    const newMessage = {
        role: role,
        content: content
    };

    history.messages.push(newMessage);

    fs.writeFileSync(msgHistoryPath, JSON.stringify(history, null, 4));
}

// Function to call GPT-4 API using axios
async function getGPTResponse() {
    const apiKey = process.env.OPENAI_API_KEY;
    const history = JSON.parse(fs.readFileSync(msgHistoryPath, 'utf8'));

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: history.messages, // Send the full message history to GPT
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        const content = response.data.choices[0].message.content;
        updateMsgHistory('assistant', content);  // Update assistant's response in the history
        return content;
    } catch (error) {
        console.error('Error fetching GPT-4 response:', error);
        throw new Error(error.response?.data?.error?.message || 'Unknown error from GPT-4 API');
    }
}

async function getTranscriptFromYouTube(youtubeUrl) {
    try {
        const captions = await getSubtitles({ videoID: youtubeUrl }); // Await the asynchronous operation
        // Extract only the text content and combine into a single string
        const transcriptText = captions.map(entry => entry.text).join(' ');
        //console.log('Fetched Transcript:', transcriptText);  // Log the fetched transcript

        return transcriptText;
    } catch (error) {
        console.error('Error fetching subtitles:', error);
        throw error;  // Rethrow the error so it can be caught in the route handler
    }
}

// Helper function to extract video ID from YouTube URL
function extractVideoIdFromUrl(url) {
    const urlParts = url.split("v=");
    return urlParts[1];
}


// Route to handle chat requests
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const id = extractVideoIdFromUrl(userMessage)
    console.log('Received YouTube URL:', userMessage);

    if (!userMessage) {
        return res.status(400).json({ error: 'No message provided' });
    }

    // Check if there's a new URL
    if (id !== lastVideoId) {
        // New video detected, clear previous user and assistant messages
        clearUserAndAssistantMessages('msgHistory.json');
        lastVideoId = id; // Update last video ID
    }

    
    try {
        text = await getTranscriptFromYouTube(id)

        // Update user message in the history
        updateMsgHistory('user', text);

        // Get the GPT response based on the updated history
        const gptResponse = await getGPTResponse();

        // Respond with the GPT response and image URL
        res.json({ response: gptResponse });
    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({ error: 'Error processing chat request' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});