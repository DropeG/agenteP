## ADDED Requirements

### Requirement: Three-Phase Calendar Event Lifecycle
The system MUST manage calendar events using a three-phase lifecycle (Syllabus Baseline -> Live Assignment Sync -> Announcement Post Updates) to maintain full traceability of date changes.

#### Scenario: Registering initial syllabus baseline dates
- **WHEN** `profile_course` extracts evaluation dates from the syllabus
- **THEN** it registers each event in `agents/workspace/calendar.json` using `calendar_tools.py upsert-event` with `source: "syllabus"`.

#### Scenario: Updating dates from live Canvas assignments or announcements
- **WHEN** an assignment is set up or an announcement announces a date change or postponement
- **THEN** the system updates the existing event by matching its slug ID, updating the `date` field, updating `source` (to `"canvas_assignment"` or `"announcement"`), and appending the reason for change in `details`.
