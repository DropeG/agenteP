## ADDED Requirements

### Requirement: Master Calendar CLI Primitive
The system SHALL provide a CLI helper tool (`calendar_tools.py`) with `upsert-event`, `list-events`, and `remove-event` subcommands to manage events in `agents/workspace/calendar.json`.

#### Scenario: Upserting a new evaluation event
- **WHEN** `calendar_tools.py upsert-event --course IIC2213 --event-id iic2213-i1 --title "Interrogación 1" --type interrogacion --date "2026-09-03T17:30:00-04:00"` is executed
- **THEN** the event is written to `agents/workspace/calendar.json`, deduplicated by `event-id`, and sorted chronologically by date.

#### Scenario: Updating a rescheduled event
- **WHEN** an event with existing `event-id` `iic2213-i1` is upserted with a new date `"2026-09-10T17:30:00-04:00"`
- **THEN** the existing event entry in `calendar.json` is updated with the new date without creating duplicate entries.

### Requirement: Mandatory Agent Date Extraction Rule
The system SHALL enforce global behavioral rules in `AGENTS.md` and skill instructions in `profile_course/SKILL.md` and `guardian/SKILL.md` requiring the AI agent to execute `calendar_tools.py upsert-event` whenever a date is encountered.

#### Scenario: Registering dates during course profiling
- **WHEN** `profile_course` extracts exam dates from a course syllabus
- **THEN** the agent automatically invokes `calendar_tools.py upsert-event` for each exam date before completing the skill.

#### Scenario: Registering date changes from announcements
- **WHEN** El Guardián processes an announcement containing a date change or new deadline
- **THEN** the agent automatically invokes `calendar_tools.py upsert-event` to update `calendar.json`.
