# AgenteP - Project Context & Design Decisions

This document acts as the single source of truth for all important context, design decisions, and definitions provided by the user for **AgenteP**. 
**General Rule:** The LLM (Antigravity) must automatically update this context file whenever significant design decisions or architectural changes are made, ensuring that any new conversation or session starts with a perfect, up-to-date base.

---

## 🎓 1. The UC Academic Workflow
Through announcements ("Anuncios"), teachers and teaching assistants (ayudantes) coordinate the entire course structure. Outlook email integration is deferred; we focus purely on Canvas UC for tasks and notifications. The academic flow consists of:

### Evaluation Elements:
1. **Programa del Curso (Syllabus):** The master outline explaining what is evaluated, how it is calculated, and the rules of the course. **Rule:** This is the most critical source of information. The agents must explicitly download and parse the 'Programa del Curso' for each subject to understand its evaluation rules.
2. **Interrogaciones (I1, I2, etc.) & Exámenes (Exams):** Midterm and final exams. Announcements communicate the date, time, evaluation format (e.g. number of questions), and assigned classrooms (**Salas**).
3. **Practical Assessments (Tareas, Laboratorios, Ensayos, Proyectos):**
   * **Tareas & Laboratorios (Labs):** Practical homework code or write-ups. Announcements notify when they are available, specify their deadlines, and link to descriptions or mention their location (e.g., in a specific Canvas Module or Folder).
   * **Curso Project (Proyecto):** Main team project divided into sprints/deliverables, ending with final presentations.
   * **Ensayos:** Essay tasks or written reports.

### The Announcement ("Anuncios") Hub:
Announcements are the central operational event feed where the critical updates happen:
* Task releases & where files are located (Modules, Files, External Links).
* Extension of deadlines (e.g., *"Formulario Coevaluación Sprint 3 - Nuevo plazo"*).
* Typos or corrections to homework constraints.
* Excel grade files releases and regrade request deadlines (**Recorrecciones**).

---

## 🎨 2. Frontend Design Constraints (Strict)
To avoid generic AI templates ("AI Slop"), the user has defined strict aesthetics:
* **Style:** Ultra-minimalist. 95% black and white, clean `Inter` typography, and generous spacing. No purple/indigo gradients, no generic glassmorphism, and no fake KPI graphs.
* **Perry Accents (≤5%):** Turquoise (`#00a3a6`), Pico Orange (`#ff9e1b`), and Hat Brown (`#4b2430`) used only for:
  * Logo representation (minimalist 2D).
  * Active states.
  * Critical alerts (e.g., upcoming exam rooms or immediate deadlines).
* **Layout Structure:**
  * **Sidebar:** Minimalist menu containing only **"Mis Ramos"** (My Courses) and **"Configuración"** (Settings).
  * **Main Container:** Centered grid of course (Ramo) cards.
  * **Course Cards:** Ultra-minimalist (only shows **Sigla** and **Name** of the course).
  * **Detail Panel:** Clicking a course card expands it to show the agent console for that course (tasks, logs in `JetBrains Mono`, and summaries).

---

## ⚙️ 3. Technical Architecture & Constraints
* **Backend:** FastAPI (Python) running a local database in SQLite (`database.db`).
* **Frontend:** React + Vite (SPA) for ultra-low resource usage, served statically or run as a lightweight process.
* **Agent Engine:** Standalone Python daemon (`worker.py`) that polls tasks and coordinates them.
* **LLM Cost-Bypass (Zero-Cost Bridge):** We completely bypass direct paid API integrations (Gemini/OpenAI keys). The worker loops tasks into `agents/io/pending_task.json` and waits for Antigravity (the AI coding assistant in this chat) to solve it and write to `resolved_task.json`.
* **Version Control:** Under Jujutsu (`jj`) rather than Git. No automatic commits or pushes.

---

## 🧠 4. Multi-Agent System Blueprint
To handle multiple courses dynamically, background workers are organized into four specialized agents cooperating through local file states:

1. **El Guardián (Sentinel - Ingestor Agent):**
   * **Role:** Polls Canvas UC dynamically (`GET /api/v1/courses`) every 1 to 2 hours in the background to discover active subjects.
   * **Tasks:** Loops through courses to fetch Announcements, Assignments, and Files.
   * **Storage:** Saves each new announcement as a separate Markdown file (`agents/workspace/{COURSE_CODE}/announcements/{TITLE}.md`) to maintain clean modular histories.
   * **Tracking:** Maintains `processed_announcements.json` inside each course workspace folder to skip already-read posts.
   * **Queue Logic:** Adds new announcements to `dummy_queue.json` as `"pending"` tasks of type `"evaluate_announcement"`.

2. **El Estudiante (Scholar - Material Digestion & RAG Index):**
   * **Role:** Downloads and processes lecture slides, readings, and PDFs.
   * **Tasks:** Generates concise markdown study summaries under `agents/workspace/{COURSE_CODE}/summaries/`.

3. **El Auxiliar (Solver - Task Solver Agent):**
   * **Role:** Triggered by `"pending"` tasks in `dummy_queue.json`.
   * **Tasks:** Reads the announcement markdown file or assignment prompt, decides if it represents a task, sets up folders, and drafts solutions inside `agents/workspace/{COURSE_CODE}/{TASK_NAME}/`.
   * **Dynamic File Downloads:** The Solver specifies the file name/path it needs from Canvas, and the system downloads it dynamically via a Canvas query helper tool.
   * **RAG Connection:** Integrates with **El Estudiante** to read relevant lecture summaries, ensuring solutions match the specific terminology, libraries, and methods taught in class.
   * **Course Profiles:** Reads constraints from `course_profile.json` (e.g. math rigor, programming languages) to tailor the response persona.
   * **Self-Review:** Validates draft results against rubrics (`rubric.json`) and previous professor feedback.

4. **El Evaluador (Critic - Self-Improvement Agent):**
   * **Role:** Monitors Canvas grade postings and feedback comments.
   * **Tasks:** Parses scores and teacher remarks to update `course_profile.json` (styling rules/regrade context) so the Solver learns from errors.

### 🛠️ Internal Tools
* **`canvas_tools.py`**: A CLI utility in `agents/core/` acting as the "arms and legs" for the agents. It allows them to programmatically:
  * Run `list-assignments` to search for homework.
  * Run `setup-assignment` to download instructions/rubrics and scaffold workspace folders.
  * Run `download-file` and `download-syllabus` to fetch class PDFs and the *Programa del Curso*.

---

## 📅 5. Project Timeline & Testing Sandbox
* **Phase A: Vacation Testing (June 30 - End of July):** We are currently finishing the semester. We will use the existing course contents (e.g. Ingeniería de Software and Seguridad Computacional announcements, labs, grades) to "free test" the agents in a sandbox, fetching completed data as if it were live.
* **Phase B: Next-Semester Ready (End of July):** The goal is to have a working product (not necessarily perfect, but fully functional and stable) ready to operate by the time the next academic semester starts.
