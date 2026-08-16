## Context

In accordance with `AGENTS.md` and the Agente P architecture, all reasoning (such as category mapping, taxonomy deduction, and task state assessment) must be executed by the reasoning agent (Antigravity) using structured skills, while Python backend scripts remain strictly deterministic I/O tools with no paid AI SDKs.

## Goals / Non-Goals

**Goals:**
- Create `.agents/skills/sync_tasks/SKILL.md` defining the agentic workflow to sync and categorize tasks for any course.
- Provide deterministic Python CLI tools (`agents/core/tasks_tools.py`) for Canvas assignment I/O without any AI SDK dependencies.
- Maintain idempotence in `agents/workspace/<COURSE_CODE>/tasks.json` and `agents/workspace/calendar.json`.
- Provide `frontend/src/utils/taskLoader.js` to dynamically load tasks for any course.
- Connect `CourseTasksView.jsx` and `CourseSubSidebar.jsx` to render real, dynamic assignments and pending counts using the AgenteP neutral design system.

**Non-Goals:**
- Hardcoding course codes or categories into Python scripts.
- Embedding AI SDK calls inside backend scripts.

## Decisions

1. **Reasoning in Skill, Deterministic I/O in Python**:
   - The agent reads `course_profile.json` (categories and weights), invokes `tasks_tools.py list-raw-assignments`, reasons about the semantic mapping between assignment names and evaluation categories, and writes canonical `tasks.json`.
2. **Canonical Decoupled Schema**:
   - Standardized format with fields: `id`, `course_code`, `title`, `category`, `status`, `dates`, `points`, `source`, `details`.
3. **Frontend Dynamic Rendering**:
   - `taskLoader.js` reads `tasks.json` across `agents/workspace/` and groups into `upcoming` and `past`.

## Risks / Trade-offs

- [Canvas rate limits or network issues] → Tool returns clean error status; agent handles retries with `BypassSandbox: true`.
