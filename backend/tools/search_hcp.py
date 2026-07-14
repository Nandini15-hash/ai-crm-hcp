from database.database import SessionLocal
from database.models import Interaction


def search_hcp(hcp_name: str):
    db = SessionLocal()

    interactions = (
        db.query(Interaction)
        .filter(Interaction.hcp_name.ilike(f"%{hcp_name}%"))
        .all()
    )

    results = []

    for item in interactions:
        results.append({
            "id": item.id,
            "hcp_name": item.hcp_name,
            "interaction_type": item.interaction_type,
            "topics": item.topics,
            "notes": item.notes,
            "follow_up": item.follow_up
        })

    db.close()

    return results