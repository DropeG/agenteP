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

### Step 1: Inspect Native Canvas Syllabus
First, fetch the basic course info to check if a native Canvas HTML syllabus is available:
```bash
backend/venv/bin/python agents/core/canvas_tools.py get-course-info --course {COURSE_CODE}
```
* **If `syllabus_body` contains substantive text/HTML:**
  Convert the HTML into Markdown format, add frontmatter (`title`, `course`), and save it to `agents/workspace/{COURSE_CODE}/programa_del_curso.md`. Proceed to **Step 3**.
* **If `syllabus_body` is null or empty:** Proceed to **Step 2 (Agentic Discovery)**.

---

### Step 2: Agentic Syllabus Discovery & Download
When native Canvas syllabus body is missing, locate the syllabus file using **semantic agent reasoning** over Canvas API primitives.

1. **List Course Files & Modules:**
   ```bash
   backend/venv/bin/python agents/core/canvas_tools.py list-files --course {COURSE_CODE}
   backend/venv/bin/python agents/core/canvas_tools.py list-modules --course {COURSE_CODE}
   ```

2. **Agent Reasoning & Selection:**
   Inspect the JSON output returned from `list-files` and `list-modules`.
   * **Look semantically** for any file representing the syllabus regardless of exact naming or language:
     * Filenames matching: *Programa*, *Syllabus*, *Silabo*, *Reglas*, *Presentación*, *Overview*, *Introducción*, *Info_Curso*, or syllabus documents uploaded inside introductory modules (e.g. *"Semana 0"*, *"General"*, *"Información del Curso"*).
   * **Identify the File ID:** Select the candidate item's `id`.

3. **Download Candidate File:**
   Run the primitive download command with the identified File ID:
   ```bash
   backend/venv/bin/python agents/core/canvas_tools.py download-file-by-id --file-id {FILE_ID} --dest agents/workspace/{COURSE_CODE}/programa_del_curso.pdf
   ```

---

### Step 3: Read & Parse the Syllabus
Read `programa_del_curso.md` (or extract text from `programa_del_curso.pdf` if it is a PDF) to extract key course information:
1. **Grading Weights:** Percentage breakdown for all evaluations (e.g., Tareas: 30%, Interrogaciones: 40%, Proyecto: 30%).
2. **Evaluation Components:** What types of evaluations exist in this course (Tareas, Laboratorios, Proyecto, Interrogaciones, Controles, etc.).
3. **Contacts:** Professor and TA names and email addresses.

---

### Step 4: Write the Course Profile
Create `agents/workspace/{COURSE_CODE}/course_profile.json` with this structure:
```json
{
  "course_code": "{COURSE_CODE}",
  "course_name": "{COURSE_NAME}",
  "contacts": {
    "professors": [
      { "name": "Professor Name", "email": "email@uc.cl" }
    ],
    "ayudantes": [
      { "name": "TA Name", "email": "email@uc.cl" }
    ]
  },
  "evaluations": {
    "evaluation_type_1": {
      "weight": 20,
      "details": "Details about how it is graded"
    }
  },
  "structure": {
    "has_tareas": true_or_false,
    "has_laboratorios": true_or_false,
    "has_proyecto": true_or_false,
    "has_interrogaciones": true_or_false
  }
}
```

---

### Step 4.5: Register Dates to Master Calendar
For every evaluation date identified in the syllabus (Interrogaciones, Examen, Controles, Entregas), execute `calendar_tools.py upsert-event` to register it into `agents/workspace/calendar.json`:
```bash
backend/venv/bin/python agents/core/calendar_tools.py upsert-event \
  --course {COURSE_CODE} \
  --title "{EVALUATION_TITLE}" \
  --type {EVALUATION_TYPE} \
  --date "{ISO_DATE_STRING}" \
  --source "syllabus"
```

---

### Step 5: Scaffold Customized Directories
Create **only** the active directories under `agents/workspace/{COURSE_CODE}/`:
* If `has_tareas` is `true` -> Create `tareas/`
* If `has_laboratorios` is `true` -> Create `laboratorios/`
* If `has_proyecto` is `true` -> Create `proyecto/`
* If `has_interrogaciones` is `true` -> Create `evaluaciones/`

Do **not** create folders for components that do not exist in the course, keeping the workspace clean and clutter-free.

---

### Step 6: Clean Up Temporary Downloaded Files
After successfully writing `course_profile.json` and scaffolding active evaluation directories, **delete any temporary syllabus files** (`programa_del_curso.pdf`, `programa_del_curso.txt`, `programa_del_curso.md`) under `agents/workspace/{COURSE_CODE}/`. 

The course directory must remain ultra-minimalist, containing **only**:
* `course_profile.json`
* Active component directories (e.g. `evaluaciones/`, `tareas/`, etc.)
