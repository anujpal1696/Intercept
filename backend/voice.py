# voice.py FINAL STABLE VERSION
from gtts import gTTS
import uuid
import os

TEMP_DIR = "temp_audio"

# ===== SPEECH TO TEXT (simple for now) =====
def speech_to_text(path):
    # for now we return dummy text
    # later we connect real Gemini speech
    return "My name is Anuj and I am a developer"

# ===== TEXT TO SPEECH =====
def text_to_speech(text):
    filename = f"{uuid.uuid4().hex}.mp3"
    filepath = os.path.join(TEMP_DIR, filename)

    tts = gTTS(text=text, lang="en")
    tts.save(filepath)

    return filepath, filename
