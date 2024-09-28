const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Add this line to import cors
//const youtubeTranscript = require('youtube-transcript'); // Install a transcript library
//const YoutubeTranscript = require('youtube-transcript');
//Load environment variables from.env file
const { getSubtitles } = require('youtube-captions-scraper');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const msgHistoryPath = path.join(__dirname, 'msgHistory.json');


// Use CORS middleware to allow requests from other origins
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Function to update message history
function updateMsgHistory(role, content) {
    const history = JSON.parse(fs.readFileSync(msgHistoryPath, 'utf8'));
    //console.log(history);

    const newMessage = {
        role: role,
        content: content
    };
    console.log(newMessage);
    //history.messages.push(newMessage);

    fs.writeFile(msgHistoryPath, "wha");
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
        console.log('History Messages:', history.messages);//
        return content;
    } catch (error) {
        console.error('Error fetching GPT-4 response:', error);
        throw new Error(error.response?.data?.error?.message || 'Unknown error from GPT-4 API');
    }
}

// Route to handle chat requests
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log('Received YouTube URL:', userMessage);

    if (!userMessage) {
        return res.status(400).json({ error: 'No message provided' });
    }

    try {
        const transcript = await getTranscriptFromYouTube(userMessage);
        // Write the transcript to a JSON file
        //console.log(transcript);
        updateMsgHistory('user', transcript);

        // Get the GPT response based on the updated history
        const gptResponse = await getGPTResponse();

        // Respond with the GPT response and image URL
        res.json({ response: gptResponse });
    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({ error: 'Error processing chat request' });
    }
});

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

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



// Function to write transcript to JSON file
// function writeTranscriptToJSON(transcript) {
//     const data = {
//         transcript: transcript
//     };
//     console.log(JSON.stringify(data, null, 2));

//     // Write the transcript to a file
//     fs.writeFile('/Users/parsaghaderi/Desktop/SFU/FallHacks2024-SFU/BackEnd/server/msgHistorybc.json', JSON.stringify(data, null, 2), (err) => {
//         if (err) {
//             console.log(transcript);
//             console.error('Error writing to JSON file:', err);
//         } else {
//             console.log('Transcript successfully written to JSON file');
//         }
//     });

//}
