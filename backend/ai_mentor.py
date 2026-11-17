
import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load project root .env
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

# Gemini configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash-lite"
)
FALLBACK_MODEL = os.getenv(
    "GEMINI_FALLBACK_MODEL",
    "gemini-3.6-flash"
)

router = APIRouter()

# Initialize Gemini client
client = (
    genai.Client(api_key=GEMINI_API_KEY)
    if GEMINI_API_KEY
    else None
)


class MentorRequest(BaseModel):
    message: str
    language: str = "Auto"


class MentorResponse(BaseModel):
    reply: str


@router.post("/mentor/chat", response_model=MentorResponse)
def mentor_chat(request: MentorRequest):

    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Please enter your question."
        )

    if client is None:
        raise HTTPException(
            status_code=500,
            detail="Gemini API configuration is missing."
        )

    prompt = f"""
You are NEXUS AI Mentor.

LANGUAGE:
- Detect the language of the student's message.
- English question = English answer.
- Hindi question = Hindi answer.
- Hinglish question = Hinglish answer.
- Never change the language unless requested.

BEHAVIOUR:
- Adapt answer length and depth to the user's question.
- Do not impose an arbitrary minimum or maximum answer length.
- Give direct answers for simple questions.
- Give detailed explanations when requested.
- Follow requests for short, detailed, step-by-step, or comprehensive answers.
- Include examples when useful or requested.
- Never omit important information just to keep answers short.
- Avoid unnecessary repetition.

Student Question:
{message}
"""

    try:
        models = [MODEL_NAME, FALLBACK_MODEL]

        for model in models:
            try:
                print(f"Trying Gemini model: {model}")

                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.3
                    )
                )

                reply = response.text

                if reply:
                    print(f"Success with model: {model}")
                    return {"reply": reply}

                raise HTTPException(
                    status_code=502,
                    detail="AI returned an empty response."
                )

            except HTTPException:
                raise

            except Exception as e:
                error_text = str(e).upper()

                print(f"Model {model} failed: {e}")

                temporary_errors = [
                    "503",
                    "UNAVAILABLE",
                    "429",
                    "RESOURCE_EXHAUSTED",
                    "500",
                    "INTERNAL"
                ]

                if any(code in error_text for code in temporary_errors):
                    print(f"Switching to fallback model: {FALLBACK_MODEL}")
                    continue

                raise

        print("All Gemini models are unavailable.")

        raise HTTPException(
            status_code=503,
            detail="NEXUS AI is temporarily busy. Please try again."
        )

    except HTTPException:
        raise

    except Exception as e:
        print("GEMINI ERROR TYPE:", type(e).__name__)
        print("GEMINI ERROR DETAILS:", str(e))

        raise HTTPException(
            status_code=503,
            detail="Gemini AI service is temporarily unavailable."
        )
