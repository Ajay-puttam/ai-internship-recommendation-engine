import uuid
from sqlalchemy import Column, String, Text, Integer, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Internship(Base):
    __tablename__ = "internships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    domain = Column(String(100))
    skills_required = Column(ARRAY(String), default=[])
    description = Column(Text)
    location = Column(String(255))
    mode = Column(String(50))       # "remote", "onsite", "hybrid"
    duration = Column(String(100))  # e.g., "2 months"
    stipend = Column(String(100))   # e.g., "₹15,000/month"
    apply_link = Column(Text)
    source = Column(String(100))    # "kaggle", "pm_internship_scheme", "manual"
