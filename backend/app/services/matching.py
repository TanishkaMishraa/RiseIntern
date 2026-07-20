from app.models.internship import Internship
from app.models.user import User


def score_match(student: User, internship: Internship) -> tuple[int, list[str]]:
    student_skills = {s.lower() for s in (student.skills or [])}
    required_skills = {s.lower() for s in (internship.skills_required or [])}

    if not required_skills:
        return 50, ["This internship has no specific skill requirements listed."]

    overlap = student_skills & required_skills
    score = round(len(overlap) / len(required_skills) * 100)

    reasons = []
    if overlap:
        reasons.append(f"You match on: {', '.join(sorted(overlap))}.")
    missing = required_skills - student_skills
    if missing:
        reasons.append(f"Consider learning: {', '.join(sorted(missing))}.")
    if not reasons:
        reasons.append("Add skills to your profile to improve match accuracy.")

    return score, reasons


def rank_internships(student: User, internships: list[Internship]) -> list[tuple[Internship, int, list[str]]]:
    results = []
    for internship in internships:
        score, reasons = score_match(student, internship)
        results.append((internship, score, reasons))
    results.sort(key=lambda item: item[1], reverse=True)
    return results
