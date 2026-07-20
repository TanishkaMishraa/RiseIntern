from app.services.csv_import import import_internships_csv

CSV_HEADER = "title,domain,description,deadline,skills_required,stipend,location\n"


def test_import_valid_rows(db_session):
    csv_bytes = (
        CSV_HEADER
        + "Backend Intern,Software Development,Build APIs,2030-01-01T00:00:00,Python;SQL,15000,Remote\n"
        + "Design Intern,Design,Design things,2030-02-01T00:00:00,Figma,10000,Delhi\n"
    ).encode("utf-8")

    result = import_internships_csv(db_session, recruiter_id=1, file_bytes=csv_bytes)

    assert result["created"] == 2
    assert result["skipped"] == 0
    assert result["errors"] == []


def test_import_reports_row_errors(db_session):
    csv_bytes = (
        CSV_HEADER
        + "Backend Intern,Software Development,Build APIs,not-a-date,Python,15000,Remote\n"
    ).encode("utf-8")

    result = import_internships_csv(db_session, recruiter_id=1, file_bytes=csv_bytes)

    assert result["created"] == 0
    assert result["skipped"] == 1
    assert result["errors"][0]["row"] == 2


def test_import_missing_columns():
    csv_bytes = b"title,domain\nBackend Intern,Software Development\n"
    result = import_internships_csv(db=None, recruiter_id=1, file_bytes=csv_bytes)

    assert result["created"] == 0
    assert "Missing columns" in result["errors"][0]["message"]
