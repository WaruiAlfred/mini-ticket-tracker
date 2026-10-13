# Mini Ticket Tracker

A small REST API + UI for tracking support tickets — for Lodwar Services.

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.1-092E20?logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-3.18-A30000?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## What it does

Create tickets, list/filter/paginate them by status, update their status or priority, and view counts grouped by status — via a REST API and a single-page UI.

## Live demo

- Frontend: [mini-ticket-tracker-818x.vercel.app](https://mini-ticket-tracker-818x.vercel.app)
- Backend API: [mini-ticket-tracker-api.onrender.com/api](https://mini-ticket-tracker-api.onrender.com/api)
- API docs (Swagger): [mini-ticket-tracker-api.onrender.com/api/docs](https://mini-ticket-tracker-api.onrender.com/api/docs/)

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Django + Django REST Framework |
| Database | PostgreSQL |
| Frontend | React + Vite + TypeScript |
| API docs | drf-spectacular (OpenAPI/Swagger) |
| Deployment | Render (backend + Postgres), Vercel (frontend) |

## API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tickets/` | Create a ticket |
| `GET` | `/api/tickets/` | List tickets (`?status=`, `?page=&limit=`) |
| `PATCH` | `/api/tickets/:id/` | Update a ticket's title, description, status, or priority |
| `DELETE` | `/api/tickets/:id/` | Soft-delete a ticket |
| `GET` | `/api/tickets/stats/` | Count of tickets grouped by status |

Full interactive docs at `/api/docs/` once the backend is running.

## Setup & run

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
psql postgres -c "CREATE DATABASE ticket_tracker;"   # or point DATABASE_URL at your own Postgres instance
cp .env.example .env      # fill in DATABASE_URL etc.
python manage.py migrate
python manage.py test
python manage.py runserver
```

Optional: seed some demo data with `python manage.py seed_tickets --count 15`.

### Frontend

```bash
cd frontend
yarn install
yarn dev
```

## Decisions & Tradeoffs

- Used UUID primary keys instead of sequential integers — avoids ID enumeration and matches real-world ticket-system conventions.
- Status/priority are enforced via Django `TextChoices` + `CharField` (app-level validation) rather than native Postgres enum types — faster to evolve without a migration if values change, at the cost of DB-level enforcement.
- Pagination uses `?page=&limit=` per spec (offset-based); at scale I'd switch to cursor pagination to avoid performance degradation on deep pages.
- `PATCH /tickets/:id/` allows any status transition (e.g. `closed → open`) with no state machine. I'd add transition rules if this needed to model a real workflow.
- Tickets are ordered by most recently updated, not creation date — so a status/priority change (or edit) brings a ticket back to the top, which matches how you'd actually want to scan a ticket list (what moved recently) more than a fixed creation-order feed.
- The stats endpoint uses a single `GROUP BY` aggregate query, not a loop, to avoid N+1 queries. `status` is also indexed, since both the list filter and the stats endpoint query on it.
- No authentication/authorization — out of scope for a CRUD demo. In production I'd add JWT-based auth with role-based access control.
- Delete is a soft-delete rather than a hard delete — not required by spec, but a safer default convention; no audit/history log beyond that, which I'd add with more time. It tracks both `deleted_at` (a timestamp, for "when") and `is_active` (a boolean, for cheap filtering via the default manager) — deliberately redundant: either alone would work, but the boolean keeps the common "is this ticket live?" query simple and indexable, while the timestamp preserves *when* it was removed for any future audit trail.
- Added a `BaseModel` (`created_at`, `updated_at`, `deleted_at`, `is_active`) in `tickets/models/base.py` that `Ticket` inherits from, so the soft-delete/timestamp convention is reusable if more models are added later.
- Went beyond the spec's "change status" requirement to support full editing (title, description, priority) and deletion via the `PATCH`/`DELETE` endpoints and matching UI controls — a ticket tracker without the ability to fix a typo or remove a mistaken entry felt incomplete for real use, even though it wasn't explicitly required.
- Tests cover the two required flows (create, stats) plus filter and update, since those are the highest-value paths, not full coverage, to respect the time-box.
- Deployed on free-tier Render/Vercel — expect cold-start latency on the first request after idling; a known free-tier tradeoff, not a bug.

## What I'd do with more time

- Kanban-style board with drag-and-drop status changes instead of a dropdown
- JWT auth + role-based access control
- State machine for valid status transitions
- Audit log / ticket history
- Cursor-based pagination
- More exhaustive test coverage (edge cases, permissions)
- CI pipeline (lint + test on PR)
