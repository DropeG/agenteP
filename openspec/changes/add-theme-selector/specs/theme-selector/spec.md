## ADDED Requirements

### Requirement: Theme Application
The system SHALL support dynamic application of themes by reading a `data-theme` attribute on the global `<html>` element. The available themes are: `light`, `dark`, `monokai`, `dracula`, `owca`, `coffee`, and the default theme (when attribute is missing or empty).

#### Scenario: User selects a valid theme
- **WHEN** the user selects "monokai" from the theme selector
- **THEN** the system applies `data-theme="monokai"` to the HTML root
- **THEN** the UI updates immediately to reflect the new CSS variables

### Requirement: Theme Persistence
The system SHALL persist the user's selected theme in `localStorage` under the key `agente_p_theme` to ensure preferences are maintained across sessions.

#### Scenario: User reloads the page
- **WHEN** the user has previously selected a theme and reloads the browser
- **THEN** the system reads `localStorage` before rendering
- **THEN** the system applies the saved theme to prevent a flash of unstyled content (FOUC)

### Requirement: Theme Selector UI
The system SHALL provide a dedicated user interface component within the configuration view to allow users to visualize and select their preferred theme.

#### Scenario: User views the configuration settings
- **WHEN** the user navigates to the configuration view
- **THEN** they are presented with a visual grid or list of available themes
- **THEN** the currently active theme is visually highlighted
