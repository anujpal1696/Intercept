import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key="AIzaSyAz8I5_8PvpaWVjvMKr6M8R4oS_UGiQ0eo")

model = genai.GenerativeModel("gemini-3-flash-preview",)

def ask_ai(messages):
    # convert chat history into text
    convo = ""
    for m in messages:
        role = "Interviewer" if m["role"] == "assistant" else "Candidate"
        convo += f"{role}: {m['content']}\n"

    prompt = f"""
You are a professional job interviewer.

Rules:
- Ask only one question at a time
- Ask based on candidate answers
- After 5 questions give score and hiring decision

Interview:
{convo}

Next interviewer question:
"""

    response = model.generate_content(prompt)
    return response.text
