import os
import json
from typing import TypedDict

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END

from tools.log_interaction import log_interaction

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0,
)


class AgentState(TypedDict):
    prompt: str
    response: str


def chatbot(state: AgentState):
    prompt = f"""
You are an AI CRM assistant for pharmaceutical sales.

Extract the interaction details from the user's message.

Return ONLY valid JSON.

Format:

{{
    "hcp_name": "",
    "interaction_type": "Meeting",
    "topics": "",
    "notes": "",
    "follow_up": ""
}}

User Message:
{state["prompt"]}
"""

    reply = llm.invoke(prompt)

    content = reply.content.strip()

    # Remove markdown if present
    if content.startswith("```json"):
        content = content.replace("```json", "").replace("```", "").strip()
    elif content.startswith("```"):
        content = content.replace("```", "").strip()

    try:
        data = json.loads(content)
    except Exception:
        return {
            "response": "AI could not extract structured information."
        }

    result = log_interaction(data)

    return {
        "response": result["message"]
    }


graph = StateGraph(AgentState)

graph.add_node("chatbot", chatbot)

graph.set_entry_point("chatbot")

graph.add_edge("chatbot", END)

crm_agent = graph.compile()