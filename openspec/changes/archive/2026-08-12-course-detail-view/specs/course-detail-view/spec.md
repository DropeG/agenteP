## ADDED Requirements

### Requirement: Primary Sidebar Collapse on Course Selection
The primary sidebar SHALL collapse to a compact mini-sidebar (`64px` width) displaying only the logo and navigation icons whenever a course is selected from the main grid.

#### Scenario: User clicks a course card
- **WHEN** the user clicks on a course card on the "Mis Ramos" main grid
- **THEN** the primary sidebar transitions to collapsed mini-mode (`64px`) and the selected course context becomes active

#### Scenario: User returns to main courses view
- **WHEN** the user clicks the "Volver a Ramos" button or the main logo in mini-sidebar mode
- **THEN** the primary sidebar expands back to full width (`240px`) and the main "Mis Ramos" grid is displayed

### Requirement: Course Sub-sidebar Rendering
The system SHALL render a dedicated secondary sidebar (`200px` width) for the active course showing the course code, course name, a return action, and course navigation items.

#### Scenario: Rendering course sub-sidebar
- **WHEN** a course is active
- **THEN** the course sub-sidebar is displayed beside the mini primary sidebar with "General" highlighted as the default active section

### Requirement: Course General View Display
The system SHALL display the "General" section of the selected course, rendering the course description, evaluation rules and key dates, and contact information for professors and teaching assistants.

#### Scenario: Viewing General section for IIC2213
- **WHEN** the user selects the course "IIC2213"
- **THEN** the main content area renders the course full title, description, evaluation formula with key dates (I1, I2, Examen), and contact emails for Professor Miguel Romero and all 6 teaching assistants with a quick-copy action
