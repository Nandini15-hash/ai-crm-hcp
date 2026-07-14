from sqlalchemy import Column, Integer, String, Text
from database.database import Base


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(200))
    interaction_type = Column(String(100))
    topics = Column(Text)
    notes = Column(Text)
    follow_up = Column(String(100))