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


def test_synonym_skill_is_recognized_even_though_tokens_differ():
    """The old keyword-overlap engine would score this 0 — 'ml' != 'machine learning'
    as exact tokens. The semantic engine should recognize the synonym instead."""
    student = User(name="Aarav", email="a@example.com", hashed_password="x", skills=["ML"])
    internship = Internship(
        title="ML Intern", domain="Data Science", description="x", skills_required=["Machine Learning"]
    )

    score, reasons = score_match(student, internship)
    assert score > 0
    assert any("Machine Learning" in r for r in reasons)


def test_differently_phrased_skill_is_recognized():
    student = User(name="Aarav", email="a@example.com", hashed_password="x", skills=["React.js"])
    internship = Internship(
        title="Frontend Intern", domain="Software Development", description="x", skills_required=["React"]
    )

    score, _ = score_match(student, internship)
    assert score > 0


def test_unrelated_skills_still_score_at_or_near_zero():
    student = User(name="Aarav", email="a@example.com", hashed_password="x", skills=["Communication"])
    internship = Internship(
        title="Backend Intern", domain="Software Development", description="x", skills_required=["Docker"]
    )

    score, reasons = score_match(student, internship)
    assert score == 0
    assert any("Consider learning" in r for r in reasons)


def test_no_skills_required_returns_neutral_baseline():
    student = User(name="Aarav", email="a@example.com", hashed_password="x", skills=["Python"])
    internship = Internship(
        title="Open Intern", domain="Software Development", description="x", skills_required=[]
    )

    score, reasons = score_match(student, internship)
    assert score == 50
    assert "no specific skill requirements" in reasons[0]
