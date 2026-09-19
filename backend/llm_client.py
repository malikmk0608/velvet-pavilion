import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
MODEL = "gemini-flash-latest"

def stream_gemini_response(prompt: str):
    try:
        response_stream = client.models.generate_content_stream(
            model=MODEL,
            contents=prompt,
        )
        for chunk in response_stream:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"\n\n[SYSTEM ERROR]: {type(e).__name__} - {str(e)}"
