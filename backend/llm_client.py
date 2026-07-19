import os
from dotenv import load_dotenv
from google import genai
from google.genai import errors

load_dotenv()

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
MODEL = "gemini-3.5-flash"


def stream_gemini_response(prompt: str):
    try:
        response_stream = client.models.generate_content_stream(
            model=MODEL,
            contents=prompt,
        )
        for chunk in response_stream:
            if chunk.text:
                yield chunk.text
    except errors.ServerError:
        yield "\n\n[The AI service is temporarily busy. Please try again in a moment.]"
    except errors.ClientError as e:
        yield f"\n\n[Something went wrong: {str(e)}]"