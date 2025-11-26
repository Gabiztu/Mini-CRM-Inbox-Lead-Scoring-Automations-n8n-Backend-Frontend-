# Product Requirements Document (PRD)

**Project Name:** Mini-CRM + Inbox + Lead Scoring + Automations
**Version:** 1.1
**Status:** Approved for Development
**Author:** John (Product Manager)

## 1. Goals and Background Context

### 1.1 Goals
*   **Speed & Delivery:** Deliver a fully functional, end-to-end CRM system within a **24-hour deadline**.
*   **Ease of Deployment:** Ensure the entire system (Frontend, Backend, Database, Automation) can be spun up by an evaluator in **< 5 minutes** using simple commands.
*   **Automation Showcase:** Demonstrate advanced logic (scoring, scheduling, ingestion) using **n8n** to replace manual work.
*   **User Experience:** Provide a clean, modern, "Notion-style" interface that supports rapid lead management (inline editing, live search).

### 1.2 Background Context
This project is a technical assessment focused on full-stack delivery capabilities. The core problem is unorganized lead management. Currently, leads are likely tracked manually, resulting in missed follow-ups ("cold" leads) and lack of prioritization. This system automates the ingestion, scoring, and status updates of leads, presenting them in a high-performance dashboard.

### 1.3 Change Log
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-11-26 | 1.0 | Initial MVP Release | John (PM) |
| 2025-11-26 | 1.1 | Added Seed Data Story | Sarah (PO) |

## 2. Requirements

### 2.1 Functional Requirements (FR)

**Lead Management (Frontend & API)**
*   **FR1 - Dashboard Table:** Display a paginated list of leads with columns: `Lead Name`, `Status`, `Tags`, `Score`, `Last Interaction`, `Source`.
*   **FR2 - Live Search:** Filter leads by name or email in real-time (< 200ms latency).
*   **FR3 - Advanced Filters:**
    *   Filter by **Status** (Dropdown: New, Qualified, Won, Lost, etc.).
    *   Filter by **Score Range** (Min/Max).
    *   Filter by **Tags** (Multi-select).
*   **FR4 - Inline Editing:** Users must be able to change a lead's `Status` and add/remove `Tags` directly from the table row without navigating away.
*   **FR5 - Lead Detail View:** Clicking a lead row navigates to a dedicated page showing:
    *   Lead Metadata (Name, Email, Source).
    *   Score History (Current Score + Graph/Log).
    *   Message Timeline (Chronological list of interactions).
*   **FR6 - Data Export:** A button to export all leads data as a **CSV file** via the API.

**Backend API**
*   **FR7 - Lead CRUD:** Endpoints to Create, Read, Update, and Delete leads.
*   **FR8 - Messaging:** Endpoints to log new messages (`POST`) and retrieve message history (`GET`).
*   **FR9 - Export:** Endpoint (`GET /export`) to generate CSV.

**Automations (n8n)**
*   **FR10 - Inbound Flow:** Webhook receives JSON payload -> Checks if lead exists (by user/email) -> Creates new lead OR Updates existing lead's `last_interaction` and logs message.
*   **FR11 - Scoring Flow:** Triggered on new message -> Analyzes content (Positive words +10/20, Negative -10) -> Updates Lead Score -> If Score > 40, auto-update Status to "Qualified".
*   **FR12 - Scheduler Flow:** Runs periodically (CRON) -> Checks `last_interaction`:
    *   If > 2 hours: Set Status to "Needs Followup".
    *   If > 48 hours: Set Status to "Cold".

### 2.2 Non-Functional Requirements (NFR)
*   **NFR1 - Setup Time:** Zero-config startup. `npm install && npm run dev` must work immediately.
*   **NFR2 - Local Storage:** Use **SQLite** to avoid requiring the user to install/configure a database server.
*   **NFR3 - UI Responsiveness:** Dashboard must be fully functional on Desktop; readable on Mobile.
*   **NFR4 - Security:** Authentication is **NOT** required for this demo (Open Access).

## 3. User Interface Design Goals

### 3.1 Overall UX Vision
A "high-density" professional workspace similar to **Linear** or **Notion**. Avoid excessive whitespace; prioritize data visibility and quick actions.

### 3.2 Core Screens
1.  **Dashboard (Home):**
    *   **Header:** Search bar (full width or prominent), Filter chips/dropdowns, "Export CSV" button (top right).
    *   **Main Content:** Data Grid/Table. Rows should have hover states. Status should use colored badges/dots. Tags should be pill-shaped.
    *   **Footer:** Simple pagination (Prev/Next).
2.  **Lead Details (`/leads/[id]`):**
    *   **Layout:** Two-column layout.
    *   **Left Column (30%):** Static Info Card (Avatar, Name, Email, Current Score, Status Dropdown).
    *   **Right Column (70%):** Activity Feed / Timeline. Messages appear as chat bubbles or timeline events.

### 3.3 Branding & Style
*   **Framework:** **ShadCN UI** (preferred for speed/aesthetics) + **Tailwind CSS**.
*   **Typography:** Inter or similar clean sans-serif.
*   **Colors:**
    *   **Background:** White / Slate-50.
    *   **Accents:** Indigo/Blue for primary actions.
    *   **Status Colors:** Green (Won/Qualified), Yellow (New/Needs Followup), Red (Lost/Cold), Gray (No Show).

## 4. Technical Assumptions

*   **Repository Structure:** Monorepo.
    *   `/frontend` (Next.js)
    *   `/backend` (Node/Express)
    *   `/n8n` (Docker config/Workflow JSONs)
*   **Frontend:** Next.js 14 (App Router).
*   **Backend:** Node.js with Express.
*   **Database:** SQLite (file-based).
*   **ORM:** Prisma (for schema management and type safety).
*   **Automation:** n8n (running locally via npx).

## 5. Epic List

### Epic 1: Foundation & Backend
**Goal:** Establish the project structure, database schema, and core API endpoints.
*   **Value:** Enables the frontend and automation layers to function.

### Epic 2: Frontend Dashboard
**Goal:** Build the user-facing interface for lead management.
*   **Value:** Provides the primary interaction layer for the user.

### Epic 3: Automation Logic (n8n)
**Goal:** Implement the "brain" of the CRM to handle scoring and status updates.
*   **Value:** Delivers the "magic" that reduces manual work.

### Epic 4: Polish & Deliver
**Goal:** Finalize documentation, export flows, and record the demo.
*   **Value:** Ensures the project is submittable and meets evaluation criteria.

## 6. Detailed User Stories

### Epic 1: Foundation & Backend

**Story 1.1: Project Setup & Database**
*   **As a** Developer, **I want** to initialize the monorepo with Next.js, Express, and Prisma/SQLite, **so that** I have a working environment.
*   **AC:**
    *   Repo structure created.
    *   Prisma schema defined (`Lead`, `Message` models).
    *   `npm run dev` starts both servers + n8n.

**Story 1.2: Lead CRUD API**
*   **As a** Frontend Dev, **I want** endpoints to manage leads, **so that** I can display and edit them.
*   **AC:**
    *   `GET /leads` (supports filtering/sorting).
    *   `POST /leads` (creates new lead).
    *   `PUT /leads/:id` (updates status/tags/score).
    *   `DELETE /leads/:id`.

**Story 1.3: Message & Export API**
*   **As a** System, **I want** to log messages and export data, **so that** history is preserved and portable.
*   **AC:**
    *   `POST /messages` (saves message, links to lead).
    *   `GET /messages/:leadId` (returns history).
    *   `GET /export` (returns `.csv` file download).

**Story 1.4: Comprehensive Seed Data**
*   **As a** User, **I want** the system to be populated with realistic data on first launch, **so that** I can test features without manual entry.
*   **AC:**
    *   Seed script creates 10+ Leads with varied statuses.
    *   Leads have realistic tags and scores.
    *   Messages are linked to leads to show timeline history.

### Epic 2: Frontend Dashboard

**Story 2.1: Lead Table & Filters**
*   **As a** User, **I want** to view, search, and filter leads, **so that** I can find relevant contacts quickly.
*   **AC:**
    *   Table renders mock/real data.
    *   Search bar filters by name/email instantly.
    *   Dropdowns filter by Status and Tags.

**Story 2.2: Inline Editing**
*   **As a** User, **I want** to update status and tags from the table, **so that** I don't have to open every lead page.
*   **AC:**
    *   Clicking Status opens a dropdown to change it. Backend updates immediately.
    *   Clicking Tags allows adding/removing tags.

**Story 2.3: Lead Detail View**
*   **As a** User, **I want** to see the conversation history, **so that** I have context for the lead.
*   **AC:**
    *   Page displays lead details.
    *   Timeline component renders messages in chronological order.

### Epic 3: Automation Logic

**Story 3.1: Inbound & Scoring Workflows**
*   **As a** Sales Rep, **I want** incoming messages to auto-create leads and update scores, **so that** I focus on qualified prospects.
*   **AC:**
    *   n8n workflow listens for Webhook.
    *   Logic checks DB for existing user.
    *   Score updated based on keywords (+/-).
    *   Status updated to "Qualified" if Score > 40.

**Story 3.2: Scheduler Workflow**
*   **As a** Manager, **I want** leads to be marked "Cold" if neglected, **so that** we can re-engage them.
*   **AC:**
    *   n8n Cron triggers every X minutes.
    *   Updates status based on `last_interaction` timestamp (2h / 48h logic).

### Epic 4: Polish & Deliver

**Story 4.1: Documentation & Demo**
*   **As a** Evaluator, **I want** clear instructions and a demo video, **so that** I can verify the solution quickly.
*   **AC:**
    *   `README.md` contains "How to run" steps.
    *   n8n workflows exported to JSON and included in repo.
    *   2-min video recording covers all 5 requirements.