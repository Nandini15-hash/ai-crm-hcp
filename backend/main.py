from tools.visit_summary import generate_visit_summary
from tools.followups import get_followups
from tools.search_hcp import search_hcp
from tools.edit_interaction import edit_interaction
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.database import Base, engine, SessionLocal
from database.models import Interaction
from agents.agent import crm_agent

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-First CRM HCP API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://ai-crm-hcp-chi.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Vercel's Python runtime does not reliably let CORSMiddleware auto-answer
# the CORS preflight OPTIONS request before it falls through to normal
# routing (which then 405s, since no route explicitly handles OPTIONS).
# This catch-all makes sure every path has an OPTIONS handler; the
# middleware above still attaches the actual CORS headers to its response.
from fastapi import Response


@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return Response(status_code=204)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Request Models
class ChatRequest(BaseModel):
    prompt: str


class InteractionRequest(BaseModel):
    hcp_name: str
    interaction_type: str
    topics: str
    notes: str
    follow_up: str

class EditInteractionRequest(BaseModel):
    interaction_id: int
    updates: dict

# Home
@app.get("/")
def home():
    return {
        "message": "AI-First CRM HCP Backend is Running 🚀"
    }


# Health
@app.get("/health")
def health():
    return {
        "status": "success"
    }


# AI Chat
@app.post("/chat")
def chat(request: ChatRequest):
    result = crm_agent.invoke(
        {
            "prompt": request.prompt,
            "response": ""
        }
    )

    return {
        "response": result["response"]
    }


# Save Interaction
@app.post("/interaction")
def save_interaction(
    interaction: InteractionRequest,
    db: Session = Depends(get_db)
):
    new_interaction = Interaction(
        hcp_name=interaction.hcp_name,
        interaction_type=interaction.interaction_type,
        topics=interaction.topics,
        notes=interaction.notes,
        follow_up=interaction.follow_up,
    )

    db.add(new_interaction)
    db.commit()
    db.refresh(new_interaction)

    return {
        "message": "Interaction saved successfully.",
        "id": new_interaction.id
    }


# Get All Interactions
@app.get("/interactions")
def get_interactions(db: Session = Depends(get_db)):
    interactions = db.query(Interaction).all()

    return interactions

@app.put("/interaction")
def update_interaction(request: EditInteractionRequest):
    result = edit_interaction(
        request.interaction_id,
        request.updates
    )

    return result

@app.get("/search-hcp/{hcp_name}")
def search_hcp_endpoint(hcp_name: str):
    results = search_hcp(hcp_name)

    return {
        "count": len(results),
        "results": results
    }

@app.get("/followups")
def followup_list():
    return {
        "followups": get_followups()
    }

@app.get("/visit-summary")
def visit_summary():
    return generate_visit_summary()

@app.delete("/interaction/{interaction_id}")
def delete_interaction(interaction_id: int):
    db = SessionLocal()

    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()

    if not interaction:
        db.close()
        return {"success": False, "message": "Interaction not found"}

    db.delete(interaction)
    db.commit()
    db.close()

    return {
        "success": True,
        "message": "Interaction deleted successfully."
    }