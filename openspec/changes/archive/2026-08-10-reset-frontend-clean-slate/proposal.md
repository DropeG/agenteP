## Why

The current codebase accumulated prototype debt and complex real-time subscriptions (Supabase polling, heavy workspace views, detail drawers) that are no longer aligned with the clean architectural goals for Agente P. We need to delete the legacy frontend and backend code to start from a clean slate, while retaining the beloved visual identity (logo, color palette, sidebar structure) and the core Python deterministic engine (`agents/core/canvas_tools.py`, `calendar_tools.py`).

## What Changes

- **BREAKING**: Remove legacy `frontend/` components (`CourseWorkspaceView`, `DetailPanel`, `CourseSidebar`, `SettingsView`) and `backend/` FastAPI server directory.
- **NEW**: Rebuild a lightweight, modular React + Vite frontend preserving the exact visual design system:
  - **Logo & Sidebar**: Agente P brand logo, title, and navigation menu ("Mis Ramos" and "Configuración").
  - **Mis Ramos View**: Minimalist grid of course cards (`CourseCard`) displaying only course code (`sigla`) and course name, completely static for now.
  - **Configuración View**: A clean, inert view (no-op when clicked) awaiting future configuration tools.
  - **Design System**: Maintain `index.css` with the Perry color tokens (`--brand-cream`, `--brand-turquoise`, `--brand-orange`, etc.), typography (`Inter`, `JetBrains Mono`), and mobile-responsive drawer.
- **PRESERVED**: Keep `.agents/` skills, `agents/core/` Python tools, `agents/workspace/`, `docs/`, and environment configuration intact.

## Capabilities

### New Capabilities
- `clean-frontend`: Lightweight, responsive React frontend featuring static course cards ("Mis Ramos") and a clean sidebar navigation.

### Modified Capabilities
- None.

## Impact

- `frontend/`: Cleaned up and rebuilt with minimal files (`App.jsx`, `Sidebar.jsx`, `CourseGrid.jsx`, `CourseCard.jsx`, `index.css`).
- `backend/`: Directory removed.
- `agents/`: Python engine and Canvas tools remain unchanged and ready for future integration.
