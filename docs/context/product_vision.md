# Product

## Register

product

## Users
UC (Pontificia Universidad Católica de Chile) engineering and computer science students managing multi-subject course workloads, Canvas announcements, evaluations, and AI agent tasks.

## Product Purpose
Provide an ultra-minimalist, zero-clutter dashboard ("Mis Ramos") that centralizes active UC courses into clean cards, allowing students to inspect real-time background agent tasks, logs, and summaries on demand without visual distractions.

## Brand Personality
* **Minimalist & Warm Neutral (85-95%):** Clean warm-cream environment (`#FAF7F2`) and pure white cards with dark brown ink (`#45240F`), using `Inter` typography and generous spacing.
* **Focused & Academic:** Direct, precise information hierarchy with no decorative filler.
* **Perry Logo Palette Accents:**
  * Turquoise (`#08ACB1`): Primary actions, active navigation, links, focus rings, running agent indicators.
  * Hat Brown (`#8B3F0A`): Secondary brand accents and structural details.
  * Dark Brown (`#45240F`): High-contrast text, dark controls, selected navigation.
  * Orange (`#F99814`): Warnings, upcoming exam rooms, and deadline alerts (strictly limited usage).

## Anti-references
* **AI Slop:** No purple/indigo gradients, no default decorative glassmorphism, no fake KPI progress charts.
* **Cluttered Cards:** No side-stripe borders, no arbitrary numbers, no unnecessary statistics on primary course cards.
* **Unnecessary Tabs:** No unrequested global tabs like "Task Board" or "Class Summaries".

## Design Principles
1. **Content-First Hierarchy:** Focus visual weight on actual course siglas and task contents.
2. **Sparse Accent Precision:** Accent colors are functional indicators, never decorative background fills.
3. **Progressive Disclosure:** Keep the main screen focused on course cards; expand into detailed agent consoles (using `JetBrains Mono`) on user click.
4. **Chronological Activity Feed (amie.so inspiration):** Group agent actions and finished tasks into a clean timeline feed (*Today*, *Yesterday*, *Last Week*, *Past*) inside each course detail panel.
5. **Canvas UC 2-Tier Navigation Pattern:** Primary Global Sidebar for global navigation ("Mis Ramos", "Configuración") + Secondary Course Sidebar when a course is selected (*Actividad Agente*, *Programa del Curso*, *Anuncios*, *Tareas & Evaluaciones*, *Materiales*).

## Accessibility & Inclusion
## Multi-Agent Operational Blueprint
1. **Fully Autonomous Pipeline:** Agents operate autonomously step-by-step without requiring manual approval clicks once deployed.
2. **Incremental Development & Testing:** Always test locally first (1 single agent / 1 single item at a time). Verify 100% reliability locally before deploying 24/7 to a cloud server.
3. **Structured Task Workspace:** Homework and deliverables are organized cleanly into `agents/workspace/{COURSE_CODE}/tareas/{TASK_NAME}/` containing:
   * `enunciado.md` (Original requirements & prompt)
   * `solucion.py` / `solucion.md` (Generated code & solution)
   * `rubrica.json` (Grading constraints & rules)
4. **Decoupled Architecture:** Supabase Cloud DB serves as the single source of truth; the React + Vite frontend is a clean visual view.
