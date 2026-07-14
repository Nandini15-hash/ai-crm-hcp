from database.database import SessionLocal
from database.models import Interaction


def edit_interaction(interaction_id: int, updates: dict):
    db = SessionLocal()

    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()

    if not interaction:
        db.close()
        return {
            "success": False,
            "message": "Interaction not found."
        }

    if "hcp_name" in updates:
        interaction.hcp_name = updates["hcp_name"]

    if "interaction_type" in updates:
        interaction.interaction_type = updates["interaction_type"]

    if "topics" in updates:
        interaction.topics = updates["topics"]

    if "notes" in updates:
        interaction.notes = updates["notes"]

    if "follow_up" in updates:
        interaction.follow_up = updates["follow_up"]

    db.commit()
    db.refresh(interaction)

    db.close()

    return {
        "success": True,
        "message": "Interaction updated successfully.",
        "interaction_id": interaction.id
    }