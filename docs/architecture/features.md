# Agente P - Implemented System Architecture & Skills Summary

This document provides a comprehensive, high-level summary of all architectural patterns, AI skills, database integrations, and frontend components currently implemented in **Agente P**.

---

## ⚙️ Core Engine & Architecture
* **Worker Daemon (`agents/core/worker.py`):** The main background execution loop that continuously monitors Supabase Cloud for pending tasks and dispatches them to their respective execution strategies.
* **Strategy & Registry Pattern (`agents/core/strategy.py`):** An extensible design pattern mapping task types directly to Python `TaskStrategy` implementations. It completely eliminates `if/else` logic from the worker, allowing new AI skills to be plugged in dynamically.
* **LLM Zero-Cost Bridge:** A local file-based synchronization system (`pending_task.json` and `resolved_task.json`) that allows the background worker to delegate complex tasks directly to the Antigravity assistant without consuming paid API keys.

---

## ☁️ Cloud Database & Canvas Integration
* **Supabase Cloud Integration (`agents/core/supabase_client.py`):** Connected to a live PostgreSQL database hosted on Supabase Free Tier:
  * **`tasks` Table:** Cloud-backed task queue with real-time state tracking (`pending` ➔ `processing` ➔ `completed` / `failed`).
  * **`logs` Table:** Real-time execution logs for monitoring agent operations.
* **Canvas Tools Utility (`agents/core/canvas_tools.py`):** Command-line tool acting as the system's "arms and legs":
  * Downloads official Canvas PDF Syllabi (*Programa del Curso*), bypassing Amazon S3 redirect timeouts.
  * Downloads specific course files and lists active assignments.
  * Extracts raw text locally using `pypdf`.
* **El Guardián (`fetch_announcements.py`):** Ingestor script polling Canvas API for all active courses, converting HTML announcements into clean Markdown files, and queuing tasks/logs into Supabase Cloud.

---

## 🧠 AI Skills
* **Course Profiler & Scaffold (`.agents/skills/profile_course`):** Automated skill that:
  1. Downloads and reads the course syllabus.
  2. Extracts grading formulas (e.g. `NC = T * 0.05 + PP * 0.60 + E * 0.35`).
  3. Extracts Professor and TA `@uc.cl` emails and names.
  4. Saves rules permanently into `agents/workspace/{COURSE_CODE}/course_profile.json`.
  5. Scaffolds a clutter-free workspace, creating component directories (`tareas/`, `proyecto/`) only if required by the syllabus.
* **Study Summarizer (`.agents/skills/study_summarizer`):** Blueprint instructions teaching the AI how to summarize lecture slides into structured Markdown (Core Concepts, LaTeX Formulas/Code, Key Takeaways).

---

## 💻 Frontend Web Dashboard (`frontend/`)
* **Framework:** React + Vite single-page application built with Vanilla CSS variables and semantic design tokens.
* **Visual Identity:** Aligned with `agente-p-logo.png` palette:
  * Warm Cream Environment (`#FAF7F2`)
  * Elevated White Surface (`#FFFFFF`)
  * Dark Brown High-Contrast Ink (`#45240F`)
  * Turquoise Accent (`#08ACB1`)
  * Orange Beak Accent (`#F99814`)
* **Canvas UC 2-Tier Navigation System:**
  * **Tier 1 (Primary Global Sidebar):** Displays official logo, **"Mis Ramos"**, and **"Configuración"**. Automatically collapses to an **Icon-Only Mode (64px)** when a course is selected.
  * **Tier 2 (Secondary Course Sidebar):** Appears when a course card is clicked, offering course sub-navigation:
    1. **Actividad Agente:** Amie-style date-grouped Timeline Feed (*Today*, *Yesterday*, *Last Week*, *Past*) & Monospace (`JetBrains Mono`) real-time console terminal.
    2. **Programa del Curso:** Rich syllabus hub featuring Course Description, Formula & Variable Breakdown, Exam Eximición Rules, Key Milestone Dates, and Faculty Contacts.
    3. **Anuncios:** Ingested Canvas announcements feed.
    4. **Tareas & Evaluaciones:** Homework, exams, and project deliverables.
    5. **Materiales:** Class slides & AI summaries.
* **100% Fluid Responsiveness:** Adapts seamlessly across Mobile smartphones (collapsible hamburger top-bar header), iPad/Tablets, and Desktop displays.
