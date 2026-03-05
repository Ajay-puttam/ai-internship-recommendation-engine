from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/api/profile", tags=["Profile"])


@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_profile(
    payload: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create or update the authenticated user's profile (upsert)."""
    try:
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()

        if profile:
            # Update existing profile
            for field, value in payload.model_dump().items():
                setattr(profile, field, value)
        else:
            # Create new profile
            profile = Profile(user_id=current_user.id, **payload.model_dump())
            db.add(profile)

        db.commit()
        db.refresh(profile)
        return profile
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e


@router.get("", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated user's profile."""
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found. Please complete setup.")
    return profile
