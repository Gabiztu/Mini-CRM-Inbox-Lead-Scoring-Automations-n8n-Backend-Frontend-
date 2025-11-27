# Mini‑CRM: Inbox, Lead Scoring, Automations (n8n)

Aplicație demo minimală de CRM cu:
- Frontend: Next.js 16, React 19, TypeScript
- Backend: Express + Prisma (SQLite)
- Automations: n8n (Webhookuri + Cron)

## Cerințe
- Node.js 20+
- Windows PowerShell sau terminal compatibil
- Porturi libere: 3000 (frontend), 4000 (backend), 5678 (n8n)

## Instalare rapidă
1) Instalare dependențe și setare DB:
   npm run setup
   (rulează: npm install, prisma db push, seed)

2) Pornire tot stack‑ul (frontend + backend + n8n):
   npm run dev in folderul principal al proiectului
   - Frontend: http://localhost:3000
   - API: http://localhost:4000
   - n8n: http://localhost:5678

Note:
- Workflowurile n8n se copiază automat din docs/workflows în n8n_data/workflows la pornirea n8n (script: scripts/prepare-n8n.js).
- Dacă vrei să refaci starea DB: npm run db:push && npm run db:seed

## Structură
- frontend/ — aplicația Next.js
- backend/ — API Express + Prisma (SQLite)
- docs/workflows/ — fișierele n8n:
  - inbound_scoring.json (Flow 1)
  - lead_scoring.json (Flow 2)
  - export_csv.json (Flow 3)
  - scheduler.json (Flow 4)

## API — puncte principale
- Leads:
  - GET  http://localhost:4000/api/leads?page=1&pageSize=20
  - GET  http://localhost:4000/api/leads/:id
  - PUT  http://localhost:4000/api/leads/:id  (ex: { status, score })
- Mesaje:
  - GET  http://localhost:4000/api/messages/:leadId
  - POST http://localhost:4000/api/messages  { leadId, content, direction: "INBOUND"|"OUTBOUND", timestamp? }
- Export:
  - GET  http://localhost:4000/api/export           (CSV direct din backend)
  - GET  http://localhost:4000/api/export/n8n        (proxy la workflow n8n “export”)

## n8n — Flows (4)
1) Flow 1: Mesaj Inbound → CRM
   Endpoint: POST http://localhost:5678/webhook/inbound
   Body așteptat:
   {
     "user": "john.doe",
     "message": "Sunt interesat de preț",
     "timestamp": "2025-11-27T10:00:00.000Z"  // opțional
   }
   Efect:
   - caută un lead (dacă nu există, creează cu email user@exemple.com),
   - salvează mesajul ca INBOUND în CRM,
   - calculează un delta scor și face PUT /api/leads/:id.


2) Flow 2: Lead Scoring (webhook dedicat)
   Endpoint: POST http://localhost:5678/webhook/lead-scoring
   Body:
   {
     "leadId": "<ID-ul leadului>",
     "message": "urgent contract"
   }
   Efect:
   - citește leadul, calculează scorul (+20 pentru “buy/contract/urgent”, +10 pentru “interested/demo/pricing”, −10 pentru “unsubscribe/remove/no thanks”),
   - dacă scorul > 40 și statusul nu e WON/LOST, setează QUALIFIED,
   - PUT /api/leads/:id cu { score, status? }.

   Test (PowerShell):
   $leadId = '9234cdf7-21a9-47d5-822f-ce971b81cf26' 

   Invoke-WebRequest -Uri 'http://localhost:5678/webhook/lead-scoring' -Method POST -ContentType 'application/json' -Body (@{ leadId=$leadId; message='urgent' } | ConvertTo-Json -Depth 5)

   Istoric scor (opțional, dacă ui-ul îl afișează): Invoke-RestMethod -Uri "http://localhost:4000/api/leads/$leadId" 

3) Flow 3: Export CSV
   Endpoint: GET http://localhost:5678/webhook/export
   Efect:
   - citește leadurile din API,
   - generează CSV cu antet “sep=,” + CRLF pentru Excel,
   - răspunde cu text/csv.

   Descărcare (PowerShell):
   Invoke-WebRequest -Uri "http://localhost:5678/webhook/export" -OutFile "$env:USERPROFILE\\Desktop\\leads-export.csv"

   Dacă Excel afișează totul pe o singură linie:
   - asta va fi o problema pentru mai tarziu, important este ca se descarca toate informatiile

   Alternativ backend:
   - GET http://localhost:4000/api/export         (CSV backend)
   - GET http://localhost:4000/api/export/n8n     (CSV via workflow n8n)

4) Flow 4: Scheduler (Cron, la fiecare minut)
   Efect:
   - marchează leadurile ca:
     - NEEDS_FOLLOWUP dacă ultima interacțiune > 2 ore,
     - COLD dacă > 48 ore (ignoră WON/LOST).
   - face PUT /api/leads/:id cu noul status.

   Test rapid (simulează inactivitate):
   $leadId = '9234cdf7-21a9-47d5-822f-ce971b81cf26' 

   $ts = (Get-Date).AddHours(-3).ToString("o")   # >2h pentru NEEDS_FOLLOWUP

   $ts=(Get-Date).AddHours(-72).ToString('o'); Invoke-RestMethod -Uri 'http://localhost:4000/api/messages' -Method POST -ContentType 'application/json' -Body (@{ leadId=$leadId; content='backdate 72h'; direction='INBOUND'; timestamp=$ts } | ConvertTo-Json -Depth 5)

   // Așteaptă 1–2 minute pentru tick-ul Cron, apoi verifică:
   Invoke-RestMethod -Uri "http://localhost:4000/api/leads/$leadId"

   Pentru COLD folosește (exemplu): (Get-Date).AddHours(-49)

## Probleme uzuale
- Porturi ocupate: oprește aplicațiile pe 3000/4000/5678 sau schimbă porturile.
- CSV într-o singură linie: folosește fișierul generat cu “sep=,” sau importă din Data → From Text/CSV (UTF‑8, Comma).
- PowerShell vs “curl”: pe Windows, folosește “curl.exe” sau Invoke-RestMethod/Invoke-WebRequest, nu aliasul PowerShell “curl” care mapează altfel.

