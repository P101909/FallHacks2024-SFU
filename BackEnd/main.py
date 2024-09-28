from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Define a Pydantic model to validate the request body
class YouTubeLink(BaseModel):
    url: str

# Create a POST endpoint for receiving the YouTube link
@app.post("/get_link/")
async def get_link(link: YouTubeLink):
    youtube_url = link.url
    print(f"Received YouTube URL: {youtube_url}")
    
    # You can add a function here to process the link, for example:
    # transcript = fetch_transcript(youtube_url)
    # For now, we will return a placeholder response

    return {"message": "YouTube link received!", "url": youtube_url}

# Run the app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
