## Context

The current `App.jsx` hardcodes a single course card `INITIAL_COURSES`. The workspace already contains profiled courses under `agents/workspace/<SIGLA>/course_profile.json`.

## Goals / Non-Goals

**Goals:**
- Dynamically discover all `course_profile.json` files in `agents/workspace/` at runtime using Vite `import.meta.glob`.
- Render cards for all workspace courses in `CourseGrid`.
- Ensure zero hardcoded course codes in `App.jsx`.

**Non-Goals:**
- Implementing course detail modal or expanded view when clicking a card in this phase (user requested to show cards only for now).
- Backend API server changes.

## Decisions

### Decision 1: Use `import.meta.glob` for Client-side Workspace Discovery
- **Choice**: Use Vite's native `import.meta.glob('../../../agents/workspace/*/course_profile.json', { eager: true })` helper.
- **Rationale**: Cleanest method in Vite. Whenever a new `course_profile.json` is created in `agents/workspace/`, Vite instantly discovers it without requiring manually updated indices or python servers.
- **Alternatives Considered**:
  - *Static list*: Rejected due to violation of universal agent design rules.
  - *Python REST API endpoint*: Rejected as unnecessary complexity when JSON files are in the repository workspace.

## Risks / Trade-offs

- **[Risk] Missing or malformed `course_profile.json`** → Add fallback handling in the loader utility to filter out invalid objects or render defaults (`course_code` derived from folder name if needed).
