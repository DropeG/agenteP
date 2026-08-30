## ADDED Requirements

### Requirement: Deterministic Announcement Fetching
The system SHALL provide a script (`fetch_daily_announcements.py`) that deterministically fetches announcements published in the last 24 hours via the Canvas API without using LLMs.

#### Scenario: Running the collector script
- **WHEN** the `fetch_daily_announcements.py` script is executed
- **THEN** it downloads the latest 24 hours of announcements for all active courses and outputs a raw JSON array of these announcements.

### Requirement: Agent Triage and Calendar Synchronization
The LLM agent SHALL evaluate the raw announcements, classify their relevance, and strictly extract and register any scheduling information directly to the calendar.

#### Scenario: Agent detects a date change or new evaluation
- **WHEN** an announcement contains a date, deadline, or schedule change
- **THEN** the agent MUST execute `calendar_tools.py upsert-event` to register the event with `source: announcement` before proceeding.

### Requirement: Daily Summary Data Structure
The agent SHALL produce a final `workspace/daily_summary.json` file strictly categorized into critical alerts, informative notes, and a count of discarded noise.

#### Scenario: Agent finalizes the summary
- **WHEN** the agent finishes evaluating all announcements
- **THEN** it writes a JSON file with `critical`, `informative` arrays and a `discarded_count` integer, containing no extra markdown formatting.

### Requirement: Impeccable Summary UI Rendering
The `SummaryView.jsx` component SHALL render the `daily_summary.json` data visually separating critical items from informative ones, using Perry UI accents exclusively for critical information.

#### Scenario: Viewing the Summary section
- **WHEN** the user navigates to the "Resumen" view
- **THEN** the frontend displays critical alerts with prominent styling (orange/turquoise accents) at the top, followed by informative announcements in standard monochrome, and a subtle footer indicating discarded noise.
