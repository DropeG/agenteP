## Context

The current Agente P interface consists of a global `Sidebar` (240px width) and a main content area rendering `CourseGrid` ("Mis Ramos") or `CalendarView`. When a user clicks a course card, there is currently no transition or course-specific detail view.

This design introduces a Master-Detail Dual Sidebar layout. Selecting a course collapses the main sidebar to icon-only mode (`64px`), mounts a secondary `CourseSubSidebar` (`200px`), and renders the `CourseGeneralView` in the remaining screen space.

## Goals / Non-Goals

**Goals:**
- Implement stateful layout transition (`selectedCourse` state in `App.jsx`).
- Support primary sidebar collapse mode (`isCollapsed` prop on `Sidebar.jsx`).
- Build `CourseSubSidebar.jsx` with a back button ("◄ Volver a Ramos"), course header, and a single active section ("General").
- Build `CourseGeneralView.jsx` displaying description, evaluations & key dates, and contact emails with copy interaction.
- Obey Agente P visual system: 95% warm-neutral (`#FAF7F2`), text (`#45240F`), turquoise actions (`#08ACB1`), zero AI slop, zero fake metric widgets.
- Responsive design for desktop, tablet, and mobile.

**Non-Goals:**
- Creating extra tabs in the sub-sidebar (e.g., Tareas, Logs, Resúmenes) for this initial MVP phase.
- Modifying backend schemas or API endpoints; data will be loaded dynamically from local workspace `course_profile.json` and `calendar.json`.

## Decisions

### Decision 1: Lift Course Selection State to `App.jsx`
- **Choice**: Keep `selectedCourse` state in `App.jsx` alongside `activeView`.
- **Rationale**: `App.jsx` controls layout styling (`appShell`) and handles sidebar dimensions. Having `selectedCourse` at the top level allows smooth passing to both `Sidebar`, `CourseSubSidebar`, and `CourseGeneralView`.

### Decision 2: Pure CSS Smooth Layout Transitions
- **Choice**: Use CSS transitions on width/margin (`transition: width 0.25s ease, margin-left 0.25s ease`).
- **Rationale**: Provides a fluid feel without importing external heavy layout libraries, keeping the frontend lightweight and fast.

### Decision 3: Card Click Action
- **Choice**: Pass `onSelectCourse(course)` callback down through `CourseGrid` to `CourseCard`.
- **Rationale**: Keeps `CourseCard` a pure presentation component while enabling card click to trigger state updates in `App.jsx`.

## Risks / Trade-offs

- **[Risk] Mobile View Screen Clutter** → *Mitigation*: On mobile screens (<768px), the main sidebar collapses completely into a hamburger menu or top header bar, and `CourseSubSidebar` replaces the drawer or operates as a compact sticky header.
- **[Risk] Missing Description in JSON** → *Mitigation*: Fall back gracefully if `description` is not present in `course_profile.json`, providing a fallback text or synthesizing from course name.
