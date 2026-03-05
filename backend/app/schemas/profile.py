from typing import List, Optional
from pydantic import BaseModel


class ProfileCreate(BaseModel):
    degree: Optional[str] = None
    branch: Optional[str] = None
    college: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    location_preference: Optional[str] = None
    internship_mode: Optional[str] = None  # "remote" | "onsite" | "hybrid"


from uuid import UUID

class ProfileResponse(ProfileCreate):
    user_id: UUID

    class Config:
        from_attributes = True
