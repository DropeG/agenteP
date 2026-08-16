# course-tasks-view Specification

## Purpose
Define the dynamic course tasks view and navigation requirements in the frontend.

## Requirements

### Requirement: Course SubSidebar Tasks Navigation
The system SHALL display a "Tareas" navigation item inside the `CourseSubSidebar` component when viewing a selected course, showing a dynamic badge count corresponding to the number of upcoming pending tasks.

#### Scenario: User clicks Tareas tab in sub-sidebar
- **WHEN** the user clicks the "Tareas" option in the course sub-sidebar
- **THEN** the active course view changes from "General" to "Tareas", highlights the "Tareas" item as active, and displays the dynamic count of pending tasks on the badge.

### Requirement: Render Course Tasks View Layout
The system SHALL render a dedicated `CourseTasksView` component dynamically loading real assignments from the course's `tasks.json` (or falling back gracefully if empty), grouping tasks into Upcoming Tasks ("Próximas Tareas") and Past Tasks ("Tareas Pasadas"), displaying title, due date, availability window, and points.

#### Scenario: Displaying real upcoming and past tasks
- **WHEN** the user is viewing the "Tareas" tab of a selected course
- **THEN** the screen displays the "Próximas Tareas" list and the "Tareas Pasadas" list populated dynamically from the course's task data using the AgenteP neutral design system.
