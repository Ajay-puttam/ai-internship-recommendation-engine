from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.internship import Internship
from app.schemas.internship import InternshipResponse

router = APIRouter(prefix="/api/internships", tags=["Internships"])


@router.get("", response_model=List[InternshipResponse])
def list_internships(
    domain: Optional[str] = Query(None, description="Filter by domain (e.g., AI, Web Development)"),
    mode: Optional[str] = Query(None, description="Filter by mode: remote | onsite | hybrid"),
    location: Optional[str] = Query(None, description="Filter by location keyword"),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    """List internships with optional filters."""
    query = db.query(Internship)
    if domain:
        query = query.filter(Internship.domain.ilike(f"%{domain}%"))
    if mode:
        query = query.filter(Internship.mode == mode)
    if location:
        query = query.filter(Internship.location.ilike(f"%{location}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/{internship_id}", response_model=InternshipResponse)
def get_internship(internship_id: str, db: Session = Depends(get_db)):
    """Get a single internship by ID."""
    from fastapi import HTTPException, status
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Internship not found.")
    return internship
