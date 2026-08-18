---
name: sync_tasks
description: "Discover, categorize, and synchronize assignments for all workspace courses (or a specific course) from Canvas into canonical workspace tasks.json and calendar.json using Agentic Reasoning."
---

# Skill: sync_tasks

Use this skill when you need to fetch, categorize, and synchronize assignments (tareas, controles, actividades, proyectos, etc.) from Canvas UC into `agents/workspace/{COURSE_CODE}/tasks.json` and update `agents/workspace/calendar.json` for all registered courses or a specific course.

> [!IMPORTANT]
> **Execution Prerequisites:**
> 1. Terminal commands interacting with Canvas API require network access (`BypassSandbox: true`).
> 2. Zero AI SDKs in Python scripts: all semantic categorization, taxonomy mapping, and decision-making are performed directly by the humanoid reasoning agent.
> 3. Zero hardcoding: Discover all courses and evaluation categories dynamically from `course_profile.json`.

---

## Step 1: Discover Courses to Sync
1. If a specific course is requested (e.g. `IIC2523`), target only that course.
2. If syncing all courses, discover them dynamically by running:
   ```bash
   backend/venv/bin/python agents/core/tasks_tools.py list-workspace-courses
   ```
   This returns the list of all registered course codes in `agents/workspace/` (e.g. `["EYP1027", "IIC2173", "IIC2213", "IIC2513", "IIC2523"]`).

---

## Step 2: For Each Course, Fetch Live Canvas Assignments
Execute the deterministic CLI tool to list all live assignments from Canvas:
```bash
backend/venv/bin/python agents/core/tasks_tools.py list-raw-assignments --course {COURSE_CODE}
```
This returns the fresh, complete array of assignments published in Canvas, containing `id`, `name`, `due_at`, `unlock_at`, `lock_at`, `points_possible`, `has_submitted_submissions`, `submission_types`, and `html_url`.

---

## Step 3: Humanoid Agentic Taxonomy Mapping
1. Read `agents/workspace/{COURSE_CODE}/course_profile.json`.
2. Inspect the `evaluations` array (which contains `key`, `name`, `folder`, `weight`, `details`).
3. Apply humanoid agentic reasoning to map each raw assignment to its corresponding evaluation category:
   - Match by semantic intent and naming conventions (e.g. `Control 01..10` → `controles`, `AC01..02` → `actividades_formativas`, `A0..A6` → `actividades`, `T1..T4` → `tareas`, `Inscripción` → `general` o su grupo asignado).
   - If an assignment does not fit any existing category in `course_profile.json`, assign a clean snake_case category based on its title or assignment group.

---

## Step 4: Determine Universal Status & Dates
For each assignment:
1. **Status**:
   - If `has_submitted_submissions` is true: `"submitted"`
   - Else if `due_at` or `lock_at` has already passed in the past: `"closed"`
   - Else: `"pending"`
2. **Dates**: Normalize ISO strings for `unlock_at`, `due_at`, and `lock_at`.
3. **Points**: Store `possible` (float or null), `score` (if graded), and match `weight_percentage` from `course_profile.json` if available.
4. **Source**: `{ "type": "canvas", "external_id": str(assignment.id), "url": assignment.html_url }`.
5. **Details**: `{ "description_md": ..., "submission_types": assignment.submission_types, "has_workspace_folder": bool }`.

---

## Step 5: Idempotent Merge & Save into `tasks.json`
Execute the deterministic merge tool passing the normalized JSON array:
```bash
backend/venv/bin/python agents/core/tasks_tools.py merge-course-tasks \
  --course {COURSE_CODE} \
  --data '<NORMALIZED_JSON_ARRAY>'
```
This guarantees:
- **No duplicates**: Existing tasks match by ID / external_id and only update if dates/status/points changed.
- **New tasks added**: Newly published tasks in Canvas are automatically appended.
- **Reports summary**: Returns `{ "added": X, "updated": Y, "unchanged": Z }`.

---

## Step 6: Upsert Dates into `calendar.json`
For every assignment containing a valid `due_at` date:
```bash
backend/venv/bin/python agents/core/calendar_tools.py upsert-event \
  --course {COURSE_CODE} \
  --title "{ASSIGNMENT_TITLE}" \
  --type {CATEGORY} \
  --date "{DUE_AT_ISO}" \
  --source "canvas_assignment"
```

---

## Step 7: Report Results
Display a structured summary of the synchronization showing:
- Courses processed.
- New tasks discovered and added.
- Existing tasks updated or confirmed unchanged.
