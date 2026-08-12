## ADDED Requirements

### Requirement: Dynamic Workspace Course Discovery
The system SHALL dynamically discover and load course profiles from `agents/workspace/*/course_profile.json` in the frontend application.

#### Scenario: All workspace course cards displayed
- **WHEN** the user views the "Mis Ramos" page in the application
- **THEN** course cards for all course profiles present in `agents/workspace/` are rendered with their respective `course_code` and `course_name`
- **AND** no course codes or names are hardcoded in the frontend initial state.

#### Scenario: Fallback for empty workspace
- **WHEN** no course profiles exist in `agents/workspace/`
- **THEN** the system displays the empty state message indicating courses will load automatically from Canvas UC.
