from app.models.internship import Internship
from app.models.user import User
from app.services.matching import rank_internships, score_match


def test_score_match_full_overlap():
    student = User(name="Aarav", email="a@example.com", hashed_password="x", skills=["Python", "SQL"])
    internship = Internship(
        title="Backend Intern",
        domain="Software Development",
        description="x",
        skills_required=["Python", "SQL"],
    )

    score, reasons = score_match(student, internship)
    assert score == 100
    assert any("Python" in r or "python" in r.lower() for r in reasons)


def test_score_match_no_overlap():
    student = User(name="Aarav", email="a@example.com", hashed_password="x", skills=["Figma"])
    internship = Internship(
        title="Backend Intern",
        domain="Software Development",
        description="x",
        skills_required=["Python", "SQL"],
    )

    score, _ = score_match(student, internship)
    assert score == 0


def test_rank_internships_orders_by_score():
    student = User(name="Aarav", email="a@example.com", hashed_password="x", skills=["Python"])
    low_match = Internship(title="Design Intern", domain="Design", description="x", skills_required=["Figma"])
    high_match = Internship(
        title="Backend Intern", domain="Software Development", description="x", skills_required=["Python"]
    )

    ranked = rank_internships(student, [low_match, high_match])
    assert ranked[0][0] is high_match
    assert ranked[0][1] >= ranked[1][1]
