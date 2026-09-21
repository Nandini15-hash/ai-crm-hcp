from database.database import SessionLocal
from database.models import Interaction

# FastAPI's docs UI ("Try it out") pre-fills every string field with the
# literal word "string" when someone tests an endpoint without changing the
# example — these are the values we don't want showing up as real reminders.
JUNK_VALUES = {"", "string", "na", "n/a", "none"}


def get_followups():
    db = SessionLocal()

    interactions = db.query(Interaction).all()

    followups = []

    for item in interactions:
        follow_up = (item.follow_up or "").strip()

        if follow_up.lower() in JUNK_VALUES:
            continue

        followups.append({
            "id": item.id,
            "hcp_name": item.hcp_name,
            "follow_up": follow_up,
            "notes": item.notes
        })

    db.close()

    return followups
