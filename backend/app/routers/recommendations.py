from fastapi import APIRouter, Depends
from app.models.user import User
from app.core.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

# ─────────────────────────────────────────────────────────────────────────────
# PLACEHOLDER — AI recommendation engine not yet implemented.
# Future: Replace this with a hybrid collaborative + content-based ML model.
# Steps to integrate:
#   1. Load user profile from DB (skills, interests, location, mode)
#   2. Parse resume using NLP (spaCy / HuggingFace)
#   3. Compute similarity scores between user vector and internship embeddings
#   4. Return top 3–5 ranked matches with score and reason tokens
# ─────────────────────────────────────────────────────────────────────────────

DUMMY_RECOMMENDATIONS = [
    {
        "id": "rec-001",
        "title": "Machine Learning Intern",
        "company": "TechCorp AI",
        "location": "Bangalore (Remote)",
        "duration": "3 months",
        "stipend": "₹20,000/month",
        "match_score": 92,
        "domain": "AI / Machine Learning",
        "skills_required": ["Python", "TensorFlow", "scikit-learn"],
        "apply_link": "https://example.com/apply/ml-intern",
        "reasons": [
            "Matches your AI interest",
            "Python skill match",
            "Available in preferred location",
        ],
    },
    {
        "id": "rec-002",
        "title": "Data Science Intern",
        "company": "DataWave Analytics",
        "location": "Remote",
        "duration": "2 months",
        "stipend": "₹15,000/month",
        "match_score": 87,
        "domain": "Data Science",
        "skills_required": ["Python", "Pandas", "SQL"],
        "apply_link": "https://example.com/apply/ds-intern",
        "reasons": [
            "Matches your Data Science interest",
            "SQL and Pandas skill alignment",
            "Remote — matches your preference",
        ],
    },
    {
        "id": "rec-003",
        "title": "Full Stack Developer Intern",
        "company": "BuildRight Technologies",
        "location": "Hyderabad",
        "duration": "6 months",
        "stipend": "₹18,000/month",
        "match_score": 79,
        "domain": "Web Development",
        "skills_required": ["React", "Node.js", "PostgreSQL"],
        "apply_link": "https://example.com/apply/fullstack-intern",
        "reasons": [
            "Matches your Web Development interest",
            "React skill match",
            "Stipend within expected range",
        ],
    },
]


@router.get("")
def get_recommendations(current_user: User = Depends(get_current_user)):
    """
    Returns AI-matched internship recommendations for the authenticated user.
    Currently returns curated dummy data — ML engine integration is pending.
    """
    return {
        "user": current_user.email,
        "total": len(DUMMY_RECOMMENDATIONS),
        "recommendations": DUMMY_RECOMMENDATIONS,
    }
