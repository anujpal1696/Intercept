import google.generativeai as genai

def ask_ai(messages, api_key):
    """
    Uses USER provided Gemini API key
    """

    # configure using user's key
    genai.configure(api_key=api_key)

    # use stable fast model
    model = genai.GenerativeModel( "gemini-3-flash-preview")

    # convert history → conversation
    convo = ""
    for m in messages:
        role = "Interviewer" if m["role"] == "assistant" else "Candidate"
        convo += f"{role}: {m['content']}\n"

    prompt = f"""
You are a professional job interviewer.

Rules:
- Ask only one question at a time
- Ask based on candidate answers
- Be realistic like real interviewer
- After 5 questions give score + hiring decision

Interview:
{convo}

Next interviewer question:
"""

    response = model.generate_content(prompt)
    return response.text
