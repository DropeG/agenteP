---
name: profile_course
description: "Initialize and profile a Canvas course by locating and parsing its syllabus (Programa del Curso) using Agentic Reasoning over Canvas API primitives, creating a course_profile.json, and scaffolding the required directories."
---

# Skill: profile_course

Use this skill when you need to onboard a course at the start of a semester or when explicitly requested to profile a course (e.g., "Inicializa el curso IIC2143" or "Crea el perfil de Seguridad").

> [!IMPORTANT]
> **Execution Prerequisites:**
> 1. Terminal commands interacting with Canvas API (`canvas_tools.py`) require **outbound network access** (`BypassSandbox: true`).
> 2. Arguments accept both course sigla (e.g. `--course IIC2213`) or numeric Canvas ID (e.g. `--course 112634`).

## Detailed Steps

### Step 1: Humanoid Agentic Exploration Across 4 Live Canvas Sources
To locate the official Syllabus document, simulate human exploration across all 4 live Canvas sources:

1. **Página de Inicio (`front_page`)**: Check course `default_view` and fetch `/front_page`. If it contains a Wiki page with syllabus content or external links (e.g. GitHub), extract it as a candidate.
2. **Módulos e Ítems (`modules`)**: Query course modules and scan all items (File, Page, ExternalUrl) across **ALL modules**. Use agentic reasoning to identify potential syllabus candidates without any string filtering.
3. **Archivos de la Asignatura (`files`)**: List uploaded course files and use **agentic reasoning and intelligence** to select candidate files representing the course syllabus, without restricting to fixed keyword lists.
4. **Anuncios y Enlaces Externos (`announcements`)**: Scan course announcements for welcome messages containing external syllabus links (e.g. GitHub) or direct PDF links. **If an external GitHub repository link is found (e.g. `https://github.com/{org}/Syllabus`), navigate into the repository to fetch the official syllabus file (e.g. `IIC2523-Programa.pdf` or `README.md`).**

---

### Step 2: Semantic Context Verification & Official File Prioritization
Before accepting any candidate file or text as the official Syllabus, perform **Semantic Context Verification** on its content:

1. **Standalone Official File Prioritization:** Always prioritize standalone official Syllabus documents (e.g., `programa.pdf`, `IIC2523-Programa.pdf`) over general introductory lecture slides (e.g., `Clase 00`).
2. **Verification Criteria:** A candidate document MUST contain at least two of the following structural syllabus markers:
   - Evaluation section or Grading formula (`Ncalc =`, `NF =`, `Ponderaciones`, `Interrogaciones`, `Tareas`, `Controles`, `Proyecto`).
   - Learning objectives / Course description (`Objetivos`, `Resultados de aprendizaje`).
   - Teaching team contacts (`Profesores`, `Ayudantes`, email addresses).
   - Academic Integrity Policy or Honor Code.

3. **Download & Save Official Syllabus:**
   - Once verified, save the official syllabus as `agents/workspace/{COURSE_CODE}/programa_del_curso.md` (if HTML/Markdown) or `agents/workspace/{COURSE_CODE}/programa_del_curso.pdf` (if PDF).
   - If the candidate fails verification, discard it and continue scanning the next source.

---

### Step 3: Read & Parse the Syllabus (Primary Source of Truth)
Read `programa_del_curso.md` (or extract text from `programa_del_curso.pdf` if it is a PDF) and apply pure humanoid agentic reasoning:

> [!IMPORTANT]
> **Syllabus-First & Zero-Hardcode Rule:** The Syllabus is the absolute primary source of truth. 
> Read the evaluation section as a human student would. Do **NOT** rely on default Canvas LMS assignment group names if the Syllabus document specifies the course's actual evaluation components.

1. **Humanoid Evaluation Discovery:** Analyze the evaluation and grading policy section directly from the Syllabus text. Identify whatever evaluation components the professor has defined for the course (regardless of naming terminology, grading formula variable names, or structure).
2. **Dynamic Taxonomy & Folder Mapping:** For each evaluation component discovered, define a `key` (snake_case identifier), `name` (formal title), `folder` (sanitized snake_case directory name), `weight` (percentage if specified), and `details` (grading breakdown summary).
3. **Canvas Assignment Groups Cross-Check (Fallback Only):** Query Canvas assignment groups only to resolve missing details or as a fallback if the Syllabus document lacks explicit evaluation information.
4. **Teaching Team Extraction:** Extract Professor and TA names and contact email addresses directly from the Syllabus text.

---

### Step 4: Write the Course Profile
1. **Fetch Official Course Name:** Fetch the official `course_name` directly from the Canvas API (`GET /api/v1/courses/{COURSE_CODE}` property `name` or `canvas_tools.py get-course-info`), ensuring exact alignment with UC official course titles.
2. **Write JSON:** Create `agents/workspace/{COURSE_CODE}/course_profile.json` with this dynamic structure:
```json
{
  "course_code": "{COURSE_CODE}",
  "course_name": "{OFFICIAL_CANVAS_COURSE_NAME}",
  "contacts": {
    "professors": [
      { "name": "Professor Name", "email": "email@uc.cl" }
    ],
    "ayudantes": [
      { "name": "TA Name", "email": "email@uc.cl" }
    ]
  },
  "evaluations": [
    {
      "key": "actividades_formativas",
      "name": "Actividades Formativas",
      "folder": "actividades_formativas",
      "weight": 20,
      "details": "Detalles de la evaluación o ponderación"
    },
    {
      "key": "controles",
      "name": "Controles",
      "folder": "controles",
      "weight": 20,
      "details": "Controles semanales de lectura/clases"
    }
  ]
}
```

---

### Step 4.5: Master Calendar Registration (Baseline Phase)
For every evaluation date identified in the syllabus (Interrogaciones, Examen, Controles, Entregas, Hitos), execute `calendar_tools.py upsert-event` to establish the initial baseline in `agents/workspace/calendar.json` with `source: "syllabus"`:

```bash
backend/venv/bin/python agents/core/calendar_tools.py upsert-event \
  --course {COURSE_CODE} \
  --title "{EVALUATION_TITLE}" \
  --type {EVALUATION_TYPE} \
  --date "{ISO_DATE_STRING}" \
  --source "syllabus"
```

> [!NOTE]
> **Dynamic Lifecycle Rule:** This initial registration creates an unívoco event ID (`{course_code}-{slug_title}`). Subsequent agent workflows (`setup_assignment` and *El Guardián*) will update this event idempotently when dates are confirmed by Canvas API (`source: "canvas_assignment"`) or modified via live announcements (`source: "announcement"`), recording the postponement or change reason in `details`.

---

### Step 5: Dynamic Scaffolding of Directories
Create **only** the active directories under `agents/workspace/{COURSE_CODE}/` by iterating over each evaluation category in `course_profile.json`:
- For each item in `evaluations`: create the directory `agents/workspace/{COURSE_CODE}/{item.folder}/`.

Example: If `evaluations` contains entries with `folder` values `"actividades_formativas"` and `"controles"`, create `actividades_formativas/` and `controles/`.

Do **not** hardcode folder names or create folders for non-existent evaluation types, keeping the workspace 100% clean, universal, and clutter-free.

---

### Step 6: Clean Up Temporary Downloaded Files
After successfully writing `course_profile.json` and scaffolding active evaluation directories, **delete any temporary syllabus files** (`programa_del_curso.pdf`, `programa_del_curso.txt`, `programa_del_curso.md`) under `agents/workspace/{COURSE_CODE}/`. 

The course directory must remain ultra-minimalist, containing **only**:
* `course_profile.json`
* Active component directories (e.g. `evaluaciones/`, `tareas/`, etc.)
