from typing import List, Optional

import logging
import numpy as np
import pandas as pd
import faiss

from .data_loader import load_dataset, get_texts_for_embedding
from .embedding_model import generate_embeddings, embed_query
from .faiss_index import build_index, search_index
from .ranking import rank_results

logger = logging.getLogger(__name__)

# Related domain groups for two-stage domain filtering.
# Primary domain is always first in each list.
DOMAIN_GROUPS: dict = {
    "data science": [
        "data science",
        "data analytics",
        "machine learning",
        "data engineering",
    ],
    "artificial intelligence": [
        "artificial intelligence",
        "machine learning",
        "data science",
        "data analytics",
    ],
    "machine learning": [
        "machine learning",
        "artificial intelligence",
        "data science",
        "data analytics",
    ],
    "data analytics": [
        "data analytics",
        "data science",
        "machine learning",
        "business analytics",
    ],
    "data engineering": [
        "data engineering",
        "data science",
        "data analytics",
        "database",
    ],
    "software engineering": [
        "software engineering",
        "web development",
        "devops cloud",
        "database",
    ],
    "web development": [
        "web development",
        "software engineering",
        "mobile development",
        "ui ux design",
    ],
    "mobile development": [
        "mobile development",
        "web development",
        "software engineering",
        "ui ux design",
    ],
    "devops cloud": [
        "devops cloud",
        "software engineering",
        "data engineering",
        "database",
    ],
    "database": [
        "database",
        "data engineering",
        "software engineering",
        "data analytics",
    ],
    "business analytics": [
        "business analytics",
        "data analytics",
        "data science",
        "research",
    ],
    "ui ux design": [
        "ui ux design",
        "web development",
        "mobile development",
        "content writing",
    ],
    "cybersecurity": [
        "cybersecurity",
        "software engineering",
        "devops cloud",
        "database",
    ],
    "blockchain": ["blockchain", "software engineering", "web development", "database"],
    "game development": [
        "game development",
        "software engineering",
        "mobile development",
        "ui ux design",
    ],
    "robotics automation": [
        "robotics automation",
        "software engineering",
        "artificial intelligence",
        "machine learning",
    ],
    "digital marketing": [
        "digital marketing",
        "content writing",
        "business analytics",
        "research",
    ],
    "content writing": ["content writing", "digital marketing", "research", "general"],
    "research": ["research", "data science", "business analytics", "general"],
    "general": ["general", "software engineering", "research", "content writing"],
}


class RecommendationEngine:
    """
    Recommendation engine that uses sentence embeddings, FAISS vector search,
    rule-based filtering, and a weighted ranking layer to recommend internships.
    """

    def __init__(self) -> None:
        """
        Initialize the RecommendationEngine with empty state.
        """
        self._dataset: Optional[pd.DataFrame] = None
        self._embeddings: Optional[np.ndarray] = None
        self._index: Optional[faiss.IndexFlatIP] = None
        self._initialized: bool = False

    def startup(self) -> None:
        """
        Initialize the recommendation engine. Called once at app startup.

        Steps:
            1. Load dataset        → log "Loading dataset..."
            2. Generate embeddings → log "Generating embeddings..."
            3. Build FAISS index   → log "Building FAISS index..."
            4. Log "Recommendation engine ready."
        """
        if self._initialized:
            logger.info("Recommendation engine already initialized; skipping startup.")
            return

        logger.info("Loading dataset...")
        df = load_dataset()

        logger.info("Preparing texts for embedding...")
        texts = get_texts_for_embedding(df)

        logger.info("Generating embeddings for %d internships...", len(texts))
        embeddings = generate_embeddings(texts)

        logger.info("Building FAISS index...")
        index = build_index(embeddings)

        self._dataset = df.reset_index(drop=True)
        self._embeddings = embeddings
        self._index = index
        self._initialized = True

        logger.info("Recommendation engine ready.")

    def _ensure_initialized(self) -> None:
        """
        Ensure the engine has been initialized via startup().

        Raises:
            RuntimeError: If the engine has not been initialized.
        """
        if not self._initialized or self._dataset is None or self._index is None:
            raise RuntimeError("Engine not initialized. Call startup() first.")

    def _filter_by_domain(
        self,
        candidates: pd.DataFrame,
        domain: str,
        top_k: int,
    ) -> pd.DataFrame:
        """
        Two-stage domain filtering.

        Stage 1 — Strict: exact domain match.
            If results >= top_k → return strict results.

        Stage 2 — Relaxed: include related domains from DOMAIN_GROUPS.
            Used only when strict results < top_k.

        Args:
            candidates (pd.DataFrame): Candidate internships from FAISS search.
            domain (str): User preferred domain.
            top_k (int): Minimum desired number of candidates.

        Returns:
            pd.DataFrame: Domain-filtered candidates.
        """
        # Stage 1 — strict exact match
        strict = candidates[candidates["domain"] == domain]

        if len(strict) >= top_k:
            logger.info(
                "Domain filter stage 1 (strict): %d candidates for domain='%s'",
                len(strict),
                domain,
            )
            return strict

        # Stage 2 — relaxed: use related domains
        related_domains = DOMAIN_GROUPS.get(domain, [domain])
        relaxed = candidates[candidates["domain"].isin(related_domains)]

        logger.info(
            "Domain filter stage 2 (relaxed): %d candidates for domain='%s' "
            "using related domains=%s",
            len(relaxed),
            domain,
            related_domains,
        )

        return relaxed

    def _apply_filters_with_relaxation(
        self,
        candidates: pd.DataFrame,
        domain: Optional[str],
        location_region: Optional[str],
        experience: Optional[str],
        top_k: int,
    ) -> pd.DataFrame:
        """
        Apply rule-based filters with two-stage domain filtering
        and relaxation strategy for location and experience.

        Filtering rules:
            - Domain filter (two-stage):
                Stage 1 → exact match (if >= top_k results)
                Stage 2 → related domains (if < top_k results)
            - Location filter (if provided):
                (location_region == query_location) OR
                (location_region == 'remote') OR
                (location_region == 'unknown')
            - Experience filter (if provided):
                exact match on 'experience'.

        Relaxation order if fewer than top_k candidates remain
        after domain filtering:
            1. Relax experience filter first.
            2. Relax location filter second.
            3. Domain filter uses two-stage (never fully removed).

        Args:
            candidates (pd.DataFrame): Candidates from FAISS search.
            domain (Optional[str]): User preferred domain.
            location_region (Optional[str]): User preferred location region.
            experience (Optional[str]): User preferred experience level.
            top_k (int): Desired minimum number of candidates.

        Returns:
            pd.DataFrame: Filtered candidates after relaxation strategy.
        """
        df = candidates.copy()

        # ── Domain filter — two-stage ─────────────────────────────
        if domain:
            df = self._filter_by_domain(df, domain, top_k)

        if df.empty:
            return df

        base = df

        # ── Location + Experience filters ─────────────────────────
        def apply_filters(
            use_location: bool,
            use_experience: bool,
        ) -> pd.DataFrame:
            filtered = base
            if use_location and location_region:
                loc = location_region
                filtered = filtered[
                    (filtered["location_region"] == loc)
                    | (filtered["location_region"] == "remote")
                    | (filtered["location_region"] == "unknown")
                ]
            if use_experience and experience:
                filtered = filtered[filtered["experience"] == experience]
            return filtered

        # Start with all filters applied
        filtered_all = apply_filters(use_location=True, use_experience=True)

        if len(filtered_all) >= top_k or (not location_region and not experience):
            return filtered_all

        # Relax experience filter first
        filtered_no_exp = apply_filters(
            use_location=True,
            use_experience=False,
        )

        if len(filtered_no_exp) >= top_k or not location_region:
            return filtered_no_exp

        # Relax location filter last (domain constraint kept via two-stage)
        filtered_no_loc = apply_filters(
            use_location=False,
            use_experience=False,
        )

        return filtered_no_loc

    def recommend(
        self,
        skills: str,
        domain: Optional[str] = None,
        location_region: Optional[str] = None,
        experience: Optional[str] = None,
        top_k: int = 5,
    ) -> List[dict]:
        """
        Generate internship recommendations for the given user query.

        Full pipeline:
            1. Validate and embed query.
            2. FAISS search (k=50) over internship embeddings.
            3. Two-stage domain filter + location/experience relaxation.
            4. Skill match scoring and weighted ranking.
            5. Return top_k results.

        Args:
            skills (str): User skills and interests string.
            domain (Optional[str]): Desired internship domain.
            location_region (Optional[str]): Preferred location region.
            experience (Optional[str]): Preferred experience level.
            top_k (int): Number of recommendations to return (default 5).

        Raises:
            ValueError: If skills query is empty.
            RuntimeError: If engine has not been initialized.

        Returns:
            List[dict]: List of recommended internships with scoring details.
        """
        skills_query = (skills or "").strip()
        if not skills_query:
            raise ValueError("Skills query cannot be empty.")

        self._ensure_initialized()
        assert self._dataset is not None
        assert self._index is not None

        # ── Step 1: Embed query ───────────────────────────────────
        query_vec = embed_query(skills_query)

        # ── Step 2: FAISS search (k=50) ──────────────────────────
        distances, indices = search_index(self._index, query_vec, k=50)
        distances_row = distances[0]
        indices_row = indices[0]

        candidates = self._dataset.iloc[indices_row].copy()
        candidates["similarity_score"] = distances_row

        # ── Step 3: Rule-based filtering with relaxation ─────────
        filtered = self._apply_filters_with_relaxation(
            candidates=candidates,
            domain=domain,
            location_region=location_region,
            experience=experience,
            top_k=top_k,
        )

        if filtered.empty:
            logger.info(
                "No candidates found after filtering and relaxation "
                "(skills=%s, domain=%s, location=%s, experience=%s).",
                skills_query,
                domain,
                location_region,
                experience,
            )
            return []

        # ── Step 4 & 5: Ranking ──────────────────────────────────
        sims_for_filtered = filtered["similarity_score"].to_numpy()
        ranked = rank_results(
            candidates_df=filtered,
            similarities=sims_for_filtered,
            user_skills=skills_query,
            query_location=location_region,
            query_experience=experience,
            top_n=top_k,
        )

        return ranked


# Module-level singleton
engine = RecommendationEngine()
