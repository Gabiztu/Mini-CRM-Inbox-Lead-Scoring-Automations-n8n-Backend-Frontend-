 # Demo Script (5–7 minutes)

 Follow these steps to record the demo without interruptions.

 1) Dashboard & Filters
 - Start: `npm run dev`
 - Open http://localhost:3000
 - Show search (name/email) and Status filter; paginate if needed.

 2) Inline Editing
 - On the main table, change a lead’s Status via the dropdown.
 - Toggle/add Tags via the tags popover. Show optimistic update + toast.

 3) Trigger Inbound Webhook (n8n)
 - In a terminal:
 ```
 curl -X POST http://localhost:5678/webhook/inbound \
   -H "Content-Type: application/json" \
   -d '{
     "user": "demo@example.com",
     "message": "Interested in a demo and pricing. Urgent!",
     "timestamp": "2025-11-26T20:30:00.000Z"
   }'
 ```
 - Expect: lead created/updated; message logged.

 4) Timeline Update & Score Change
 - Click any row to open /leads/[id].
 - Show new INBOUND message in the timeline and updated Score/Status (QUALIFIED if score > 40).

 5) Export CSV
 - Download from API: http://localhost:4000/api/export
 - Open the file to show headers and rows.

 Tips
 - If DB is empty, run once: `npm run db:push && npm run db:seed`.
 - If ports are busy, stop other apps using 3000/4000/5678.
 - If Windows/Prisma install error, re-run dev without reinstall or pause antivirus.