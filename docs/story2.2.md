# Story 2.2: Inline Editing

**Status:** Complete

**Story:**
**As a** User,
**I want** to update a lead's status and tags directly from the dashboard table,
**so that** I can process multiple leads quickly without opening their detail pages.

**Acceptance Criteria:**
1.  **Status Editing:** Clicking the Status badge on a row opens a dropdown/select menu with available statuses. Selecting a new status immediately updates the backend.
2.  **Tag Editing:** Clicking the Tags area opens a popover allow adding or removing tags.
    *   Displays current tags.
    *   Allows selecting from existing tags (if any) or creating new ones (optional, simple add/remove is priority).
3.  **Feedback:** Success toast notification appears upon successful update. Error toast appears on failure.
4.  **Performance:** The UI should feel responsive (optimistic updates preferred, or fast loading state).
5.  **Persistence:** Changes persist after page reload (API call to `PUT /api/leads/:id` is successful).

**Tasks / Subtasks:**
- [x] **Setup Components:**
    - [x] Lightweight custom `toast`, `dropdown`, and `popover` UIs implemented (no external deps) to meet MVP.
- [x] **Implement Status Cell:**
    - [x] Create `components/StatusCell.tsx`.
    - [x] Dropdown listing statuses (`NEW`, `QUALIFIED`, `WON`, `LOST`, `COLD`, `NEEDS_FOLLOWUP`).
    - [x] On select -> Calls `updateLead(id, { status })` with optimistic update and toast feedback.
- [x] **Implement Tag Cell:**
    - [x] Create `components/TagCell.tsx`.
    - [x] Popover with toggleable list of available tags and an input to add a new tag.
    - [x] On toggle/add -> Calls `updateLead(id, { tags })` and updates local state from API response.
- [x] **API Integration:**
    - [x] Update `lib/api.ts` with `updateLead` function.
    - [x] Confirmed payload matches backend (tags: string[]; status: string).
- [x] **State Management:**
    - [x] LeadTable updates row state immediately; tag updates reconcile with server response.

**Dev Notes:**
- **Status Colors:** Ensure the Status Cell maintains the correct color coding (e.g., Green for WON) even while inside the dropdown trigger.
- **Tag UX:** The "Notion-style" tag edit usually looks like a list where you check/uncheck items. For MVP, a simple list of "Available Tags" that you click to toggle is sufficient.
- **Optimistic UI:** If possible, update the local data array immediately before waiting for the API response to make it feel "instant". Revert if API fails.

***
