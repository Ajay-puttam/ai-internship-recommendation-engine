"""
skill_extractor.py — Extract predefined skills from resume text.
"""

import re
from typing import List

# Comprehensive dictionary of technical and soft skills, including multi-word phrases.
# Ordered roughly by length (longest phrases first when searching) to prevent partial word matches
# if using simple replacement, though we'll use regex word boundaries.
SKILL_DICTIONARY = {
    "natural language processing", "machine learning", "deep learning",
    "artificial intelligence", "data science", "data engineering",
    "data analytics", "business analytics", "cloud computing",
    "object oriented programming", "rest api", "graphql api", "data pipeline",
    "data visualization", "software engineering", "web development",
    "mobile development", "ui ux design", "digital marketing",
    "content writing", "cybersecurity", "blockchain", "game development",
    "robotics automation", "agile methodology", "scrum methodology",
    "devops cloud", "quality assurance", "test driven development",
    
    # Languages, frameworks, tools
    "python", "java", "c++", "c#", "javascript", "typescript", "ruby",
    "go", "rust", "php", "swift", "kotlin", "scala", "r", "matlab",
    "html", "css", "sql", "nosql", "bash", "shell scripting",
    "react", "angular", "vue.js", "next.js", "node.js", "express.js",
    "django", "flask", "fastapi", "spring boot", "ruby on rails",
    "laravel", "asp.net", "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "matplotlib", "seaborn", "opencv",
    "docker", "kubernetes", "aws", "amazon web services", "azure",
    "google cloud", "gcp", "terraform", "ansible", "jenkins",
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "mysql", "postgresql", "mongodb", "redis", "cassandra", "elasticsearch",
    "kafka", "rabbitmq", "hadoop", "spark", "tableau", "power bi",
    "excel", "linux", "unix", "windows", "macos", "android", "ios"
}

# Compile patterns for efficiency
# Use \b to ensure word boundaries (e.g., matching "r" only as a standalone word)
# Handle special characters like C++, C#, Vue.js correctly
ESCAPED_SKILLS = [re.escape(skill) for skill in sorted(SKILL_DICTIONARY, key=len, reverse=True)]
# Combine into a single regex for fast searching over the whole text
# Note: For C++ / C#, \b at the end might fail if followed by space, but re.escape handles it reasonably.
# A safe approach is to just search for the strings directly with boundaries handled carefully,
# or use a regex with lookaround.
SKILLS_REGEX = re.compile(
    r'(?<![a-zA-Z0-9_-])(' + '|'.join(ESCAPED_SKILLS) + r')(?![a-zA-Z0-9_-])',
    re.IGNORECASE
)

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extract technical and domain skills from the given text using a predefined dictionary.

    Algorithm:
        1. Replace newlines/punctuation with spaces (keep some like +, #, . for C++, C#, Node.js)
        2. Lowercase the text.
        3. Match against the dictionary phrases.
        4. Return unique matches.

    Args:
        text: Raw resume text.

    Returns:
        List of unique lowercased skill strings found in the text.
    """
    if not text:
        return []

    # Basic normalization: lowercasing
    text_lower = text.lower()
    
    # We allow the regex to do the heavy lifting with word boundaries
    matches = SKILLS_REGEX.findall(text_lower)
    
    # Matches will be returned preserving the case of the matched text (which is already lower)
    # Deduplicate while preserving roughly the order of discovery
    found_skills = []
    seen = set()
    for match in matches:
        # The match might contain multiple groups if we used capturing groups inside ESCAPED_SKILLS, 
        # but since we didn't, it's just the string or tuple.
        skill = match if isinstance(match, str) else match[0]
        if skill not in seen:
            seen.add(skill)
            found_skills.append(skill)
            
    return found_skills
