from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import utils
import AI_util

app = FastAPI()

# Model for the request body
class YouTubeLink(BaseModel):
    url: str

# POST endpoint to receive YouTube link
@app.post("/get_link/")
async def get_link(link: YouTubeLink):
    youtube_url = link.url
    
    # Get the transcript from YouTube link and write it to JSON
    try:
        utils.get_transcript(youtube_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Transcript fetched, ", "url": youtube_url}

# POST endpoint to give summary
@app.post("/give_summary/")
async def give_summary():
    # Read the transcript from the JSON file
    try:
        ai_output = AI_utils.get_AI_output()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"summary": ai_output}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
