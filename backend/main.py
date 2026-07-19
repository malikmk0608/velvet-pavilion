import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

from llm_client import stream_gemini_response

load_dotenv()

app = FastAPI(title="Velvet Pavilion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    input_text: str


class ScriptRequest(BaseModel):
    input_text: str
    genre: str = ""
    style_reference: str = ""
    scale: str = ""


class SceneRequest(BaseModel):
    input_text: str
    genre: str = ""
    style_reference: str = ""


@app.post("/api/script")
def generate_script(request: ScriptRequest):
    style_lines = []
    if request.genre:
        style_lines.append(f"Genre/tone: {request.genre}")
    if request.style_reference:
        style_lines.append(f"Stylistic reference: {request.style_reference}")
    if request.scale:
        style_lines.append(f"Scale/mood: {request.scale}")

    style_block = "\n".join(style_lines) if style_lines else "No specific style constraints — use your best judgment."

    prompt = f"""You are a professional screenwriting assistant. Turn this story idea into a short,
properly formatted screenplay scene: scene heading, action lines, character names, and dialogue,
following industry-standard screenplay structure.

{style_block}

Let the genre, stylistic reference, and scale genuinely shape the dialogue's rhythm, the pacing of
action lines, and the overall tone — don't just mention them, embody them in the writing itself.

Story idea:
{request.input_text}"""
    return StreamingResponse(stream_gemini_response(prompt), media_type="text/plain")


@app.post("/api/storyboard")
def generate_storyboard(request: SceneRequest):
    style_line = ""
    if request.genre or request.style_reference:
        style_line = f"Genre/tone: {request.genre}. Stylistic reference: {request.style_reference}.\nLet this genuinely shape shot scale, pacing, and composition choices.\n"

    prompt = f"""You are a storyboard artist and director's assistant. Convert this screenplay scene into a
shot-by-shot storyboard breakdown.

Format your response as a numbered list, one shot per line, using EXACTLY this format with no extra text:
1. [SHOT TYPE] Description of what's happening in the frame and how it flows into the next shot.
2. [SHOT TYPE] Description...

Use shot types like: WIDE, MEDIUM, CLOSE-UP, OVER-THE-SHOULDER, POV, EXTREME CLOSE-UP, TWO-SHOT.
Include 4 to 8 shots depending on scene length. Do not include any text before the first shot or after the last one.

{style_line}
Screenplay scene:
{request.input_text}"""
    return StreamingResponse(stream_gemini_response(prompt), media_type="text/plain")

class PrevisRequest(BaseModel):
    input_text: str
    category: str
    genre: str = ""
    style_reference: str = ""


CATEGORY_PROMPTS = {
    "camera-angles": "the camera angles to use — specify high, low, eye-level, Dutch, etc. for key moments, and explain the emotional effect of each choice.",
    "lens-recommendations": "specific lens choices for this scene, and how each lens affects the sense of space, intimacy, or distortion.",
    "camera-movement": "camera movement for this scene — static, pan, dolly, handheld, tracking — and what emotional energy each movement creates.",
    "blocking": "actor blocking for this scene — where characters physically stand and move, and what that reveals about their relationship or power dynamic.",
    "lighting-setup": "the lighting setup for this scene — light placement, quality, and mood, described in enough detail for a gaffer to execute.",
    "equipment": "the specific equipment needed to shoot this scene — tripods, gimbals, lighting gear, and any specialized rigs.",
}


@app.post("/api/previs")
def generate_previs(request: PrevisRequest):
    style_line = ""
    if request.genre or request.style_reference:
        style_line = f"Genre/tone: {request.genre}. Stylistic reference: {request.style_reference}.\nLet this genuinely shape your recommendations.\n"

    focus = CATEGORY_PROMPTS.get(request.category, "the technical planning for this scene.")

    prompt = f"""You are a cinematography and production planning assistant. For this scene, provide detailed
guidance on {focus}

{style_line}
Scene:
{request.input_text}"""
    return StreamingResponse(stream_gemini_response(prompt), media_type="text/plain")


class StyleRequest(BaseModel):
    input_text: str
    category: str


STYLE_CATEGORY_PROMPTS = {
    "grading": "the color-grading approach for this film — contrast, saturation, and tonal balance choices that create a consistent look.",
    "lighting-style": "the overall lighting philosophy for this film — soft and even, or harsh and dramatic — as a consistent visual approach.",
    "color-palette": "the film's color palette. End your response with a clearly labeled section formatted exactly like this (5 colors, real hex codes matching the described mood):\n\nCOLOR PALETTE:\n- Deep Teal (#0D2B2E) - shadows and cool base tones\n- Burnt Amber (#C1622D) - warm highlights and skin tones\n- Charcoal (#1A1A1A) - near-black contrast\n- Dusty Rose (#B87D6B) - accent warmth\n- Pale Gold (#E8C68A) - practical light sources",
    "lens-philosophy": "the lens choices used throughout this film and the visual character they create — depth, distortion, intimacy, or scale.",
    "cinematographic-references": "films or cinematographers whose visual language should inform this project, and why they fit.",
    "camera-movement-philosophy": "the film's general approach to camera movement — handheld and kinetic, or locked-off and formal — as a consistent visual signature.",
}


@app.post("/api/style")
def generate_style(request: StyleRequest):
    focus = STYLE_CATEGORY_PROMPTS.get(request.category, "the visual style for this film.")

    prompt = f"""You are a cinematography and visual style consultant. Based on this description of the
film's intended visual identity, provide detailed guidance on {focus}

Style reference / film description:
{request.input_text}"""
    return StreamingResponse(stream_gemini_response(prompt), media_type="text/plain")


class AssistantRequest(BaseModel):
    input_text: str
    mode: str = "analyze"


@app.post("/api/assistant")
def ai_assistant(request: AssistantRequest):
    prompt = f"""You are a creative writing assistant and filmmaking advisor for Velvet Pavilion, an AI-powered pre-production studio.

A user has shared the following writing with you. Analyze it and provide:
1. **Scene Direction Ideas** — Suggest 2–3 ways the scene could develop or be staged visually.
2. **Character Development** — Note any characters present and suggest depth, backstory hooks, or emotional beats.
3. **Visual & Cinematic Suggestions** — Recommend camera work, lighting, color palette, or visual motifs that would suit the tone.
4. **Tone Refinements** — Comment on the current tone and suggest small adjustments to sharpen it.

Be concise, insightful, and specific to their writing. Write as a supportive creative collaborator.

User's writing:
{request.input_text}"""
    return StreamingResponse(stream_gemini_response(prompt), media_type="text/plain")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# ── Serve React frontend in production ──
# If a `static` directory exists (built by Docker), serve it
STATIC_DIR = Path(__file__).parent / "static"
if STATIC_DIR.is_dir():
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        """Serve built React frontend — falls back to index.html for client-side routing."""
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")

    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="static-assets")