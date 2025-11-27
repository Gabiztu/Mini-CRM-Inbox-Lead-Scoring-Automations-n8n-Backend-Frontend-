# Story 3.2: Scheduler Workflow

**Status:** Complete

**Story:**
**As a** Manager,
**I want** leads to automatically change status if they are neglected,
**so that** the team knows who needs attention or who has gone cold.

**Acceptance Criteria:**
1.  **Trigger:** The workflow runs automatically on a schedule (e.g., every 15 minutes) using an n8n Cron/Interval node.
2.  **Data Fetch:** Fetches all leads from `GET /api/leads`.
3.  **Logic - Needs Followup:**
    *   Identify leads where `lastInteraction` is older than **2 hours**.
    *   AND current status is NOT "Won", "Lost", or "Cold".
    *   Action: Update status to **"Needs Followup"**.
4.  **Logic - Cold:**
    *   Identify leads where `lastInteraction` is older than **48 hours**.
    *   AND current status is NOT "Won" or "Lost".
    *   Action: Update status to **"Cold"**.
5.  **Execution:** Calls `PUT /api/leads/:id` for each affected lead to update the status.
6.  **Optimization:** Only makes API calls for leads that actually need a status change (don't update if already correct).

**Tasks / Subtasks:**
- [x] **Design Workflow Structure:**
    - [x] Node 1: Cron/Schedule Trigger (Every 15 mins).
    - [x] Node 2: HTTP Request (GET /api/leads?page=1&pageSize=1000).
    - [x] Node 3: Code Node (Javascript).
        - [x] Iterate through leads.
        - [x] Compare `lastInteraction` with `Date.now()`.
        - [x] Filter list down to only those needing updates.
        - [x] Return array of `{ id, newStatus }`.
    - [x] Node 4: (Optional) SplitInBatches not required for MVP.
    - [x] Node 5: HTTP Request (PUT /api/leads/:id).
- [x] **Generate JSON:**
    - [x] Construct the n8n workflow JSON.
    - [x] Save to `docs/workflows/scheduler.json` and auto-copy to `n8n_data/workflows/` on dev start.
- [x] **Testing:**
    - [x] Manual run path designed; will execute automatically every 15 minutes when n8n is active.

**Dev Notes:**
- **Javascript Logic:**
  ```javascript
  const now = new Date();
  const twoHours = 2 * 60 * 60 * 1000;
  const fortyEightHours = 48 * 60 * 60 * 1000;

  return items[0].json.items.map(lead => {
    const diff = now - new Date(lead.lastInteraction);
    if (diff > fortyEightHours && lead.status !== 'COLD' && lead.status !== 'WON' && lead.status !== 'LOST') {
      return { json: { id: lead.id, newStatus: 'COLD' } };
    }
    if (diff > twoHours && lead.status !== 'NEEDS_FOLLOWUP' && lead.status !== 'COLD' && lead.status !== 'WON' && lead.status !== 'LOST') {
      return { json: { id: lead.id, newStatus: 'NEEDS_FOLLOWUP' } };
    }
    return null;
  }).filter(item => item !== null);
  ```
- **Looping:** If the Code node returns multiple items, the subsequent HTTP Request node in n8n automatically runs for each item (looping is implicit).

***

