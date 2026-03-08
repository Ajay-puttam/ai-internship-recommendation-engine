from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from app.models.user import User
from app.core.dependencies import get_current_user

from app.recommender import engine
from app.schemas.recommendation import RecommendationResponse, RecommendationItem

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get(
    "",
    response_model=RecommendationResponse,
)
def get_recommendations(
    skills: str = Query(
        ...,
        description="User skills and interests (comma or space separated).",
    ),
    domain: Optional[str] = Query(
        None,
        description="Desired internship domain (optional).",
    ),
    location_region: Optional[str] = Query(
        None,
        description="Preferred location region (optional).",
    ),
    experience: Optional[str] = Query(
        None,
        description="Preferred experience level (optional).",
    ),
    current_user: User = Depends(get_current_user),
) -> RecommendationResponse:
    """
    Return AI-based internship recommendations for the authenticated user.

    The endpoint requires authentication via get_current_user. Recommendations
    are generated using semantic embeddings, FAISS vector search, rule-based
    filtering, and weighted ranking.
    """
    try:
        results = engine.recommend(
            skills=skills,
            domain=domain,
            location_region=location_region,
            experience=experience,
            top_k=5,
        )
    except ValueError as exc:
        # e.g., empty skills query
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail="Internship dataset not found on the server.",
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail="Recommendation engine not initialized.",
        ) from exc
    except Exception as exc:  # pragma: no cover - defensive catch-all
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while generating recommendations.",
        ) from exc

    items = [RecommendationItem(**item) for item in results]

    return RecommendationResponse(
        skills_query=skills,
        total=len(items),
        recommendations=items,
    )

