# Mini‑CRM: Inbox, Lead Scoring, Automations (n8n)

One‑day build of a minimal CRM with:
- Next.js 16 frontend (TypeScript, Tailwind‑style UI)
- Express + Prisma (SQLite) backend
- n8n automations (Inbound Scoring + Scheduler)

## Quick Start

Prerequisites:
- Node.js 20+

Command:
```
npm install && npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- n8n (automations): http://localhost:5678

Notes:
- Workflows are auto‑copied on startup to `./n8n_data/workflows` via a prepare script.
- If database is empty, run the seed once: `npm run db:seed`.

## Architecture

```mermaid
flowchart LR
  subgraph Browser
    UI[Next.js App]
  end
  subgraph Server
    API[Express API]
    DB[(SQLite via Prisma)]
    N8N[n8n Workflows]
  end

  UI <--> |HTTP (JSON)| API
  API <--> |ORM| DB
  N8N <--> |HTTP| API
  ext[Inbound Webhook] --> |POST /webhook/inbound| N8N
```

## Tech Stack
- Frontend: Next.js 16, React 19, TypeScript, lightweight shadcn‑style components
- Backend: Express, TypeScript, Prisma 5, SQLite
- Automations: n8n (Webhook scoring + Scheduled status updates)

## API (Brief)
- Leads
  - GET `/api/leads` (q/search, status, paging)
  - GET `/api/leads/:id`
  - POST `/api/leads` { name, email, status?, source?, score?, tags?: string[] }
  - PUT `/api/leads/:id` { name?, email?, status?, score?, source?, tags?: string[] }
  - DELETE `/api/leads/:id`
- Messages
  - GET `/api/messages/:leadId`
  - POST `/api/messages` { leadId, content, direction: "INBOUND"|"OUTBOUND" }
- Export
  - GET `/api/export` → CSV download

## n8n Setup
- We run n8n locally with: `npm run dev:n8n`
- The script sets `N8N_USER_FOLDER=./n8n_data` so n8n stores data in this local folder.
- A prepare step (`predev:n8n`) copies all workflow JSONs from `docs/workflows/` to `n8n_data/workflows/`.
  - `docs/workflows/inbound_scoring.json`
  - `docs/workflows/scheduler.json`

Endpoints used by n8n:
- Webhook (inbound scoring): `POST http://localhost:5678/webhook/inbound`
- Backend API base: `http://localhost:4000/api`

## Database & Seeding
- DB: SQLite (created automatically by Prisma).
- Seed: run once with:
```
npm run db:push && npm run db:seed
```

## Scripts
- `npm run dev` → Frontend + Backend + n8n (with workflow auto‑copy)
- `npm run setup` → Install all deps + push DB + seed
- `npm run db:push` → Prisma migrate (push schema)
- `npm run db:seed` → Seed sample data

## Troubleshooting
- Ports in use:
  - Frontend 3000, Backend 4000, n8n 5678. Stop conflicting apps or change ports.
- Windows/Prisma EPERM during install:
  - If `npm ci` fails on `query_engine-windows.dll.node`, close running Node processes, temporarily pause antivirus, or skip reinstall and use existing `node_modules`.
- Next.js workspace root warning:
  - Safe to ignore; or remove extra lockfiles.

## Demo (see DEMO_SCRIPT.md)
Five flows: Dashboard & filters, inline editing, inbound webhook, timeline & score update, export CSV.
