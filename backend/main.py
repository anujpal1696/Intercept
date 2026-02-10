from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

from ai import ask_ai
from sessions import create_session, add_message, get_history
from voice import speech_to_text, text_to_speech

app = FastAPI()

# ===== CORS (VERY IMPORTANT) =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== create folder =====
if not os.path.exists("temp_audio"):
    os.makedirs("temp_audio")

# ===== START INTERVIEW =====
@app.post("/start")
def start(profile: str = Form(...), job: str = Form(...)):

    system_prompt = f"""
You are a professional AI interviewer.

Candidate profile: {profile}
Job role: {job}

Rules:
- Ask one question at a time
- Ask follow-up
- After 5 questions give score
- Give hiring decision
"""

    session_id = create_session(system_prompt)

    first_msg = "Interview starting. Tell me about yourself."
    add_message(session_id, "assistant", first_msg)

    path, filename = text_to_speech(first_msg)

    return {
        "session_id": session_id,
        "text": first_msg,
        "audio": f"/audio/{filename}"
    }

# ===== VOICE CHAT =====
@app.post("/voice")
async def voice(session_id: str = Form(...), file: UploadFile = File(...)):

    temp_name = f"temp_{uuid.uuid4().hex}.wav"
    temp_path = os.path.join("temp_audio", temp_name)

    with open(temp_path, "wb") as f:
        f.write(await file.read())

    user_text = speech_to_text(temp_path)
    os.remove(temp_path)

    add_message(session_id, "user", user_text)

    history = get_history(session_id)
    reply = ask_ai(history)

    add_message(session_id, "assistant", reply)

    path, filename = text_to_speech(reply)

    return {
        "user_text": user_text,
        "ai_text": reply,
        "audio": f"/audio/{filename}"
    }

# ===== GET AUDIO =====
@app.get("/audio/{filename}")
def get_audio(filename: str):
    path = os.path.join("temp_audio", filename)
    return FileResponse(path, media_type="audio/mpeg")

@app.post("/text")
def text_chat(session_id: str = Form(...), text: str = Form(...)):

    add_message(session_id, "user", text)

    history = get_history(session_id)
    reply = ask_ai(history)

    add_message(session_id, "assistant", reply)

    path, filename = text_to_speech(reply)

    return {
        "ai_text": reply,
        "audio": f"/audio/{filename}"
    }
