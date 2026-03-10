"""
resume_parser.py — Extract raw text from an uploaded PDF resume.

Uses pdfplumber for reliable text extraction across multi-page PDFs.
"""

import re
import io
from fastapi import UploadFile


async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Read all pages of a PDF UploadFile and return concatenated plain text.

    Args:
        file: FastAPI UploadFile object (must be a PDF).

    Returns:
        Normalized plain-text string of the entire resume.

    Raises:
        ValueError: If the file cannot be parsed as a PDF.
    """
    try:
        import pdfplumber  # imported here so the rest of the app works without it
    except ImportError as exc:
        raise RuntimeError(
            "pdfplumber is not installed. Run: pip install pdfplumber"
        ) from exc

    content = await file.read()

    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            pages_text = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
    except Exception as exc:
        raise ValueError(f"Could not parse PDF: {exc}") from exc

    raw = "\n".join(pages_text)

    # Normalize: collapse excessive whitespace while preserving line breaks
    normalized = re.sub(r"[^\S\n]+", " ", raw)   # multi-spaces → single space
    normalized = re.sub(r"\n{3,}", "\n\n", normalized)  # 3+ newlines → 2
    return normalized.strip()
