# Story 1.4: Comprehensive Seed Data

**Status:** Draft

**Story:**
**As a** User,
**I want** the system to be populated with realistic data on first launch,
**so that** I can test features and demo the UI without manual entry.

**Acceptance Criteria:**
1.  **Volume:** Seed script creates at least **15 Leads**.
2.  **Variety:** Leads have mixed statuses (`New`, `Qualified`, `Won`, `Lost`, `Needs Followup`) and varying scores.
3.  **Tags:** Leads have associated tags (e.g., "High Value", "Referral", "Urgent") with colors.
4.  **History:** At least 5 leads have a history of **3+ messages** (Inbound and Outbound) to populate the timeline view.
5.  **Execution:** The seed runs automatically via `npx prisma db seed` (configured in `package.json`).
6.  **Idempotency:** The script handles re-runs gracefully (e.g., uses `upsert` or deletes existing data before seeding).

**Tasks / Subtasks:**
- [ ] **Configure Prisma Seeding:**
    - [ ] Add `prisma.seed` config to `backend/package.json`.
- [ ] **Create Seed Script:** `backend/prisma/seed.ts`.
    - [ ] **Clean:** Delete existing `Message`, `Tag`, and `Lead` records (in correct order).
    - [ ] **Define Data:** Create static arrays of realistic names, emails, and scenarios.
    - [ ] **Insert Leads:** Loop through data and create leads.
    - [ ] **Insert Tags:** Attach tags to specific leads.
    - [ ] **Insert Messages:** Create conversation history for a subset of leads.
- [ ] **Test:** Run `npx prisma db seed` and verify data exists in SQLite (using Prisma Studio or CLI).

**Dev Notes:**
- **Realistic Data:** Do not use "Test 1", "Test 2". Use names like "Alice Smith", "Globex Corp".
- **Status Enum:** Ensure statuses match exactly what the Frontend expects: `NEW`, `QUALIFIED`, `WON`, `LOST`, `COLD`, `NEEDS_FOLLOWUP`.
- **Message Timestamps:** When seeding messages, offset their timestamps (e.g., `Date.now() - 100000`) so they appear in chronological order in the timeline.
- **Dependencies:** You can use `@faker-js/faker` for generation, or just a hardcoded JSON array to keep the project lighter. Hardcoded is fine for 15 records.

***
