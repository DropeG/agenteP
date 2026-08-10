# AgenteP - Project Context & Design Decisions

This document acts as the single source of truth for all important context, design decisions, and definitions provided by the user for **AgenteP**. 
**General Rule:** The LLM (Antigravity) must automatically update this context file whenever significant design decisions or architectural changes are made, ensuring that any new conversation or session starts with a perfect, up-to-date base.
**Incremental & Slower Execution Rule (CRITICAL):** Never run bulk batch ingestion (e.g. 30 announcements or all courses at once). Always operate step-by-step, starting with 1 single course / 1 single item. Test, verify, and confirm with the user before scaling up.
**Pedagogical Rule:** Since the user is learning software design patterns, whenever the agent implements or modifies core structural components related to design patterns, the agent must briefly explain how the pattern is operating in that specific context to help the user learn.
**Universal Course-Agnostic AI Agent Principle (CORE OF THE PRODUCT):** All agents (starting with *El Guardián*) MUST be 100% course-agnostic and use Canvas API auto-discovery (`GET /api/v1/courses`). Never hardcode course siglas or course-specific scripts. 
**No External Paid AI API Rule:** Python backend scripts (such as *El Guardián* or *Worker*) must NEVER import `google-genai`, `openai`, or invoke paid external AI APIs. All agentic intelligence, reasoning, decision-making, and classification are performed directly by the Agent (Antigravity). Python scripts act purely as deterministic data tools for Canvas HTTP polling, local file storage, and Supabase REST sync.

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

## 🎨 2. Frontend Design Constraints (Strict)
To avoid generic AI templates ("AI Slop"), the user has defined strict aesthetics:
* **Style:** Ultra-minimalist warm-neutral (85–95%) environment (`#FAF7F2` warm cream background, `#FFFFFF` elevated white cards, `#45240F` dark brown high-contrast ink) with clean `Inter` typography and generous spacing.
* **Official Logo Palette Accents:**
  * Turquoise (`#08ACB1`): Primary actions, active navigation, focus rings, running agent indicators.
  * Hat Brown (`#8B3F0A`): Secondary brand accents and structural details.
  * Dark Brown (`#45240F`): High-contrast text, dark controls, selected navigation.
  * Orange (`#F99814`): High-priority warnings, upcoming exam rooms, and deadline alerts.
* **Layout & Navigation Architecture (Canvas UC 2-Tier Pattern):**
  * **Primary Global Sidebar (Tier 1):** Displays official logo (`agente-p-logo.png`), **"Mis Ramos"** (Dashboard) and **"Configuración"** (Settings). When a course is opened, Tier 1 automatically collapses into an **Icon-Only Mode (64px)** to maximize working space on desktop.
  * **Secondary Course Sidebar (Tier 2):** Appears adjacent to Tier 1 when a course card is clicked, offering course sub-navigation:
    1. **Actividad Agente:** Amie-style date-grouped Timeline Feed (*Today*, *Yesterday*, *Last Week*, *Past*) & `JetBrains Mono` real-time console terminal.
    2. **Programa del Curso:** Rich syllabus hub with Course Description, Formula & Variable Breakdown, Exam Eximición Rules, Key Milestone Dates, and Faculty Contacts.
    3. **Anuncios:** Canvas Markdown announcements feed.
    4. **Tareas & Evaluaciones:** Homework, exams, and project deliverables.
    5. **Materiales:** Class slides & AI summaries.
  * **100% Mobile & iPad Responsiveness:** The UI adapts seamlessly across Mobile smartphones (collapsible hamburger top-bar header), iPad/Tablets, and Desktop displays.

---

## ⚙️ 3. Technical Architecture & Constraints
* **Backend:** Standalone Python background workers (`worker.py`, `fetch_announcements.py`) connected to **Supabase Cloud PostgreSQL** (`tasks` & `logs` tables).
* **Database (Supabase Free Tier):** Real-time task queue (`tasks` table) and execution logs (`logs` table) synced in real time across backend and frontend.
* **Frontend:** React + Vite (SPA) built with Vanilla CSS variables and semantic design tokens, running locally at `http://localhost:5173/`.
* **Agent Engine:** Python daemon (`worker.py`) that polls pending tasks from Supabase and dispatches strategies dynamically.
* **Software Design Patterns:**
  * **Strategy Pattern:** Used to encapsulate individual task handlers (`EvaluateAnnouncementStrategy`, `ZeroCostLLMStrategy`), allowing the core loop to dynamically select and run the correct execution logic.
  * **Registry Pattern (Dynamic Factory):** Instead of `if/else` statements, `TaskStrategyFactory` uses a dictionary registry to map task types to their corresponding Strategy classes, completely eliminating conditional branching in the task dispatcher.
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
   * **Role:** Scans Canvas folders named 'Clases', 'Lecturas', or 'Diapositivas' incrementally, downloads new PDFs/slides to `clases/raw/`, and extracts text using `pypdf` into `clases/parsed_text/`.
   * **Tasks:** Triggered by `"summarize_material"` tasks in the queue, it generates structured Markdown summaries under `clases/summaries/` containing Core Concepts, Key Definitions, Code/Formulas, and Key Takeaways.

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
