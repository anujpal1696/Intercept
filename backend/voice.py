# voice.py
from gtts import gTTS
import uuid
import os

TEMP_DIR = "temp_audio"

# We no longer need backend speech-to-text
# Browser already converts speech → text
def speech_to_text(path):
    return ""  # not used anymore


# Text → voice
def text_to_speech(text):
    filename = f"{uuid.uuid4().hex}.mp3"
    filepath = os.path.join(TEMP_DIR, filename)

    tts = gTTS(text=text, lang="en")
    tts.save(filepath)

    return filepath, filename
