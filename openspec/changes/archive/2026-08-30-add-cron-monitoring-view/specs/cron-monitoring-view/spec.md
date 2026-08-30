## ADDED Requirements

### Requirement: Canonical Cron Status Schema
The system SHALL maintain a local JSON data source at `agents/workspace/cron_status.json` defining the registry of all scheduled cron jobs and background automations. Each entry SHALL contain an identifier, human-readable name, description, cron schedule cadence expression, execution status (`success`, `running`, `error`, `idle`), timestamps (`last_run`, `next_run`), and an array of timestamped log entries (`timestamp`, `level`, `message`).

#### Scenario: Valid Cron Status Data Structure
- **WHEN** the frontend loads `agents/workspace/cron_status.json`
- **THEN** it receives a structured object of registered cron tasks with their statuses and log entries

### Requirement: Advanced Settings Navigation Access
The Settings view SHALL render an entry point card for Advanced Configuration / Automations & Crons that allows navigating to the dedicated Cron Monitoring sub-view.

#### Scenario: Navigating from Settings to Cron Monitoring View
- **WHEN** user clicks on the "Automatizaciones & Crons" card inside the Settings view
- **THEN** the interface transitions into the Cron Monitoring view displaying the registered cron jobs and a back navigation action

#### Scenario: Returning from Cron Monitoring View to Settings
- **WHEN** user clicks on the "Volver a Configuración" button inside the Cron Monitoring view
- **THEN** the interface returns to the main Settings view

### Requirement: Dynamic Cron Job Listing and Visual Status
The Cron Monitoring view SHALL dynamically list all registered cron jobs from `cron_status.json` without hardcoding specific job keys. Each card SHALL display the job name, description, cron schedule badge in monospace, last and next execution timestamps, and a visual status indicator.

#### Scenario: Dynamic Rendering of Registered Cron Jobs
- **WHEN** new cron job entries are added to `cron_status.json`
- **THEN** the Cron Monitoring view renders them automatically without changes to the React component

#### Scenario: Status Indicator Display
- **WHEN** a cron job has status `success`, `running`, `error`, or `idle`
- **THEN** the card displays the corresponding color-coded status badge according to the active theme

### Requirement: Collapsible Logs Accordion and Terminal Viewer
Each cron job card SHALL provide a collapsible accordion toggle to view its execution logs in a terminal-like console formatted with `var(--font-mono)` (`JetBrains Mono`). The log viewer SHALL highlight log severity levels (`INFO`, `SUCCESS`, `WARNING`, `ERROR`) and provide a button to copy the logs to the clipboard.

#### Scenario: Expanding and Collapsing Log Accordion
- **WHEN** user clicks on the "Ver Logs" / "Ocultar Logs" button on a cron job card
- **THEN** the card smoothly expands or collapses the monospace log console for that job

#### Scenario: Copying Logs to Clipboard
- **WHEN** user clicks on the "Copiar Logs" button inside an open log console
- **THEN** the log lines are copied to the system clipboard and a confirmation indicator is shown
