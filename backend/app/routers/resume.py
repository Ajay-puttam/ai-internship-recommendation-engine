from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.models.user import User
from app.core.dependencies import get_current_user
from app.recommender.recommendation_engine import engine
from app.resume.resume_parser import extract_text_from_pdf
from app.resume.skill_extractor import extract_skills_from_text
from app.resume.skill_gap_analyzer import find_skill_gaps
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resume", tags=["Resume Analysis"])


@router.post("/analyze", summary="Analyze Resume and Generate Recommendations")
async def analyze_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a resume PDF to extract skills and find internship recommendations.
    Provides skill gap analysis comparing user skills with internship requirements.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        # Step 1: Extract text
        text = await extract_text_from_pdf(file)
        if not text:
             raise HTTPException(status_code=400, detail="Could not extract text from the provided PDF. It might be empty or scanned.")

        # Step 2: Extract skills
        extracted_skills = extract_skills_from_text(text)
        
        if not extracted_skills:
            return {
                "extracted_skills": [],
                "recommendations": [],
                "message": "No recognized technical skills found in the resume. Try listing specific technologies and frameworks."
            }

        skills_query = ", ".join(extracted_skills)

        # Step 3: Run recommendation engine
        try:
            results = engine.recommend(
                skills=skills_query,
                top_k=5,
            )
        except Exception as e:
            logger.error(f"Recommendation engine error during resume analysis: {e}")
            raise HTTPException(status_code=500, detail="Error generating recommendations.")

        import ast
        # Step 4 & 5: Compare user skills with internship skills (Gap Analysis)
        recommendations_with_gaps = []
        for res in results:
            internship_skills_str = res.get("skills_required", "")
            
            # Use ast to safely parse stringified python list format `['python', 'java']`
            parsed_internship_skills = []
            if internship_skills_str:
                try:
                    evaluated = ast.literal_eval(internship_skills_str)
                    if isinstance(evaluated, list):
                        parsed_internship_skills = evaluated
                    else:
                        parsed_internship_skills = internship_skills_str.split(",")
                except (ValueError, SyntaxError):
                    parsed_internship_skills = internship_skills_str.split(",")

            # Normalize user skills and internship skills to lowercase for accurate set comparison
            user_set = {s.strip().lower() for s in extracted_skills if s.strip()}
            internship_skills_set = {str(s).strip().lower() for s in parsed_internship_skills if str(s).strip()}
            
            # Matched skills are those in both sets
            matched_skills = sorted(list(internship_skills_set.intersection(user_set)))
            
            # Missing skills are those in internship required but NOT in user skills
            missing_skills = sorted(list(internship_skills_set - user_set))

            rec = {
                "id": res.get("id"),
                "title": res.get("title"),
                "company": res.get("company"),
                "location_type": res.get("location_type"),
                "location_region": res.get("location_region"),
                "experience": res.get("experience"),
                "domain": res.get("domain"),
                "skills_required": internship_skills_str,
                "match_score": res.get("final_score", 0),
                "matched_skills": matched_skills,
                "missing_skills": missing_skills
            }
            recommendations_with_gaps.append(rec)

        return {
            "extracted_skills": extracted_skills,
            "recommendations": recommendations_with_gaps
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))
