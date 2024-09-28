import json
from youtube_transcript_api import YouTubeTranscriptApi

# Function to get transcript from a YouTube link
def get_transcript(youtube_url: str) -> str:
    video_id = youtube_url.split("v=")[-1]  # Extract video ID from URL
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    transcript_text = " ".join([entry['text'] for entry in transcript])
    
    transcript_text

