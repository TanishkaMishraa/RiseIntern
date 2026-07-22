from io import BytesIO

from pypdf import PdfReader

KNOWN_SKILLS = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "FastAPI", "Django",
    "SQL", "PostgreSQL", "MongoDB", "HTML", "CSS", "Tailwind CSS", "Git", "Docker",
    "AWS", "Data Analysis", "Machine Learning", "Excel", "Power BI", "Figma",
    "UI Design", "UX Research", "SEO", "Content Writing", "Digital Marketing",
    "Finance", "Accounting", "Communication", "Project Management", "Java", "C++",
]


def extract_text(file_bytes: bytes, filename: str) -> str:
    if not filename.lower().endswith(".pdf"):
        return file_bytes.decode("utf-8", errors="ignore")

    reader = PdfReader(BytesIO(file_bytes))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def extract_skills(text: str) -> list[str]:
    lowered = text.lower()
    return [skill for skill in KNOWN_SKILLS if skill.lower() in lowered]
