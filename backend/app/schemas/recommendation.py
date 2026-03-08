from typing import List

from pydantic import BaseModel


class RecommendationItem(BaseModel):
    """
    Single internship recommendation item returned by the API.
    """

    title: str
    company: str
    domain: str
    location_region: str
    similarity_score: float
    skill_match_score: float
    final_score: float
    stipend: str
    job_type: str
    apply_link: str


class RecommendationResponse(BaseModel):
    """
    Response model for internship recommendations.
    """

    skills_query: str
    total: int
    recommendations: List[RecommendationItem]

