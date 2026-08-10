## Why

Currently, `canvas_tools.py` uses hardcoded search terms (e.g. searching specifically for `"programa"`) and rigid script logic to locate course syllabi and materials. This fails when professors use non-standard file names (e.g. `Silabo_2026.pdf`, `Reglas_del_Curso.pdf`) or place items inside Canvas Modules instead of standard file directories.

By refactoring `canvas_tools.py` into low-level deterministic Canvas API primitives (returning clean JSON) and delegating semantic decision-making to skills like `profile_course`, the AI agent can dynamically inspect files, folders, and modules to find course materials regardless of how the professor organized them.

## What Changes

- **Refactor `canvas_tools.py`**: Strip out hardcoded search/regex assumptions and expose raw, modular Canvas API primitives (`get-course-info`, `list-files`, `list-folders`, `list-modules`, `download-file-by-id`).
- **Refactor `profile_course` Skill**: Update `.agents/skills/profile_course/SKILL.md` to instruct the AI agent to inspect Canvas files and modules via JSON primitives, use semantic reasoning to locate the syllabus, download the candidate file by ID, and generate the `course_profile.json` and directory structure.
- **Enable Interactive Testing**: Prepare the skills and primitive tools so the user can test course profiling on real Canvas courses and iteratively refine skill instructions based on real-world results.

## Capabilities

### New Capabilities
- `agentic-canvas-tools`: Low-level Canvas API CLI primitives and agentic skill workflows that allow the AI agent to dynamically discover, inspect, and ingest Canvas course syllabi and materials.

### Modified Capabilities
*(None)*

## Impact

- **Affected Code**: `agents/core/canvas_tools.py`, `.agents/skills/profile_course/SKILL.md`.
- **Dependencies**: `httpx`, Canvas REST API token (`CANVAS_API_TOKEN`).
- **User Workflow**: Users can run `profile_course` on any Canvas course code and the agent will intelligently locate syllabi even if non-standard names are used.
