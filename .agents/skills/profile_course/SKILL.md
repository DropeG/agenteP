---
name: profile_course
description: "Initialize and profile a Canvas course by downloading and parsing its syllabus (Programa del Curso), creating a course_profile.json, and scaffolding the required directories."
---

# Skill: profile_course

Use this skill when you need to onboard a course at the start of a semester or when explicitly requested to profile a course (e.g., "Inicializa el curso IIC2143" or "Crea el perfil de Seguridad").

## Detailed Steps

### Step 1: Download the Syllabus (Programa del Curso)
Run the following terminal command to download the course syllabus from Canvas:
```bash
backend/venv/bin/python agents/core/canvas_tools.py download-syllabus --course {COURSE_CODE}
```
This command will:
1. Save the HTML syllabus body to `agents/workspace/{COURSE_CODE}/programa_del_curso.md`.
2. Fallback to searching and downloading any PDF syllabus files to `agents/workspace/{COURSE_CODE}/`.

### Step 2: Read the Syllabus Context
Read the generated `programa_del_curso.md` or parse the downloaded PDF syllabus file to identify:
1. **Grading Weights:** The percentages assigned to each evaluation element (e.g., Tareas: 30%, Interrogaciones: 40%, Proyecto: 30%).
2. **Evaluation Components:** What types of evaluations exist in this course (Tareas, Laboratorios, Proyecto, Interrogaciones, Controles, etc.).

### Step 3: Write the Course Profile
Create a JSON file at `agents/workspace/{COURSE_CODE}/course_profile.json` following this structure:
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

### Step 4: Scaffold Customized Directories
Create **only** the directories that correspond to the active evaluations identified in `structure` under `agents/workspace/{COURSE_CODE}/`:
* If `has_tareas` is `true` -> Create `tareas/`
* If `has_laboratorios` is `true` -> Create `laboratorios/`
* If `has_proyecto` is `true` -> Create `proyecto/`
* If `has_interrogaciones` is `true` -> Create `evaluaciones/`

Do **not** create folders for components that do not exist in the course, maintaining a clean and clutter-free workspace.
