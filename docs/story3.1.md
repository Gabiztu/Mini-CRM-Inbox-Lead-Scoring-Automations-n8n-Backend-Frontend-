# Story 3.1: Inbound & Scoring Workflows

**Status:** Complete

**Story:**
**As a** Sales Rep,
**I want** incoming messages to automatically create leads and update their scores,
**so that** I can focus on qualified prospects without manual data entry.

**Acceptance Criteria:**
1.  **Webhook Trigger:** The workflow starts when a JSON payload is POSTed to the n8n Webhook node (`POST /webhook/inbound`).
    *   Payload: `{ "user": "string", "message": "string", "timestamp": "ISO" }`.
2.  **Lead Lookup:** The workflow queries the Backend API (`GET /api/leads?search={user}`) to check if the lead exists.
3.  **Branch Logic (New vs Existing):**
    *   **If New:** Calls `POST /api/leads` to create the lead.
    *   **If Existing:** Uses the existing Lead ID.
4.  **Message Logging:** Calls `POST /api/messages` to save the interaction.
5.  **Scoring Logic:** Analyzes the message content:
    *   **+10 points** for positive keywords (e.g., "interested", "demo", "pricing").
    *   **+20 points** for strong signals (e.g., "buy", "contract", "urgent").
    *   **-10 points** for negative keywords (e.g., "unsubscribe", "remove", "no thanks").
6.  **Score Update:** Calculates the new total score and calls `PUT /api/leads/:id` with the new score.
7.  **Qualification:** If the new Score > 40, automatically updates the status to **"Qualified"** (via the same PUT request).
8.  **Output:** The workflow returns a success JSON response.

**Tasks / Subtasks:**
- [x] **Design Workflow Structure:**
    - [x] Node 1: Webhook (POST).
    - [x] Node 2: HTTP Request (GET Lead).
    - [x] Node 3: If/Switch (Found vs Not Found).
    - [x] Node 4 (True): HTTP Request (Create Lead).
    - [x] Node 5: HTTP Request (Create Message).
    - [x] Node 6: Code/Set Node (Calculate Score based on regex/keywords).
    - [x] Node 7: HTTP Request (Update Lead Score/Status).
- [x] **Generate JSON:**
    - [x] Construct the valid n8n workflow JSON structure representing these nodes and connections.
    - [x] Save to `docs/workflows/inbound_scoring.json` and auto-copy to `n8n_data/workflows/inbound_scoring.json` on dev start.
- [x] **Auto-Import Setup:**
    - [x] `predev:n8n` script copies the workflow into `n8n_data/workflows/` before n8n starts.
    - *MVP fallback:* The JSON is also committed under `docs/workflows/` for manual import.

**Dev Notes:**
- **Keyword Matching:** Use a simple Javascript Code node in n8n for the scoring logic.
  ```javascript
  const text = items[0].json.message.toLowerCase();
  let scoreDelta = 0;
  if (text.includes('buy') || text.includes('contract')) scoreDelta += 20;
  else if (text.includes('interested')) scoreDelta += 10;
  if (text.includes('unsubscribe')) scoreDelta -= 10;
  return { json: { scoreDelta } };
  ```
- **Webhook URL:** When running locally via `npx`, the URL will likely be `http://localhost:5678/webhook/inbound` (or `.../webhook-test/inbound` for testing).
- **Backend URL:** Since n8n is running on the *same host* (localhost) via `concurrently`, it can access the backend at `http://localhost:4000/api/...`.

***

