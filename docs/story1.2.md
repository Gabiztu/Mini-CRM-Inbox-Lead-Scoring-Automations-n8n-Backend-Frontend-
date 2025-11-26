# Story 1.2: Lead CRUD API

Status: Done

Acceptance Criteria:
- GET /leads supports search/filter/sort/pagination
- POST /leads creates a new lead
- PUT /leads/:id updates status/tags/score (and basic fields)
- DELETE /leads/:id removes a lead

Tasks:
- [x] Setup CORS for http://localhost:3000
- [x] Initialize Prisma client usage in backend
- [x] Implement GET /leads with filters (q, status, minScore, maxScore, tags) and pagination
- [x] Implement POST /leads (with optional tags)
- [x] Implement PUT /leads/:id (status/score/tags replace)
- [x] Implement DELETE /leads/:id
- [x] Validate endpoints locally (manual smoke)
