from database.database import SessionLocal
from database.models import Interaction


def log_interaction(data: dict):
    db = SessionLocal()

    interaction = Interaction(
        hcp_name=data.get("hcp_name", ""),
        interaction_type=data.get("interaction_type", "Meeting"),
        topics=data.get("topics", ""),
        notes=data.get("notes", ""),
        follow_up=data.get("follow_up", "")
    )

    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    interaction_id = interaction.id

    db.close()

    return {
        "success": True,
        "interaction_id": interaction_id,
        "message": "Interaction saved successfully."
    }