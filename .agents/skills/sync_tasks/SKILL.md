---
name: sync_tasks
description: "Discover, categorize, and synchronize assignments for a course from Canvas into canonical workspace tasks.json and calendar.json using Agentic Reasoning."
---

# Skill: sync_tasks

Use this skill when you need to fetch, categorize, and synchronize assignments (tareas, controles, actividades, proyectos) for a course into `agents/workspace/{COURSE_CODE}/tasks.json` and update `agents/workspace/calendar.json`.

> [!IMPORTANT]
> **Execution Prerequisites:**
> 1. Terminal commands interacting with Canvas API require network access (`BypassSandbox: true`).
> 2. No AI SDKs in Python scripts: all categorization and taxonomy mapping is performed by the reasoning agent.

---

## Step 1: Fetch Raw Assignments from Canvas
Execute the deterministic CLI tool to list all assignments for the target course:
```bash
backend/venv/bin/python agents/core/tasks_tools.py list-raw-assignments --course {COURSE_CODE}
```
This returns the raw JSON list of assignments from Canvas, including `id`, `name`, `due_at`, `unlock_at`, `lock_at`, `points_possible`, `has_submitted_submissions`, `submission_types`, and `html_url`.

---

## Step 2: Read Course Profile & Apply Agentic Taxonomy Mapping
1. Read `agents/workspace/{COURSE_CODE}/course_profile.json`.
2. Inspect the `evaluations` array (which contains `key`, `name`, `folder`, `weight`, `details`).
3. Apply humanoid agentic reasoning to map each raw assignment to its corresponding evaluation category folder:
   - Match by semantic intent, prefixes (e.g. `AC01` → `actividades_formativas`, `Control 01` → `controles`, `T1` → `tareas`, `E1` → `proyecto`).
   - If an assignment does not match any specific category in `course_profile.json`, assign a clean snake_case category based on its title or assignment group.

---

## Step 3: Determine Universal Status & Dates
For each assignment:
1. **Status**:
   - If `has_submitted_submissions` is true: `"submitted"`
   - Else if `due_at` or `lock_at` has already passed: `"closed"`
   - Else: `"pending"`
2. **Dates**: Normalize ISO strings for `unlock_at`, `due_at`, and `lock_at`.
3. **Points**: Store `possible` (float or null), `score` (if graded), and match `weight_percentage` if specified in `course_profile.json`.

---

## Step 4: Write Canonical `tasks.json`
Save the structured array to `agents/workspace/{COURSE_CODE}/tasks.json`:
```json
[
  {
    "id": "{course_code_lower}-{sanitized_slug}",
    "course_code": "{COURSE_CODE}",
    "title": "Control 03",
    "category": "controles",
    "status": "pending",
    "dates": {
      "unlock_at": "2026-08-17T16:30:00Z",
      "due_at": "2026-08-29T00:00:00Z",
      "lock_at": "2026-08-29T00:00:00Z"
    },
    "points": {
      "possible": 2.0,
      "score": null,
      "weight_percentage": null
    },
    "source": {
      "type": "canvas",
      "external_id": "626827",
      "url": "https://cursos.canvas.uc.cl/courses/105802/assignments/626827"
    },
    "details": {
      "submission_types": ["online_quiz"],
      "has_workspace_folder": false
    },
    "updated_at": "{CURRENT_ISO_TIMESTAMP}"
  }
]
```

---

## Step 5: Upsert Dates into `calendar.json`
For every assignment that contains a valid `due_at` date:
```bash
backend/venv/bin/python agents/core/calendar_tools.py upsert-event \
  --course {COURSE_CODE} \
  --title "{ASSIGNMENT_TITLE}" \
  --type {CATEGORY_OR_TYPE} \
  --date "{DUE_AT_ISO}" \
  --source "canvas_assignment"
```
