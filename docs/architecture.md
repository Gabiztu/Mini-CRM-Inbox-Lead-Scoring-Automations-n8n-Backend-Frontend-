# Mini-CRM Fullstack Architecture Document

## 1. Introduction
This document outlines the technical architecture for the **Mini-CRM**, designed for rapid local execution using standard Node.js tooling (`npm`). It integrates a Next.js frontend, Express backend, and n8n automation engine without requiring Docker.

## 2. High Level Architecture

### 2.1 Technical Summary
The system runs as a **Monorepo** with three concurrent Node.js processes:
1.  **Frontend:** Next.js (Port 3000).
2.  **Backend:** Express API (Port 4000).
3.  **Automation:** n8n instance (Port 5678).
A root `package.json` orchestrates these services. Data persists in a local SQLite file.

### 2.2 Architecture Diagram
```mermaid
graph TD
    User[User (Browser)] -->|HTTP/3000| FE[Frontend (Next.js)]
    FE -->|REST/4000| BE[Backend API (Express)]
    BE -->|Read/Write| DB[(SQLite File)]
    
    Ext[External Source] -->|Webhook| N8N[n8n Process]
    N8N -->|HTTP Request| BE
    
    subgraph Localhost (npm run dev)
        FE
        BE
        N8N
        DB
    end

## 3. Tech Stack

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | Next.js | 14.x | App Framework | Rapid UI development. |
| **UI Library** | ShadCN UI | Latest | Components | Professional look matching screenshot. |
| **Backend** | Node.js (Express) | 20.x | API Server | Simple, fast JSON processing. |
| **Database** | SQLite | 3.x | Persistence | Zero-config, file-based. |
| **ORM** | Prisma | 5.x | Data Access | Type-safe DB access. |
| **Automation** | n8n | Latest | Logic Engine | Running via `npx` for zero-install automation. |
| **Orchestration**| npm + concurrently | Latest | Process Manager | Simple `npm start` experience. |

## 4. Data Models
### 4.1 Lead
*   `id`: String (UUID)
*   `name`: String
*   `email`: String (Unique)
*   `status`: String (Enum: NEW, QUALIFIED, WON, LOST, COLD, NEEDS_FOLLOWUP)
*   `score`: Integer (Default: 0)
*   `source`: String
*   `lastInteraction`: DateTime
*   `createdAt`: DateTime

### 4.2 Tag
*   `id`: String (UUID)
*   `name`: String
*   `color`: String (Hex)
*   `leadId`: String (FK)

### 4.3 Message
*   `id`: String (UUID)
*   `content`: String
*   `direction`: Enum (INBOUND, OUTBOUND)
*   `timestamp`: DateTime
*   `leadId`: String (FK)

## 5. Component Architecture

### 5.1 Project Structure (Monorepo)
```text
mini-crm/
├── package.json        # Root scripts (concurrently)
├── frontend/           # Next.js App
│   ├── app/
│   ├── components/
│   └── lib/api.ts
├── backend/            # Express App
│   ├── src/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── dev.db      # SQLite DB
│   └── package.json
└── n8n_data/           # n8n Data Storage
    └── workflows/      # Exported JSON workflows
```

## 6. Infrastructure & Deployment

### 6.1 Root Package Configuration
The root `package.json` will contain:
```json
"scripts": {
  "install:all": "npm install && cd frontend && npm install && cd backend && npm install",
  "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\" \"npm run dev:n8n\"",
  "dev:frontend": "cd frontend && npm run dev",
  "dev:backend": "cd backend && npm run dev",
  "dev:n8n": "N8N_USER_FOLDER=./n8n_data npx n8n start"
}
```

### 6.2 Environment Variables
*   **Frontend:** `.env.local` -> `NEXT_PUBLIC_API_URL=http://localhost:4000`
*   **Backend:** `.env` -> `DATABASE_URL=file:./dev.db`
*   **n8n:** `N8N_USER_FOLDER=./n8n_data` (set via script).

## 7. Development Workflow
1.  **Setup:** `npm run install:all` (One command to install dependencies for all apps).
2.  **Database:** `cd backend && npx prisma db push && npx prisma db seed`.
3.  **Run:** `npm run dev` (Starts Frontend, Backend, and n8n).
4.  **Access:**
    *   Web UI: `http://localhost:3000`
    *   API: `http://localhost:4000`
    *   n8n: `http://localhost:5678`
```

***

