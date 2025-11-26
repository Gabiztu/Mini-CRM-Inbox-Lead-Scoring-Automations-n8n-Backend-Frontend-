# Project Brief: Mini-CRM + Inbox + Lead Scoring + Automations

## 1. Executive Summary
**Project Name:** Mini-CRM + Inbox + Lead Scoring + Automations
**Concept:** A lightweight, end-to-end CRM system integrating a modern frontend dashboard, a backend with CRUD capabilities, and n8n automations for lead scoring and scheduling.
**Primary Problem:** The need for a rapid, scalable, and automated system to manage leads and interactions without manual overhead.
**Target Market:** Internal Sales/Support teams or evaluators testing technical delivery speed.
**Value Proposition:** Delivers a fully functional, automated lead management loop (Inbound -> Score -> Schedule -> Export) within a 24-hour delivery window.

## 2. Problem Statement
- **Current State:** Leads and messages are likely unorganized or require manual tracking.
- **Pain Points:** Manual scoring is slow; follow-ups are missed (cold leads); data export is cumbersome.
- **Impact:** Lost sales opportunities and inefficient workflows.
- **Urgency:** **Critical.** The project has a strict 24-hour deadline.

## 3. Proposed Solution
- **Core Concept:** A 3-tier architecture:
    1.  **Frontend:** React/Next.js dashboard for lead management.
    2.  **Backend:** Node.js/Express (or Python) API for data persistence.
    3.  **Automation:** n8n workflows handling logic (scoring, scheduling, ingestion).
- **Differentiators:** Heavy reliance on n8n for business logic to speed up development and ensure flexibility.
- **Vision:** A clean, "Notion-style" interface that feels fast and modern.

## 4. Target Users
- **Primary Segment:** Sales/Support Agents.
    - **Needs:** Quick view of lead status, timeline history, and ability to tag/score leads instantly.
    - **Goals:** Qualify leads (Score > 40) and ensure timely follow-ups.

## 5. Goals & Success Metrics
### Business Objectives
- Deliver a working end-to-end system within 24 hours.
- Demonstrate code quality and architectural coherence.

### User Success Metrics
- **Speed:** "Run in <5 minutes" via README instructions.
- **Completeness:** All 4 n8n flows working (Inbound, Scoring, Follow-up, Export).
- **Usability:** UI allows editing status/tags and viewing timelines without errors.

### KPIs
- **Bugs:** 0 Major bugs in the video demo.
- **Latency:** Live search and filtering response < 200ms (target).

## 6. MVP Scope
### Core Features (Must Have)
- **Dashboard Table:** Columns for Name, Status, Tags, Score, Last Interaction, Source.
- **Live Search & Filters:** Filter by status, score range, tags.
- **Inline Editing:** Edit status and tags (add/remove) directly in the table.
- **Lead Detail Page:** Message timeline, lead info, score history.
- **Backend API:** Endpoints for Leads (CRUD), Messages (GET/POST), Export (CSV).
- **Automations (n8n):**
    1.  Inbound Webhook -> Create/Update Lead.
    2.  Scoring Logic (+10/+20/-10) -> Update Status if Qualified.
    3.  Scheduler -> Update status to "Needs Followup" (2h) or "Cold" (48h).
    4.  CSV Export flow.

### Out of Scope (for 24h)
- Complex Authentication (unless clarified).
- Multi-tenancy (multiple user accounts).
- Advanced analytics or reporting charts.
- Third-party integrations beyond n8n.

### MVP Success Criteria
- A 2-minute video demo showing the full loop: Inbound Message -> Timeline Update -> Auto-Scoring -> UI Update -> CSV Export.

## 7. Technical Considerations
### Platform Requirements
- **Web:** Modern browser support (Chrome/Edge/Firefox).
- **Responsiveness:** Desktop focused (dashboard), but clean on mobile.

### Technology Preferences (Suggested for Speed)
- **Frontend:** React + Vite or Next.js (for speed and modern UI components like ShadCN or Tailwind).
- **Backend:** Node.js (Express or Fastify) or Python (FastAPI).
- **Database:** SQLite (easiest for "run in <5 mins") or PostgreSQL (via Docker).
- **Automation:** n8n (Self-hosted or Cloud).

### Architecture Considerations
- **Repository:** Monorepo or simple separate folders (frontend/backend).
- **Integration:** Backend must expose APIs callable by n8n; n8n must call Backend APIs.

## 8. Constraints & Assumptions
### Constraints
- **Time:** **24 Hours remaining.**
- **Deliverables:** GitHub Repo + n8n JSON exports + Video Demo.

### Key Assumptions
- Users have Docker or Node.js installed to run the repo.
- "Last Interaction" is updated via the Inbound Message flow.
- The "Screenshot" style implies a clean, tabular layout with badges for tags.

## 9. Risks & Open Questions
- **Risk:** n8n setup complexity for the evaluator (how do they run the n8n flows?).
    - *Mitigation:* Provide a Docker Compose file that spins up n8n + Backend + DB + Frontend together.
- **Risk:** Missing the visual style target.
    - *Mitigation:* Use a high-quality UI library (e.g., ShadCN/ui).
- **Question:** Is Authentication required? (Assumed NO for MVP speed, but risky).

## 10. Next Steps
1.  **PM Handoff:** Pass this brief to the PM to generate the PRD.
2.  **Clarify:** Get answers on Auth and Hosting.
3.  **Setup:** Initialize the repo immediately.

***
