## ADDED Requirements

### Requirement: Course SubSidebar Tasks Navigation
The system SHALL display a "Tareas" navigation item inside the `CourseSubSidebar` component when viewing a selected course.

#### Scenario: User clicks Tareas tab in sub-sidebar
- **WHEN** the user clicks the "Tareas" option in the course sub-sidebar
- **THEN** the active course view changes from "General" to "Tareas" and highlights the "Tareas" item as active.

### Requirement: Render Course Tasks View Layout
The system SHALL render a dedicated `CourseTasksView` component containing a section for pending tasks ("Tareas por hacer") and completed tasks ("Tareas ya hechas").

#### Scenario: Displaying pending and completed tasks sections
- **WHEN** the user is viewing the "Tareas" tab of a selected course
- **THEN** the screen displays the "Tareas por hacer" list with pending assignment cards and the "Tareas ya hechas" list with completed assignment cards using the AgenteP neutral design system.
