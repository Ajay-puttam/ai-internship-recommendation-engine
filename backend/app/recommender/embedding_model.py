from typing import List, Optional

import logging
import numpy as np
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

_MODEL_NAME = "all-MiniLM-L6-v2"
_model: Optional[SentenceTransformer] = None


def _get_model() -> SentenceTransformer:
    """
    Lazily load and return the SentenceTransformer model instance.

    Returns:
        SentenceTransformer: Loaded embedding model.
    """
    global _model
    if _model is None:
        logger.info("Loading sentence-transformers model '%s'...", _MODEL_NAME)
        _model = SentenceTransformer(_MODEL_NAME)
    return _model


def _l2_normalize(embeddings: np.ndarray) -> np.ndarray:
    """
    L2-normalize embeddings along the last dimension.

    Args:
        embeddings (np.ndarray): Array of shape (n_samples, dim) or (dim,).

    Returns:
        np.ndarray: L2-normalized embeddings with dtype float32.
    """
    if embeddings.ndim == 1:
        embeddings = embeddings.reshape(1, -1)

    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    # Avoid division by zero by replacing zero norms with 1.0
    norms[norms == 0] = 1.0
    normalized = embeddings / norms
    return normalized.astype("float32")


def generate_embeddings(texts: List[str]) -> np.ndarray:
    """
    Batch encode a list of texts into L2-normalized embeddings.

    Args:
        texts (List[str]): List of input strings to embed.

    Returns:
        np.ndarray: Array of shape (n_texts, 384) with L2-normalized float32 embeddings.
    """
    if not texts:
        return np.zeros((0, 384), dtype="float32")

    model = _get_model()
    logger.info("Generating embeddings for %d internships...", len(texts))
    raw_embeddings = model.encode(
        texts,
        batch_size=32,
        show_progress_bar=False,
        convert_to_numpy=True,
        normalize_embeddings=False,
    )
    return _l2_normalize(raw_embeddings)


def embed_query(text: str) -> np.ndarray:
    """
    Encode a single query string into a L2-normalized embedding.

    Args:
        text (str): Query string describing user skills and interests.

    Returns:
        np.ndarray: Array of shape (1, 384) with L2-normalized float32 embedding.
    """
    model = _get_model()
    raw_embedding = model.encode(
        [text],
        batch_size=1,
        show_progress_bar=False,
        convert_to_numpy=True,
        normalize_embeddings=False,
    )
    return _l2_normalize(raw_embedding)

