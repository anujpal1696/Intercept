import uuid

sessions = {}

# create session + store user gemini key
def create_session(system_prompt, api_key):
    session_id = str(uuid.uuid4())

    sessions[session_id] = {
        "history": [
            {"role": "system", "content": system_prompt}
        ],
        "api_key": api_key
    }

    return session_id


# add chat message
def add_message(session_id, role, content):
    sessions[session_id]["history"].append({
        "role": role,
        "content": content
    })


# get chat history
def get_history(session_id):
    return sessions.get(session_id, {}).get("history", [])


# get user's gemini api key
def get_key(session_id):
    return sessions.get(session_id, {}).get("api_key")
