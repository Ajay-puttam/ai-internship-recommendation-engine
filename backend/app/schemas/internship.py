from typing import List, Optional
from pydantic import BaseModel


class InternshipResponse(BaseModel):
    id: str
    title: str
    company: str
    domain: Optional[str] = None
    skills_required: List[str] = []
    description: Optional[str] = None
    location: Optional[str] = None
    mode: Optional[str] = None
    duration: Optional[str] = None
    stipend: Optional[str] = None
    apply_link: Optional[str] = None
    source: Optional[str] = None

    class Config:
        from_attributes = True
