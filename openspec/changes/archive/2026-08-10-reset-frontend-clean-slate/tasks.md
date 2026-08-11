## 1. Cleanup Legacy Codebase

- [x] 1.1 Delete unused legacy components (`CourseWorkspaceView.jsx`, `DetailPanel.jsx`, `CourseSidebar.jsx`, `SettingsView.jsx`) from `frontend/src/components/`
- [x] 1.2 Delete backend server directory (`backend/`)

## 2. Rebuild Frontend Component Structure

- [x] 2.1 Simplify `CourseCard.jsx` to render static course cards showing only course code (`sigla`) and course title
- [x] 2.2 Update `CourseGrid.jsx` to display static course cards without active task counters
- [x] 2.3 Ensure `Sidebar.jsx` retains the Perry logo, brand name, and navigation links ("Mis Ramos" and "Configuración")
- [x] 2.4 Refactor `App.jsx` to remove all Supabase polling, WebSockets, and heavy state dependencies

## 3. Verification & Preview

- [x] 3.1 Verify clean Vite build and local execution without network errors or broken imports
