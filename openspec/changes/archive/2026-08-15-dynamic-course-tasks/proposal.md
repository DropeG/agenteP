## Why

Currently, `CourseTasksView` displays hardcoded mock tasks, and there is no dynamic, generic task ingestion and storage per course. We need an agentic, decoupled architecture where a dedicated skill (`sync_tasks`) uses pure deterministic Python tools for I/O and leverages the reasoning agent to map assignments to the course's taxonomy (`course_profile.json`), persist canonical `tasks.json` and `calendar.json`, and feed the dynamic frontend without hardcoded course codes or fixed categories.

## What Changes

- Add `.agents/skills/sync_tasks/SKILL.md` to define the reasoning agent workflow for discovering, categorizing, and synchronizing course tasks.
- Add deterministic I/O primitive in `agents/core/tasks_tools.py` (or extending `canvas_tools.py`) with zero AI SDK imports to list raw assignments and save canonical JSON files.
- Integrate with `calendar_tools.py` for idempotent date upserting.
- Implement `frontend/src/utils/taskLoader.js` to dynamically load `tasks.json` for any course.
- Connect `CourseTasksView.jsx` to render dynamic Upcoming and Past assignments.
- Dynamically update the task count badge in `CourseSubSidebar.jsx`.

## Capabilities

### New Capabilities
- `course-tasks-sync`: Reasoning skill and deterministic CLI primitives for ingesting and normalizing assignments into canonical `tasks.json` and `calendar.json`.

### Modified Capabilities
- `course-tasks-view`: The frontend view displays dynamic, real course assignments (Upcoming vs Past) loaded from canonical course task records instead of static mock data.

## Impact

- **Skills**: Adds `.agents/skills/sync_tasks/SKILL.md`.
- **Backend / CLI Tools**: Deterministic I/O script `agents/core/tasks_tools.py` (no AI SDKs).
- **Frontend**: Adds `frontend/src/utils/taskLoader.js`, updates `CourseTasksView.jsx` and `CourseSubSidebar.jsx`.
- **Workspace**: Saves canonical `agents/workspace/<COURSE_CODE>/tasks.json`.
