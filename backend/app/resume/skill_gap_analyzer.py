"""
skill_gap_analyzer.py — Compare user skills against internship requirements.

Produces the list of skills an internship requires that the user is missing.
"""

from typing import List


import ast

def find_skill_gaps(user_skills: List[str], internship_skills: str) -> List[str]:
    """
    Return the skills required by an internship that are absent from user_skills.

    Args:
        user_skills:        Skills extracted from the user's resume (already lowercased).
        internship_skills:  Raw string from the dataset column ``skills_required``.
                            Could be "skill1, skill2" or "['skill1', 'skill2']".

    Returns:
        Sorted list of missing skill strings (lowercased, stripped).
    """
    if not internship_skills:
        return []

    # Parse internship skills safely
    parsed_skills = []
    try:
        # Try to parse as a python list string like "['python', 'c++']"
        evaluated = ast.literal_eval(internship_skills)
        if isinstance(evaluated, list):
            parsed_skills = evaluated
        else:
            parsed_skills = internship_skills.split(",")
    except (ValueError, SyntaxError):
        # Fallback to simple comma splitting
        parsed_skills = internship_skills.split(",")

    # Normalize internship skills
    required: set[str] = {
        str(s).strip().lower()
        for s in parsed_skills
        if str(s).strip()
    }

    user_set: set[str] = {s.strip().lower() for s in user_skills if s.strip()}

    missing = sorted(required - user_set)
    return missing
