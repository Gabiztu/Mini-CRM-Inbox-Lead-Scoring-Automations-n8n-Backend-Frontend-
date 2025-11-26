# Story 1.1: Project Setup & Database

**Status:** Draft

**Story:**
**As a** Developer,
**I want** to initialize the monorepo with Next.js, Express, and Prisma/SQLite,
**so that** I have a working environment for the entire team to build upon.

**Acceptance Criteria:**
1.  **Monorepo Structure:** Root directory contains `/frontend`, `/backend`, and `/n8n_data` folders.
2.  **Orchestration:** Root `package.json` has a `dev` script using `concurrently` that starts all three services (Frontend, Backend, n8n) with a single command.
3.  **n8n Persistence:** The n8n start script explicitly sets `N8N_USER_FOLDER=./n8n_data` so workflows are saved in the repo.
4.  **Frontend Init:** Next.js 14 (App Router) initialized with Tailwind CSS and ShadCN UI in `/frontend`.
5.  **Backend Init:** Express.js initialized with TypeScript in `/backend`.
6.  **Database Init:** Prisma initialized in `/backend` using **SQLite**.
7.  **Schema Defined:** `schema.prisma` contains the `Lead`, `Message`, and `Tag` models as defined in the Architecture.
8.  **Verification:** Running `npm run dev` in the root successfully starts:
    *   Frontend on port 3000
    *   Backend on port 4000
    *   n8n on port 5678

**Tasks / Subtasks:**
- [x] **Root Setup**
    - [x] Create project folder `mini-crm`.
    - [x] Initialize root `package.json`.
    - [x] Install `concurrently`.
    - [x] Create `/n8n_data` directory.
- [ ] **Frontend Setup**
    - [ ] Run `npx create-next-app@latest frontend` (TS, Tailwind, ESLint, App Router).
    - [ ] Initialize ShadCN UI (`npx shadcn-ui@latest init`).
    - [ ] Update `next.config.js` if needed to avoid port conflicts (default 3000 is fine).
- [ ] **Backend Setup**
    - [ ] Create `/backend` folder.
    - [ ] Initialize `package.json` and install `express`, `typescript`, `ts-node`, `prisma`, `@prisma/client`.
    - [ ] Create `tsconfig.json` for backend.
    - [ ] Create basic `src/index.ts` server entry point listening on port 4000.
- [ ] **Database & Prisma**
    - [ ] Run `npx prisma init` in `/backend`.
    - [ ] Update `schema.prisma` provider to `sqlite`.
    - [ ] Add `Lead`, `Message`, `Tag` models to schema.
    - [ ] Run `npx prisma db push` to create the local SQLite file.
- [ ] **Orchestration**
    - [ ] Add `dev` script to root `package.json`: `concurrently \"npm run dev:frontend\" \"npm run dev:backend\" \"npm run dev:n8n\"`.
    - [ ] Add sub-scripts:
        - `dev:frontend`: `cd frontend && npm run dev`
        - `dev:backend`: `cd backend && npm run dev`
        - `dev:n8n`: `N8N_USER_FOLDER=./n8n_data npx n8n start`

**Dev Notes:**
- **Ports:** Ensure strictly: FE=3000, BE=4000, n8n=5678.
- **n8n:** The `N8N_USER_FOLDER` is critical for the "run in < 5 mins" requirement. Without it, the user will see an empty n8n instance.
- **Prisma:** Use `datasource db { provider = "sqlite" url = "file:./dev.db" }`.
- **CORS:** Remember to configure CORS in Express to allow requests from `localhost:3000`.

***

