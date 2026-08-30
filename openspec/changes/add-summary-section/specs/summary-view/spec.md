## ADDED Requirements

### Requirement: Sidebar Resumen Navigation
The primary sidebar navigation SHALL include a "Resumen" option positioned cleanly alongside "Mis Ramos", "Calendario", and "Configuración", utilizing a document icon.

#### Scenario: Clicking Resumen navigation option
- **WHEN** the user clicks on the "Resumen" button in the primary sidebar navigation
- **THEN** the application switches `activeView` to "summary", highlights the "Resumen" menu item as active, and closes the mobile drawer if open.

### Requirement: Blank Placeholder Summary View
The application SHALL render a clean, minimal placeholder view when "Resumen" is active, styled according to Agente P design standards.

#### Scenario: Rendering blank Summary view
- **WHEN** the user navigates to the "Resumen" view
- **THEN** the main content area displays the blank Summary container without console errors or external network requests.

#### Scenario: Resetting selected course upon navigating to Resumen
- **WHEN** a course detail is open and the user clicks "Resumen" in the sidebar
- **THEN** the application clears `selectedCourse` to null and displays the primary Summary view.
