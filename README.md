# Mini Ticket Tracker

A small REST API + UI for tracking support tickets — built as a take-home assignment for Lodwar Services.

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.1-092E20?logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-3.18-A30000?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## What it does

Create tickets, list/filter them by status, update their status or priority, and view counts grouped by status — via a REST API and a single-page UI.

## Live demo

- Frontend: _TODO: add Vercel/Netlify URL after deploy_
- Backend API: _TODO: add Render URL after deploy_
- API docs (Swagger): `<backend-url>/api/docs/`

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
| `POST` | `/api/tickets` | Create a ticket |
| `GET` | `/api/tickets` | List tickets (`?status=`, `?page=&limit=`) |
| `PATCH` | `/api/tickets/:id` | Update a ticket's status or priority |
| `DELETE` | `/api/tickets/:id` | Soft-delete a ticket |
| `GET` | `/api/tickets/stats` | Count of tickets grouped by status |

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
- `PATCH /tickets/:id` allows any status transition (e.g. `closed → open`) with no state machine. I'd add transition rules if this needed to model a real workflow.
- The stats endpoint uses a single `GROUP BY` aggregate query, not a loop, to avoid N+1 queries.
- No authentication/authorization — out of scope for a CRUD demo. In production I'd add JWT-based auth with role-based access control.
- Delete is a soft-delete (`deleted_at` timestamp + `is_active` flag, excluded from the default manager) rather than a hard delete — not required by spec, but a safer default convention; no audit/history log beyond that, which I'd add with more time.
- Added a `BaseModel` (`created_at`, `updated_at`, `deleted_at`, `is_active`) in `tickets/models/base.py` that `Ticket` inherits from, so the soft-delete/timestamp convention is reusable if more models are added later.
- Tests cover the two required flows (create, stats) plus filter and update, since those are the highest-value paths, not full coverage, to respect the time-box.
- Deployed on free-tier Render/Vercel — expect cold-start latency on the first request after idling; a known free-tier tradeoff, not a bug.

## What I'd do with more time

- JWT auth + role-based access control
- State machine for valid status transitions
- Audit log / ticket history
- Cursor-based pagination
- More exhaustive test coverage (edge cases, permissions)
- CI pipeline (lint + test on PR)
