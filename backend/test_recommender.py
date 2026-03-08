from app.recommender.recommendation_engine import engine


def run_tests() -> None:
    """
    Standalone test script for the recommendation engine.

    Runs a few sample queries and prints the top recommendations to stdout.
    """
    engine.startup()

    # Test 1 — basic query
    results = engine.recommend(skills="python machine learning")
    print("Test 1 — Basic query:")
    for r in results:
        print(f"  {r['title']} | {r['company']} | score: {r['final_score']:.3f}")

    # Test 2 — with domain filter
    results = engine.recommend(
        skills="web development react nodejs",
        domain="web development",
    )
    print("\nTest 2 — With domain filter:")
    for r in results:
        print(f"  {r['title']} | {r['company']} | score: {r['final_score']:.3f}")

    # Test 3 — with location filter
    results = engine.recommend(
        skills="data science python",
        location_region="india",
    )
    print("\nTest 3 — With location filter:")
    for r in results:
        print(f"  {r['title']} | {r['company']} | score: {r['final_score']:.3f}")


if __name__ == "__main__":
    run_tests()

"""
test_recommender.py
===================
Standalone script to verify the Phase-2 recommendation engine works
correctly WITHOUT starting the FastAPI server.

Run:
    cd backend
    venv\\Scripts\\activate          # Windows
    python test_recommender.py

Expected output:
    Top 5 recommendations for 'python machine learning':
    ---
    1. <title> | <company> | domain=<domain> | score=X.XXXX
    ...
"""

import logging
import sys
from pathlib import Path

# ── Ensure the backend package root is on sys.path ───────────────────────────
BACKEND_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_ROOT))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)

from app.recommender import engine  # noqa: E402


def run_test(
    skills: str,
    domain: str | None = None,
    location_region: str | None = None,
    experience: str | None = None,
) -> None:
    """Run a single recommendation query and pretty-print results."""
    print(f"\n{'='*60}")
    print(f"Query: skills='{skills}'  domain={domain!r}  "
          f"location={location_region!r}  experience={experience!r}")
    print("=" * 60)

    results = engine.recommend(
        skills=skills,
        domain=domain,
        location_region=location_region,
        experience=experience,
        top_k=5,
    )

    if not results:
        print("  ⚠  No recommendations returned.")
        return

    print(f"\nTop {len(results)} recommendations:\n")
    for i, r in enumerate(results, start=1):
        print(
            f"  {i}. {r['title']}\n"
            f"     Company  : {r['company']}\n"
            f"     Domain   : {r['domain']}\n"
            f"     Location : {r['location_region']}\n"
            f"     Similarity: {r['similarity_score']:.4f}  "
            f"Skill-match: {r['skill_match_score']:.4f}  "
            f"Final: {r['final_score']:.4f}\n"
            f"     Apply    : {r['apply_link']}\n"
        )


if __name__ == "__main__":
    # ── Startup ───────────────────────────────────────────────────────────
    print("\n>>> Starting recommendation engine …")
    engine.startup()

    # ── Test cases ────────────────────────────────────────────────────────
    run_test("python machine learning")
    run_test("python machine learning", domain="machine learning")
    run_test("web development react javascript", location_region="india")
    run_test("data science sql analytics", domain="data science", location_region="remote")
    run_test("java spring boot backend", experience="fresher")

    print("\n✅  All test queries completed successfully.")
