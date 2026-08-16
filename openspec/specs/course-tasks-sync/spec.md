# course-tasks-sync Specification

## Purpose
Define the universal task synchronization and normalization capabilities for course assignments across workspace courses.

## Requirements

### Requirement: Universal Task Normalization and Sync
The system SHALL provide a task synchronization tool (`tasks_tools.py`) that fetches or ingests assignments from Canvas (or other task sources) for workspace courses and outputs a normalized canonical `tasks.json` file in `agents/workspace/<COURSE_CODE>/tasks.json`.

#### Scenario: Syncing course tasks for a course
- **WHEN** the task sync tool is executed for a given course code (e.g. `IIC2523`)
- **THEN** it retrieves assignments, normalizes them with universal fields (`id`, `course_code`, `title`, `category`, `status`, `dates`, `points`, `source`, `details`), and saves them to `agents/workspace/<COURSE_CODE>/tasks.json`.

### Requirement: Task Idempotence and Calendar Integration
The system SHALL ensure that syncing tasks updates or upserts related due dates into `agents/workspace/calendar.json` with source `canvas_assignment`.

#### Scenario: Updating calendar on task sync
- **WHEN** an assignment with a valid due date is synced
- **THEN** an event is upserted into `agents/workspace/calendar.json` with the matching `course_code`, `title`, and `date`.
