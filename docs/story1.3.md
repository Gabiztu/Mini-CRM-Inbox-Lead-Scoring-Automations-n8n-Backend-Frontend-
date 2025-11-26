# Story 1.3: Message & Export API

**Status:** Done

**Story:**
**As a** System,
**I want** to log messages and export lead data,
**so that** conversation history is preserved and data is portable.

**Acceptance Criteria:**
1.  **POST /api/messages:** Creates a new message record.
    *   Accepts `{ leadId, content, direction }`. (`direction` enum: INBOUND, OUTBOUND).
    *   **Critical Side Effect:** Automatically updates the `lastInteraction` timestamp on the associated **Lead** to the current time.
2.  **GET /api/messages/:leadId:** Retrieves message history for a specific lead.
    *   Returns list sorted by `timestamp` ascending (oldest to newest).
3.  **GET /api/export:** Generates and downloads a CSV file.
    *   Returns `Content-Type: text/csv`.
    *   Filename: `leads-export-[timestamp].csv`.
    *   Columns: ID, Name, Email, Status, Score, Source, Last Interaction.
4.  **Error Handling:** Returns 404 if Lead ID not found.

**Tasks / Subtasks:**
- [x] **Message Controller & Service:**
    - [x] Implement `createMessage`:
        - [x] Prisma create on `Message` model.
        - [x] Prisma update on `Lead` model (set `lastInteraction = now()`).
    - [x] Implement `getMessages`:
        - [x] Prisma findMany with `where: { leadId }` and `orderBy: { timestamp: 'asc' }`.
- [x] **Export Controller:**
    - [x] Implement `exportLeads`:
        - [x] Fetch all leads from DB.
        - [x] Convert JSON to CSV format (using a library like `json2csv` or manual mapping).
        - [x] Set response headers (`Content-Disposition`, `Content-Type`).
        - [x] Stream/Send response.
- [x] **Register Routes:** Add `messages.routes.ts` and `export.routes.ts`.
- [x] **Manual Test:**
    - [x] Post a message -> Check if Lead's `lastInteraction` updated.
    - [x] Hit `/api/export` in browser -> Check if file downloads.

**Dev Notes:**
- **Transaction:** When creating a message, updating the Lead's `lastInteraction` is crucial for the **Scheduler Automation** (Story 3.2) to work correctly later. Consider using `prisma.$transaction` to ensure data consistency.
- **CSV:** For the export, a simple library like `json2csv` is recommended to handle escaping (e.g., commas in names) correctly without reinventing the wheel.
- **DateFormat:** Ensure dates in the CSV are readable (e.g., ISO string or simplified local date).

***

