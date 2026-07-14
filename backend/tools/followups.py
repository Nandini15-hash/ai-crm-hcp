from database.database import SessionLocal
from database.models import Interaction


def get_followups():
    db = SessionLocal()

    interactions = db.query(Interaction).all()

    followups = []

    for item in interactions:
        followups.append({
            "id": item.id,
            "hcp_name": item.hcp_name,
            "follow_up": item.follow_up,
            "notes": item.notes
        })

    db.close()

    return followups