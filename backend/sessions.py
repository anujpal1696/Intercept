import uuid

sessions = {}

def create_session(system_prompt):
    session_id = str(uuid.uuid4())
    sessions[session_id] = [
        {"role": "system", "content": system_prompt}
    ]
    return session_id

def add_message(session_id, role, content):
    sessions[session_id].append({
        "role": role,
        "content": content
    })

def get_history(session_id):
    return sessions.get(session_id, [])
