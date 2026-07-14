from database.database import SessionLocal
from database.models import Interaction


def generate_visit_summary():
    db = SessionLocal()

    interactions = db.query(Interaction).all()

    total_visits = len(interactions)

    doctors = []

    for item in interactions:
        doctors.append(item.hcp_name)

    db.close()

    return {
        "total_visits": total_visits,
        "doctors_visited": doctors
    }