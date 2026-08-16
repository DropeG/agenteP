## 1. Skill & Deterministic Backend Tools

- [x] 1.1 Create `.agents/skills/sync_tasks/SKILL.md` defining the agentic workflow for discovering, categorizing, and synchronizing course tasks
- [x] 1.2 Implement deterministic Python CLI `agents/core/tasks_tools.py` (free of AI SDKs) for Canvas assignments I/O
- [x] 1.3 Execute `sync_tasks` on `IIC2523` (using `BypassSandbox: true`) to generate canonical `agents/workspace/IIC2523/tasks.json` and sync `calendar.json`

## 2. Frontend Dynamic Task Loader

- [x] 2.1 Create `frontend/src/utils/taskLoader.js` to dynamically load and group `tasks.json` per course into upcoming and past
- [x] 2.2 Update `CourseSubSidebar.jsx` to dynamically show the pending tasks badge count for the active course

## 3. Dynamic CourseTasksView Component

- [x] 3.1 Refactor `CourseTasksView.jsx` to consume dynamically loaded course tasks
- [x] 3.2 Implement clean layout for Upcoming Assignments (due date, availability, points) and Past Assignments
- [x] 3.3 Verify UI responsiveness and visual hierarchy with the AgenteP aesthetic
