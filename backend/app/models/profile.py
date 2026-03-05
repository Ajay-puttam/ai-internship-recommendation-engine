import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    degree = Column(String(100))
    branch = Column(String(100))
    college = Column(String(255))
    skills = Column(ARRAY(String), default=[])
    interests = Column(ARRAY(String), default=[])
    location_preference = Column(String(255))
    internship_mode = Column(String(50))  # "remote", "onsite", "hybrid"
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
