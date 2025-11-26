# Story 2.3: Lead Detail View

**Status:** Complete

**Story:**
**As a** User,
**I want** to see the full context and conversation history of a lead,
**so that** I can understand their journey and make informed decisions.

**Acceptance Criteria:**
1.  **Navigation:** Clicking a row in the Dashboard navigates to `/leads/[id]`.
2.  **Layout:** Page uses a two-column layout (responsive: stacks on mobile).
    *   **Left (Info):** Displays Avatar, Name, Email, Source, Current Score, and Status.
    *   **Right (Timeline):** Displays a scrollable list of messages.
3.  **Timeline:**
    *   Messages are ordered chronologically (newest at bottom).
    *   **Inbound** messages align left (gray bubble).
    *   **Outbound** messages align right (blue/primary bubble).
    *   Each message shows a timestamp (e.g., "Oct 24, 10:30 AM").
4.  **Score History:** A visual indicator (simple chart or list) showing how the score has changed over time (derived from `scoring_history` or inferred from message logs if separate table not used). *MVP simplification: Just show current score prominent.*
5.  **Back Navigation:** A "Back to Dashboard" button/link at the top.
6.  **Error Handling:** Displays a "Lead Not Found" state if the ID is invalid.

**Tasks / Subtasks:**
- [x] **Setup Components:**
    - [x] Install ShadCN `card`, `separator`, `scroll-area`.
- [x] **API Integration:**
    - [x] Add `fetchLeadDetails(id)` to `lib/api.ts` (calls `GET /api/leads/:id`).
    - [x] Add `fetchMessages(id)` to `lib/api.ts` (calls `GET /api/messages/:id`).
- [x] **Build Info Card (Left Column):**
    - [x] Create `components/LeadInfoCard.tsx`.
    - [x] Display metadata fields.
    - [x] Include a prominent "Score" badge/display.
- [x] **Build Timeline (Right Column):**
    - [x] Create `components/MessageTimeline.tsx`.
    - [x] Map message data to chat bubbles.
    - [x] Style based on `direction` (INBOUND/OUTBOUND).
- [x] **Assemble Page:**
    - [x] Create `app/leads/[id]/page.tsx`.
    - [x] Fetch data (Server Component or Client Component with `useEffect`).
    - [x] Render layout.

**Dev Notes:**
- **Routing:** Next.js App Router uses dynamic routes `[id]`.
- **Styling:** Use Tailwind's `flex-row-reverse` for outbound messages to easily align them right.
- **Score History:** The PRD mentions "Score History". If we don't have a specific `ScoringHistory` table in the MVP database schema (we only defined `Lead` and `Message`), we can display the **Current Score** prominently. If we want history, we'd need to log score changes. For this 24h MVP, sticking to **Current Score** is safer unless we added the table in Story 1.1. *Assumption: Display Current Score only for MVP speed.*

***
