# Story 2.1: Lead Table & Filters

**Status:** Complete

**Story:**
**As a** User,
**I want** to view, search, and filter leads in a high-density table,
**so that** I can find relevant contacts quickly and see their current status.

**Acceptance Criteria:**
1.  **Page Layout:** The root path (`/`) displays the main Dashboard layout with a header and main content area.
2.  **Data Fetching:** The page fetches the list of leads from `GET /api/leads` upon loading.
3.  **Table Rendering:** Displays a table with the following columns:
    *   **Name:** Avatar (placeholder) + Name + Email.
    *   **Status:** Colored badge indicating status.
    *   **Tags:** List of colored pills.
    *   **Score:** Numeric value.
    *   **Last Interaction:** Relative time (e.g., "2 hours ago").
    *   **Source:** Text icon/label.
4.  **Live Search:** A search input in the header filters leads by name or email.
    *   *Implementation:* Can be client-side filtering for MVP speed (since we have <1000 leads).
5.  **Status Filter:** A dropdown allows filtering by specific statuses (e.g., "Show only Qualified").
6.  **Pagination:** Simple "Previous" and "Next" buttons at the bottom of the table.
7.  **Loading State:** Displays a skeleton loader while data is being fetched.

**Tasks / Subtasks:**
- [x] **Setup Components:**
    - [x] Install ShadCN components: `table`, `input`, `select`, `badge`, `avatar`, `skeleton`, `button`.
    - [x] Create `components/ui` folder if not exists.
- [x] **API Integration:**
    - [x] Create `lib/api.ts` with a `fetchLeads` function.
    - [x] Define TypeScript interfaces for `Lead`, `Tag`, etc.
- [x] **Build Data Table:**
    - [x] Create `components/LeadTable.tsx`.
    - [x] Implement table structure using ShadCN `Table` components.
    - [x] Map lead data to rows.
    - [x] Format "Last Interaction" using `date-fns` (distance to now).
- [x] **Implement Filters:**
    - [x] Add Search Input above table.
    - [x] Add Status Select dropdown.
    - [x] Implement filtering logic (Client-side `filter()` on the leads array is sufficient and fastest for MVP).
- [x] **Assemble Page:**
    - [x] Update `app/page.tsx` to use the `LeadTable` component.
    - [x] Handle loading and error states.

**Dev Notes:**
- **TanStack Table:** While ShadCN often uses TanStack Table, for a strict 24h MVP with simple requirements, a simple map over the data array is faster to build and easier to debug than setting up the full TanStack boilerplate. Use your judgment—if you can scaffold TanStack fast, do it; otherwise, keep it simple.
- **Client-Side Filtering:** Since we are seeding ~15 leads, fetching all and filtering in the browser is instant and saves backend complexity.
- **Icons:** Use `lucide-react` for icons (Search, Filter, etc.).

***
