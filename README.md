# RiseIntern

RiseIntern is an internship discovery and management platform connecting students, recruiters, and admins. Students browse and apply to internships and get skill-based recommendations; recruiters post listings and manage applicants on a kanban board; admins oversee users and listings platform-wide.

## Stack

- **Backend** — FastAPI, SQLAlchemy 2.0, Alembic migrations, JWT auth (`python-jose` + `passlib`/bcrypt), APScheduler for background jobs, `pypdf` for resume parsing. SQLite for local dev, PostgreSQL in Docker/production.
- **Frontend** — React 18 + Vite, React Router, `@dnd-kit` for the recruiter applicant kanban board, Recharts for analytics charts.
- **Infra** — Docker Compose (Postgres + backend + frontend, nginx-served static build).

There is no ORM-agnostic magic and no external matching/AI service: skill matching is a straightforward overlap score computed in `backend/app/services/matching.py`, and resume skill extraction is keyword matching against a known skill list — both are meant to be swapped for something smarter later, not production ML.

## Data model

| Entity | Key fields | Relationships |
|---|---|---|
| `User` | name, email, hashed_password, role (`student` / `recruiter` / `admin`), skills (JSON) | has many internships (as recruiter), applications, bookmarks, notifications; has one resume |
| `Internship` | title, domain, description, skills_required (JSON), stipend, location, deadline, is_closed | belongs to a recruiter (`User`); has many applications, bookmarks |
| `Application` | status (`applied` → `shortlisted` → `interview` → `offered` / `rejected`) | belongs to a student and an internship |
| `Bookmark` | — | belongs to a student and an internship (unique pair) |
| `Notification` | message, read | belongs to a user |
| `Resume` | filename, file_path, extracted_skills (JSON) | belongs to a student (one-to-one) |

Full schema lives in `backend/app/models/`; the current migration is `backend/alembic/versions/`.

## Setup

### Option A — Docker Compose (recommended)

```bash
docker compose up --build
```

This starts Postgres, runs Alembic migrations, and boots the API on **http://localhost:8000** and the frontend on **http://localhost:5173**. The database starts empty — see "Demo data" below to seed it.

### Option B — Run locally

**Backend**

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate       # .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env         # defaults to SQLite, no Postgres needed
python seed.py                # optional: creates demo users + 15 listings
uvicorn app.main:app --reload # http://localhost:8000
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_BASE_URL should match the backend above
npm run dev                    # http://localhost:5173
```

### Demo data

`backend/seed.py` creates three accounts (password `password123` for all):

- `student@riseintern.com`
- `recruiter@riseintern.com`
- `admin@riseintern.com`

plus 15 sample internship listings across engineering, data, design, marketing, finance, and HR.

## Testing

```bash
cd backend
pytest
```

Covers auth, internship CRUD/filtering, the matching algorithm, the apply → status-change → notification flow, bookmarks, and CSV import.

## Known limitations

- Email sending is a no-op in development (logged, not sent) — wire up real SMTP credentials in `.env` and set `ENVIRONMENT=production` to actually send.
- Resume storage is local disk (`STORAGE_DIR`), not S3 — swapping that in is the one thing `backend/app/core/storage.py` was written to make painless later.
- Matching and resume skill extraction are both simple keyword/overlap logic, not embeddings — good enough for a working recommendation flow, not a claim of "AI-powered."

## License

MIT — see [LICENSE](LICENSE).
