# AgenteP: Architecture & Structure Options

This document provides a comparative analysis of the technical stack options for **AgenteP**. Since the app will run continuously on a personal server or local environment, resource efficiency, ease of deployment, and agent tool compatibility are our primary focus areas.

---

## 🎨 1. Frontend: Dashboard & User Interface
Y
### Option A: React + Vite (Single Page Application) — 🌟 Recommended
A lightweight SPA that compiles down to static HTML, CSS, and JS.
*   **Pros:**
    *   **Extremely lightweight:** Minimal RAM and CPU consumption.
    *   **Easy Deployment:** The built frontend can be served directly by the Python/FastAPI backend, meaning we only run *one* single process on the server.
    *   **Fast Development:** Instant Hot Module Replacement (HMR).
*   **Cons:**
    *   No Server-Side Rendering (SSR) or built-in backend API routing (not needed for this project's scope).

### Option B: Next.js (React Framework)
A full-stack framework with built-in page routing and server component rendering.
*   **Pros:**
    *   Rich routing, authentication templates, and server action patterns.
    *   Highly scalable if the app expands into a multi-user platform.
*   **Cons:**
    *   **High resource footprint:** Requires running a continuous Node.js server process in addition to the Python backend.
    *   **Deployment complexity:** Harder to manage on low-cost personal servers.

---

## 🧠 2. Backend & Agent Engine

### Option A: Python (FastAPI + LangGraph/Custom Agent Loop) — 🌟 Recommended
FastAPI is an asynchronous web framework, and Python is the standard language for AI/Agent development.
*   **Pros:**
    *   **Ecosystem dominance:** Direct access to all modern LLM/Agent frameworks (LangGraph, LiteLLM, crewAI) and AI tools.
    *   **Academic Document Processing:** Python has superior libraries for parsing slides, lecture PDFs, and syllabus documents (e.g., `PyPDF`, `unstructured`, `Marker`).
    *   **Safe Code Sandboxing:** Very easy to create subprocesses or isolated Python runs to test agent-generated code before outputting it.
*   **Cons:**
    *   Virtual environments and dependency management (pip/poetry) require separate configuration from the frontend.

### Option B: Node.js (Express or NestJS + LangChain.js)
A JavaScript backend runtime.
*   **Pros:**
    *   **Unified language:** Use JavaScript/TypeScript for both frontend and backend.
    *   Fast JSON handling.
*   **Cons:**
    *   The LLM and AI agent ecosystem in JS is less mature and updated less frequently than Python's.
    *   Running sandboxed code written by the agent is harder and less secure in Node.js.

---

## 💾 3. Database & Memory Storage

### Option A: SQLite + Vector Store File (e.g., Chroma/FAISS) — 🌟 Recommended
SQLite stores all relational data in a single file, and vector databases can run in-memory or as local directories.
*   **Pros:**
    *   **Zero Configuration:** No database servers or Docker containers to install or maintain.
    *   **Perfect for personal scale:** SQLite is incredibly fast for single-user apps.
    *   **Easy Backups:** You can back up the entire app state by copying a single `.db` file.
*   **Cons:**
    *   Not suitable for high concurrent write operations (not an issue for a personal academic portal).

### Option B: PostgreSQL (with pgvector extension)
A powerful relational database with extension support for vectors.
*   **Pros:**
    *   Extremely robust and handles complex relational queries effortlessly.
    *   Unified database for both structured data and semantic vectors (via `pgvector`).
*   **Cons:**
    *   Requires running a continuous background daemon (Postgres database server) or managing it in a Docker container, raising server resource usage.

---

## 📂 4. Recommended Project Directory Structure

Assuming we go with the **Recommended Stack** (React/Vite + FastAPI + SQLite), here is the folder hierarchy:

```
agenteP/
├── frontend/                # React + Vite (UI, components, Kanban board)
│   ├── src/
│   │   ├── components/      # UI Elements (CourseCard, TaskList, AgentConsole)
│   │   ├── pages/           # Pages (Dashboard, CourseView, Settings)
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # FastAPI server (API endpoints & data polling)
│   ├── app/
│   │   ├── api/             # Routes (courses, tasks, settings, agent_logs)
│   │   ├── core/            # Config, security, database sessions
│   │   ├── models/          # SQLAlchemy Database schemas
│   │   ├── integrations/    # Canvas UC API & Outlook handlers
│   │   └── main.py
│   ├── requirements.txt
│   └── database.db          # Local SQLite Database (Git ignored)
│
├── agents/                  # Autonomous agent scripts and logic
│   ├── supervisor.py        # Orchestrator agent (allocates tasks)
│   ├── task_solver.py       # Agent that writes drafts for homework
│   ├── summarizer.py        # Agent that processes uploaded materials
│   └── tools/               # Handlers (code runner, web searcher, document parser)
│
└── PROJECT_CONTEXT.md       # Project vision and roadmap
```
