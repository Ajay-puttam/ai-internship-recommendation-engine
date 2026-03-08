from pathlib import Path
from typing import List, Optional

import logging
import pandas as pd

logger = logging.getLogger(__name__)


def get_default_dataset_path() -> Path:
    """
    Resolve the default path to the cleaned internships dataset.

    The path is resolved relative to the backend project root:
    backend/data/datasets/combined_dataset_cleaned.csv

    Returns:
        Path: Absolute path to the dataset CSV file.
    """
    # This file lives at backend/app/recommender/data_loader.py
    # parents[0] = recommender/, parents[1] = app/, parents[2] = backend/
    backend_dir = Path(__file__).resolve().parents[2]
    return backend_dir / "data" / "datasets" / "combined_dataset_cleaned.csv"


def load_dataset(csv_path: Optional[Path] = None) -> pd.DataFrame:
    """
    Load the internships dataset from CSV into a pandas DataFrame.

    Args:
        csv_path (Optional[Path]): Optional custom path to the dataset CSV.
            If None, the default dataset path under backend/data/datasets is used.

    Raises:
        FileNotFoundError: If the dataset file does not exist.
        pd.errors.EmptyDataError: If the CSV file is empty.
        pd.errors.ParserError: If the CSV file cannot be parsed.

    Returns:
        pd.DataFrame: Loaded dataset with internships.
    """
    path = csv_path or get_default_dataset_path()
    logger.info("Loading dataset from %s", path)

    if not path.exists():
        raise FileNotFoundError(
            f"Dataset file not found at '{path}'. "
            "Ensure 'combined_dataset_cleaned.csv' is present under backend/data/datasets."
        )

    df = pd.read_csv(path)

    if "combined_text" not in df.columns:
        raise ValueError(
            "Dataset is missing required 'combined_text' column used for embeddings."
        )

    return df


def get_texts_for_embedding(df: pd.DataFrame) -> List[str]:
    """
    Extract the combined_text column from the dataset for embedding generation.

    Args:
        df (pd.DataFrame): DataFrame containing the internships dataset.

    Raises:
        KeyError: If 'combined_text' column is missing.

    Returns:
        List[str]: List of text strings to be embedded.
    """
    if "combined_text" not in df.columns:
        raise KeyError("DataFrame does not contain 'combined_text' column.")

    texts = df["combined_text"].fillna("").astype(str).tolist()
    return texts

