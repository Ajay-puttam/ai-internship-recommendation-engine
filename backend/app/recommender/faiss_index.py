from typing import Tuple

import logging
import numpy as np
import faiss

logger = logging.getLogger(__name__)


def build_index(embeddings: np.ndarray) -> faiss.IndexFlatIP:
    """
    Build a FAISS IndexFlatIP (inner product) index from normalized embeddings.

    Embeddings are assumed to be L2-normalized so that inner product corresponds
    to cosine similarity.

    Args:
        embeddings (np.ndarray): Array of shape (n_items, dim) with float32 embeddings.

    Raises:
        ValueError: If embeddings array is empty or has invalid shape.

    Returns:
        faiss.IndexFlatIP: Built FAISS index ready for search.
    """
    if embeddings.ndim != 2:
        raise ValueError(
            f"Embeddings must be 2D (n_items, dim), got shape {embeddings.shape}."
        )

    n_items, dim = embeddings.shape
    if n_items == 0:
        raise ValueError("Cannot build FAISS index with zero embeddings.")

    logger.info("Building FAISS index with %d items and dimension %d...", n_items, dim)
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings.astype("float32"))
    return index


def search_index(
    index: faiss.IndexFlatIP,
    query_vec: np.ndarray,
    k: int = 50,
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Search the FAISS index for the top-k most similar items.

    Args:
        index (faiss.IndexFlatIP): FAISS index built on internship embeddings.
        query_vec (np.ndarray): Query embedding of shape (1, dim) or (dim,).
        k (int): Number of nearest neighbors to retrieve. Default is 50.

    Raises:
        ValueError: If query_vec has incompatible shape or index is empty.

    Returns:
        Tuple[np.ndarray, np.ndarray]:
            - distances: Array of shape (1, k) with similarity scores (inner product).
            - indices: Array of shape (1, k) with indices of nearest internships.
    """
    if query_vec.ndim == 1:
        query_vec = query_vec.reshape(1, -1)

    if query_vec.ndim != 2:
        raise ValueError(
            f"Query vector must be 1D or 2D, got shape {query_vec.shape}."
        )

    if index.ntotal == 0:
        raise ValueError("Cannot search an empty FAISS index (ntotal == 0).")

    query_vec = query_vec.astype("float32")
    distances, indices = index.search(query_vec, k)
    return distances, indices

