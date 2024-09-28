document.getElementById('search_button').addEventListener('click', async () => {
    // Clear any previous errors or responses
    document.getElementById('gptResponse').innerHTML = '';
    document.getElementById('error').innerHTML = '';

    // Get the user input
    const userMessage = document.getElementById('userMessage').value;

    if (!userMessage) {
        document.getElementById('error').innerHTML = 'Please enter a message or YouTube URL!';
        return;
    }

    try {
        // Send the user input to the server via POST request
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });

        // Parse the JSON response from the server
        const data = await response.json();

        if (response.ok) {
            // Display the GPT-4 response on the page
            document.getElementById('gptResponse').innerHTML = data.response;
        } else {
            // Handle server errors (e.g., YouTube transcript error, GPT-4 error)
            document.getElementById('error').innerHTML = data.error || 'An error occurred';
        }

    } catch (error) {
        console.error('Error sending message:', error);
        document.getElementById('error').innerHTML = 'Failed to send message to server';
    }
});
