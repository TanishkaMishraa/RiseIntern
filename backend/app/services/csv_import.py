import csv
import io
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.internship import Internship

REQUIRED_COLUMNS = {"title", "domain", "description", "deadline"}


def import_internships_csv(db: Session, recruiter_id: int, file_bytes: bytes) -> dict:
    text = file_bytes.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))

    if reader.fieldnames is None or not REQUIRED_COLUMNS.issubset(set(reader.fieldnames)):
        missing = REQUIRED_COLUMNS - set(reader.fieldnames or [])
        return {"created": 0, "skipped": 0, "errors": [{"row": 0, "message": f"Missing columns: {', '.join(missing)}"}]}

    created = 0
    skipped = 0
    errors = []

    for i, row in enumerate(reader, start=2):
        try:
            internship = Internship(
                title=row["title"].strip(),
                domain=row["domain"].strip(),
                description=row["description"].strip(),
                skills_required=[s.strip() for s in row.get("skills_required", "").split(";") if s.strip()],
                stipend=int(row.get("stipend") or 0),
                location=row.get("location", "Remote").strip() or "Remote",
                deadline=datetime.fromisoformat(row["deadline"].strip()),
                recruiter_id=recruiter_id,
            )
            db.add(internship)
            created += 1
        except Exception as exc:  # noqa: BLE001 — surface any row-level failure to the caller
            skipped += 1
            errors.append({"row": i, "message": str(exc)})

    db.commit()
    return {"created": created, "skipped": skipped, "errors": errors}
