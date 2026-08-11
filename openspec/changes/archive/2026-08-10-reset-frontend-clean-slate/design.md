## Context

The current repository contains prototype code in `frontend/` and `backend/` that was wired to real-time Supabase subscriptions and multi-tabbed course workspaces. To pivot to a cleaner, more modular architecture, we are deleting `backend/` and clearing out `frontend/` components while retaining the Perry visual design identity (logo, palette, typography) and the core Python engine (`agents/core/canvas_tools.py`, `calendar_tools.py`).

## Goals / Non-Goals

**Goals:**
- Delete `backend/` directory entirely.
- Delete complex legacy components in `frontend/src/components/` (`CourseWorkspaceView`, `DetailPanel`, `CourseSidebar`, `SettingsView`).
- Rebuild a clean `App.jsx` that only renders `Sidebar.jsx` and `CourseGrid.jsx`.
- Simplify `CourseCard.jsx` to be a minimal, static card displaying `sigla` and course name.
- Retain `index.css` design tokens (`--brand-cream`, `--brand-turquoise`, etc.), fonts, and responsive layout.

**Non-Goals:**
- Modifying `agents/core/` Python scripts or `.agents/skills/`.
- Implementing API fetching or backend API servers during this reset.

## Decisions

1. **Delete `backend/` directory**:
   - *Rationale*: The Python scripts in `agents/core/` already handle Canvas API operations deterministically. Removing `backend/` removes unused FastAPI boilerplate and SQLite database artifacts.

2. **Clean rebuild of `frontend/src/`**:
   - *Rationale*: Starting fresh with `App.jsx`, `Sidebar.jsx`, `CourseGrid.jsx`, and `CourseCard.jsx` ensures zero hidden dependencies or polling loops.

## Risks / Trade-offs

- **[Risk]** Missing components if referenced in other files → **Mitigation**: Update `App.jsx` to import only the retained components (`Sidebar`, `CourseGrid`, `CourseCard`).
- **[Risk]** Loss of legacy workspace UI logic → **Mitigation**: Saved in git history for future reference if needed.
