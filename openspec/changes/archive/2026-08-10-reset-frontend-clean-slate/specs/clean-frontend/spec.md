## ADDED Requirements

### Requirement: Minimal Static Course Cards View ("Mis Ramos")
The frontend SHALL display a grid of minimalist course cards ("Mis Ramos") containing only the course code (`sigla`) and course name, without active task count badges, complex popups, or real-time polling.

#### Scenario: Rendering static course cards
- **WHEN** the user opens the application on "Mis Ramos" view
- **THEN** the application renders a clean grid with static course cards displaying the course code and title.

#### Scenario: Inert interaction on course cards
- **WHEN** the user clicks on a static course card
- **THEN** the system maintains the card view without navigating to complex workspace views or detail panels.

### Requirement: Clean Sidebar Navigation with Perry Design Tokens
The application SHALL provide a single responsive sidebar navigation utilizing the Perry color palette (`--brand-cream`, `--brand-turquoise`, etc.), logo, and brand title, with navigation links for "Mis Ramos" and "Configuración".

#### Scenario: Switching to Mis Ramos
- **WHEN** the user clicks "Mis Ramos" in the sidebar
- **THEN** the sidebar marks "Mis Ramos" as active and displays the course cards grid.

#### Scenario: Mobile drawer toggle
- **WHEN** the user views the app on mobile viewport and toggles the menu button
- **THEN** the header displays the hamburger drawer containing the sidebar navigation.

### Requirement: Inert Configuration Placeholder View
The application SHALL allow selecting the "Configuración" option in the sidebar without throwing errors or initiating network requests.

#### Scenario: Selecting Configuración
- **WHEN** the user clicks "Configuración" in the sidebar
- **THEN** the sidebar updates active state to Configuración and displays an empty placeholder view without executing API requests.
