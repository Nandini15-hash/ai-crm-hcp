import os
import json
from typing import TypedDict, Optional

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END

from database.database import SessionLocal
from database.models import Interaction

from tools.log_interaction import log_interaction
from tools.edit_interaction import edit_interaction
from tools.search_hcp import search_hcp
from tools.followups import get_followups
from tools.visit_summary import generate_visit_summary

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
)


class AgentState(TypedDict):
    prompt: str
    action: str
    params: dict
    response: str


# This is the piece that was missing before: instead of always assuming the
# user wants to log a new interaction, the LLM first decides WHICH of the
# five tools the message is actually asking for, plus whatever details it
# needs to run that tool.
ROUTER_PROMPT = """
You are the routing brain for an AI CRM assistant used by pharmaceutical sales reps.

Decide which ONE action the user's message is asking for, and pull out the
details needed for that action. Reply with ONLY valid JSON, no commentary,
in exactly this shape:

{{
  "action": "log" | "edit" | "search" | "followup" | "summary",
  "hcp_name": "",
  "interaction_type": "Meeting",
  "topics": "",
  "notes": "",
  "follow_up": "",
  "update_notes": ""
}}

Guidance on choosing "action":
- "log": the user is describing a NEW visit/call/email with a doctor that should be recorded.
- "edit": the user wants to CHANGE or UPDATE something about a previous interaction (e.g. "update the notes for Dr. Rao", "change the follow-up for...").
- "search": the user is asking to LOOK UP a specific doctor's interaction history (e.g. "what have we discussed with Dr. Mehta", "show interactions with...").
- "followup": the user is asking about PENDING or UPCOMING follow-ups/reminders in general (not one specific doctor's full history).
- "summary": the user is asking for OVERALL stats — total visits, which doctors have been visited.

Field notes:
- "hcp_name": the doctor/HCP's name mentioned, if any. Required for "log", "edit", and "search".
- For "log": fill interaction_type/topics/notes/follow_up from the message as best you can. follow_up should be a date in YYYY-MM-DD form if one is mentioned, otherwise leave it blank.
- For "edit": put whatever the user wants changed into "update_notes" as a short plain-English note (e.g. "follow-up moved to next Friday"), and leave interaction_type/topics/notes/follow_up blank.
- For "followup" and "summary": hcp_name and the other fields can be left blank.

User Message:
{prompt}
"""

VALID_ACTIONS = {"log", "edit", "search", "followup", "summary"}


def classify(state: AgentState) -> dict:
    reply = llm.invoke(ROUTER_PROMPT.format(prompt=state["prompt"]))
    content = reply.content.strip()

    # Remove markdown fencing if the model wraps its JSON in ```json ... ```
    if content.startswith("```"):
        content = content.strip("`")
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()

    try:
        data = json.loads(content)
    except Exception:
        return {"action": "unknown", "params": {}}

    action = data.get("action", "unknown")
    if action not in VALID_ACTIONS:
        action = "unknown"

    return {"action": action, "params": data}


def do_log(state: AgentState) -> dict:
    params = state["params"]

    result = log_interaction({
        "hcp_name": params.get("hcp_name", ""),
        "interaction_type": params.get("interaction_type") or "Meeting",
        "topics": params.get("topics", ""),
        "notes": params.get("notes", ""),
        "follow_up": params.get("follow_up", ""),
    })

    return {"response": result["message"]}


def do_search(state: AgentState) -> dict:
    hcp_name = state["params"].get("hcp_name", "").strip()

    if not hcp_name:
        return {"response": "Which HCP would you like me to search for?"}

    results = search_hcp(hcp_name)

    if not results:
        return {"response": f"No interactions found for '{hcp_name}'."}

    lines = [
        f"- {r['interaction_type']} on '{r['topics']}': {r['notes']}"
        for r in results
    ]

    return {
        "response": f"Found {len(results)} interaction(s) with {hcp_name}:\n" + "\n".join(lines)
    }


def _find_latest_interaction_id(hcp_name: str) -> Optional[int]:
    # Chat users refer to a doctor by name, not by internal interaction ID —
    # this looks up their most recent logged interaction so "edit" can act
    # on it without the user ever needing to know an ID.
    db = SessionLocal()
    interaction = (
        db.query(Interaction)
        .filter(Interaction.hcp_name.ilike(f"%{hcp_name}%"))
        .order_by(Interaction.id.desc())
        .first()
    )
    db.close()
    return interaction.id if interaction else None


def do_edit(state: AgentState) -> dict:
    params = state["params"]
    hcp_name = params.get("hcp_name", "").strip()
    update_notes = params.get("update_notes", "").strip()

    if not hcp_name:
        return {"response": "Which HCP's interaction would you like to edit?"}

    interaction_id = _find_latest_interaction_id(hcp_name)
    if interaction_id is None:
        return {"response": f"No existing interaction found for '{hcp_name}' to edit."}

    if not update_notes:
        return {"response": "I couldn't tell what to change — try being specific, e.g. 'update notes for Dr. Rao to say discussed pricing'."}

    # We fold the free-text change into the notes field rather than guessing
    # which structured column (topics vs. follow_up vs. notes) the user meant.
    result = edit_interaction(interaction_id, {"notes": update_notes})

    return {"response": result["message"]}


def do_followup(state: AgentState) -> dict:
    followups = get_followups()

    if not followups:
        return {"response": "No pending follow-ups."}

    lines = [f"- {f['hcp_name']}: due {f['follow_up']} ({f['notes']})" for f in followups]

    return {"response": f"You have {len(followups)} pending follow-up(s):\n" + "\n".join(lines)}


def do_summary(state: AgentState) -> dict:
    summary = generate_visit_summary()
    doctors = ", ".join(summary["doctors_visited"]) or "none yet"

    return {
        "response": f"Total visits logged: {summary['total_visits']}. Doctors visited: {doctors}."
    }


def do_unknown(state: AgentState) -> dict:
    return {
        "response": "I couldn't tell what you'd like to do — try logging a visit, searching a doctor, asking about follow-ups, or asking for a summary."
    }


graph = StateGraph(AgentState)

graph.add_node("classify", classify)
graph.add_node("log", do_log)
graph.add_node("search", do_search)
graph.add_node("edit", do_edit)
graph.add_node("followup", do_followup)
graph.add_node("summary", do_summary)
graph.add_node("unknown", do_unknown)

graph.set_entry_point("classify")

graph.add_conditional_edges(
    "classify",
    lambda state: state["action"],
    {
        "log": "log",
        "search": "search",
        "edit": "edit",
        "followup": "followup",
        "summary": "summary",
        "unknown": "unknown",
    },
)

for node in ["log", "search", "edit", "followup", "summary", "unknown"]:
    graph.add_edge(node, END)

crm_agent = graph.compile()
