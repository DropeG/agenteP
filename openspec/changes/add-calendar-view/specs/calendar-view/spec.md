## ADDED Requirements

### Requirement: Sidebar Calendar Navigation
The sidebar navigation SHALL include a "Calendario" option with a calendar icon.

#### Scenario: Clicking Calendar option
- **WHEN** the user clicks on the "Calendario" button in the primary sidebar navigation
- **THEN** the main view switches to the Calendar interface and highlights the "Calendario" menu item as active

### Requirement: Current Month Grid Display & Zero Vertical Scroll
The Calendar interface SHALL render by default a monthly grid view corresponding to the current month titled "Calendario" that fits entirely within the viewport without requiring vertical scrolling.

#### Scenario: Rendering default view
- **WHEN** the user navigates to the Calendar view
- **THEN** the system displays a clean header titled "Calendario" and a 7-column calendar grid for the current month sized dynamically to fit the screen height without scrollbars

### Requirement: Calendar Event Data Binding
The Calendar view SHALL parse and display evaluation events from `agents/workspace/calendar.json`.

#### Scenario: Displaying events on day cells
- **WHEN** calendar events exist in `workspace/calendar.json` for specific dates
- **THEN** badges for those events appear on their respective day cells in the grid with course code and title

### Requirement: Event Detail Inspection
The Calendar view SHALL display an inspection drawer or detail panel when an event or date cell is selected.

#### Scenario: Selecting an event
- **WHEN** the user clicks on an event badge or date cell
- **THEN** the detail panel displays the event title, course code, start time, location, origin source, and additional notes
