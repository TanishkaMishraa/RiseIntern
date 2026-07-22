from app.models.internship import Internship
from app.models.user import User
from app.services.embeddings import cosine_similarity, embed

EXACT_THRESHOLD = 0.92
SYNONYM_THRESHOLD = 0.35
SYNONYM_FLOOR_CREDIT = 0.6


def _best_match(required_skill: str, student_skills: list[str]) -> tuple[str | None, float]:
    if not student_skills:
        return None, 0.0

    required_vector = embed(required_skill)
    best_skill, best_sim = None, 0.0
    for skill in student_skills:
        sim = cosine_similarity(required_vector, embed(skill))
        if sim > best_sim:
            best_skill, best_sim = skill, sim
    return best_skill, best_sim


def score_match(student: User, internship: Internship) -> tuple[int, list[str]]:
    student_skills = list(student.skills or [])
    required_skills = list(internship.skills_required or [])

    if not required_skills:
        return 50, ["This internship has no specific skill requirements listed."]

    exact_matches = []
    synonym_matches = []
    missing = []
    contributions = []

    for required in required_skills:
        best_skill, best_sim = _best_match(required, student_skills)

        if best_sim >= EXACT_THRESHOLD:
            exact_matches.append(required)
        elif best_sim >= SYNONYM_THRESHOLD:
            synonym_matches.append((required, best_skill))
        else:
            missing.append(required)

        if best_sim >= EXACT_THRESHOLD:
            contribution = 1.0
        elif best_sim >= SYNONYM_THRESHOLD:
            span = EXACT_THRESHOLD - SYNONYM_THRESHOLD
            contribution = SYNONYM_FLOOR_CREDIT + (1 - SYNONYM_FLOOR_CREDIT) * (
                (best_sim - SYNONYM_THRESHOLD) / span
            )
        else:
            contribution = 0.0
        contributions.append(contribution)

    score = round(sum(contributions) / len(contributions) * 100)

    reasons = []
    if exact_matches:
        reasons.append(f"You match on: {', '.join(sorted(exact_matches))}.")
    if synonym_matches:
        described = ", ".join(f"{req} (via your skill '{via}')" for req, via in synonym_matches)
        reasons.append(f"Related skills count too: {described}.")
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
