from typing import List, Optional

import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


def _normalize_skill_token(skill: str) -> str:
    """
    Normalize a skill string by stripping whitespace and lowercasing.

    Args:
        skill (str): Raw skill string.

    Returns:
        str: Normalized skill string.
    """
    return skill.strip().lower()


def _tokenize(skill: str) -> List[str]:
    """
    Tokenize a skill into space-separated tokens.

    Args:
        skill (str): Skill phrase (e.g., "machine learning").

    Returns:
        List[str]: List of tokens.
    """
    return [t for t in _normalize_skill_token(skill).split() if t]


def skill_match_score(user_skills: str, internship_skills: str) -> float:
    """
    Compute overlap between user skills and internship skills.

    Steps:
        1. Split both strings by comma and strip whitespace.
        2. Lowercase all skills.
        3. Check exact matches AND partial matches (token overlap).
        4. score = (exact_matches + 0.5 * partial_matches) / len(required_skills)
        5. Return min(score, 1.0)

    Example:
        user_skills       = "python, machine learning, tensorflow"
        internship_skills = "python, deep learning, tensorflow, keras"
        exact_matches     = python, tensorflow = 2
        partial_matches   = machine learning ≈ deep learning = 1
        score             = (2 + 0.5*1) / 4 = 0.625

    Args:
        user_skills (str): Comma-separated user skills string.
        internship_skills (str): Comma-separated internship required skills string.

    Returns:
        float: Skill match score in [0.0, 1.0].
    """
    if not internship_skills:
        return 0.0

    user_parts = [
        _normalize_skill_token(s)
        for s in user_skills.split(",")
        if _normalize_skill_token(s)
    ]
    required_parts = [
        _normalize_skill_token(s)
        for s in internship_skills.split(",")
        if _normalize_skill_token(s)
    ]

    if not required_parts:
        return 0.0

    exact_matches = 0
    partial_matches = 0

    user_tokens_list = [_tokenize(s) for s in user_parts]

    for req_skill in required_parts:
        req_tokens = _tokenize(req_skill)
        matched_exact = False
        matched_partial = False

        for user_skill, user_tokens in zip(user_parts, user_tokens_list):
            # Exact match on normalized phrase
            if user_skill == req_skill:
                matched_exact = True
                break

            # Partial match via token overlap (e.g., machine learning vs deep learning)
            if req_tokens and user_tokens:
                token_overlap = set(req_tokens) & set(user_tokens)
                if any(len(tok) > 2 for tok in token_overlap):
                    matched_partial = True

        if matched_exact:
            exact_matches += 1
        elif matched_partial:
            partial_matches += 1

    score = (exact_matches + 0.5 * partial_matches) / float(len(required_parts))
    return float(min(score, 1.0))


def compute_score(
    similarity: float,
    skill_match: float,
    location_match: float,
    experience_match: float,
) -> float:
    """
    Compute the final recommendation score using weighted components.

    Args:
        similarity (float): Cosine similarity from FAISS (0.0–1.0).
        skill_match (float): Skill match score (0.0–1.0).
        location_match (float): Location match score (0.0–1.0).
        experience_match (float): Experience match score (0.0–1.0).

    Returns:
        float: Final weighted score.
    """
    return (
        0.40 * similarity
        + 0.35 * skill_match
        + 0.15 * location_match
        + 0.10 * experience_match
    )


def _location_match_score(
    internship_location: str,
    query_location: Optional[str],
) -> float:
    """
    Compute location match score according to specified rules.

    Rules when query_location is provided:
        - exact region match  → 1.0
        - remote internship   → 0.9
        - unknown location    → 0.5
        - different region    → 0.2

    If query_location is None, a neutral weighting is applied:
        - remote internship   → 0.9
        - unknown location    → 0.5
        - any other location  → 0.5

    Args:
        internship_location (str): Internship location_region value.
        query_location (Optional[str]): User preferred location region.

    Returns:
        float: Location match score.
    """
    loc = (internship_location or "").strip().lower()
    qloc = (query_location or "").strip().lower()

    is_remote = "remote" in loc
    is_unknown = loc in {"unknown", ""}

    if not qloc:
        if is_remote:
            return 0.9
        if is_unknown:
            return 0.5
        return 0.5

    if loc == qloc:
        return 1.0
    if is_remote:
        return 0.9
    if is_unknown:
        return 0.5
    return 0.2


def _experience_match_score(
    internship_experience: str,
    query_experience: Optional[str],
) -> float:
    """
    Compute experience match score according to specified rules.

    Rules:
        - exact match         → 1.0
        - no experience req   → 0.8  (always acceptable)
        - mismatch            → 0.3

    If query_experience is None, a neutral weighting is applied:
        - no experience req   → 0.8
        - any other           → 0.5

    Args:
        internship_experience (str): Internship experience requirement value.
        query_experience (Optional[str]): User preferred experience level.

    Returns:
        float: Experience match score.
    """
    exp = (internship_experience or "").strip().lower()
    qexp = (query_experience or "").strip().lower()

    no_exp_phrases = {
        "no experience required",
        "no prior experience required",
        "fresher",
        "entry level",
    }
    is_no_exp = exp in no_exp_phrases

    if not qexp:
        if is_no_exp:
            return 0.8
        return 0.5

    if exp == qexp:
        return 1.0
    if is_no_exp:
        return 0.8
    return 0.3


def rank_results(
    candidates_df: pd.DataFrame,
    similarities: np.ndarray,
    user_skills: str,
    query_location: Optional[str],
    query_experience: Optional[str],
    top_n: int = 5,
) -> List[dict]:
    """
    Score, sort, and return the top N internships.

    Args:
        candidates_df (pd.DataFrame): Candidate internships after filtering.
            Must contain columns:
                - 'title', 'company', 'domain', 'location_region',
                  'skills_required', 'stipend', 'job_type', 'apply_link',
                  'experience', and 'similarity_score' (if not, similarities
                  array will be used to populate it).
        similarities (np.ndarray): Similarity scores aligned with candidates_df
            of shape (n_candidates,) or (1, n_candidates).
        user_skills (str): Raw user skills query string.
        query_location (Optional[str]): User preferred location region.
        query_experience (Optional[str]): User preferred experience level.
        top_n (int): Number of top results to return.

    Returns:
        List[dict]: List of top N internships with scoring details.
    """
    if candidates_df.empty:
        return []

    sims = similarities
    if sims.ndim == 2:
        sims = sims.reshape(-1)
    if len(sims) != len(candidates_df):
        logger.warning(
            "Length mismatch between candidates_df (%d) and similarities (%d). "
            "Falling back to candidates_df['similarity_score'] if present.",
            len(candidates_df),
            len(sims),
        )
        if "similarity_score" in candidates_df.columns:
            sims = candidates_df["similarity_score"].to_numpy()
        else:
            raise ValueError(
                "Cannot align similarities with candidates dataframe for ranking."
            )

    candidates = candidates_df.copy()
    candidates["similarity_score"] = sims

    location_scores: List[float] = []
    experience_scores: List[float] = []
    final_scores: List[float] = []
    skill_scores: List[float] = []

    for _, row in candidates.iterrows():
        similarity = float(row.get("similarity_score", 0.0))
        internship_skills = str(row.get("skills_required", "") or "")
        internship_location = str(row.get("location_region", "") or "")
        internship_experience = str(row.get("experience", "") or "")

        sm = skill_match_score(user_skills, internship_skills)
        lm = _location_match_score(internship_location, query_location)
        em = _experience_match_score(internship_experience, query_experience)
        score = compute_score(similarity, sm, lm, em)

        skill_scores.append(sm)
        location_scores.append(lm)
        experience_scores.append(em)
        final_scores.append(score)

    candidates["skill_match_score"] = skill_scores
    candidates["location_match_score"] = location_scores
    candidates["experience_match_score"] = experience_scores
    candidates["final_score"] = final_scores

    candidates = candidates.sort_values(by="final_score", ascending=False).head(top_n)

    results: List[dict] = []
    for _, row in candidates.iterrows():
        results.append(
            {
                "title": str(row.get("title", "")),
                "company": str(row.get("company", "")),
                "domain": str(row.get("domain", "")),
                "location_region": str(row.get("location_region", "")),
                "similarity_score": float(row.get("similarity_score", 0.0)),
                "skill_match_score": float(row.get("skill_match_score", 0.0)),
                "final_score": float(row.get("final_score", 0.0)),
                "stipend": str(row.get("stipend", "") or "not specified"),
                "job_type": str(row.get("job_type", "") or "internship"),
                "apply_link": ""
                if str(row.get("apply_link", "")) == "nan"
                else str(row.get("apply_link", "")),
            }
        )

    return results
