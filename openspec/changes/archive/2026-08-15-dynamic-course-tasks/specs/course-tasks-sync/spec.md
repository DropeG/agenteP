## ADDED Requirements

### Requirement: Task Synchronization Skill and Workflow
The system SHALL provide an agent skill (`.agents/skills/sync_tasks/SKILL.md`) that guides the reasoning agent to fetch raw assignments via deterministic CLI tools, semantically map them to the evaluation taxonomy defined in `course_profile.json`, and output canonical `agents/workspace/<COURSE_CODE>/tasks.json`.

#### Scenario: Agent runs sync_tasks skill for a course
- **WHEN** the agent executes the `sync_tasks` skill for a course (e.g. `IIC2523`)
- **THEN** it executes deterministic Canvas I/O tools with `BypassSandbox: true`, reasons about the proper category folder based on `course_profile.json`, and writes `agents/workspace/<COURSE_CODE>/tasks.json`.

### Requirement: Deterministic Task CLI Tools
The system SHALL provide deterministic Python CLI tools (`agents/core/tasks_tools.py`) free of AI SDK imports to fetch Canvas assignments and persist normalized JSON files.

#### Scenario: Running deterministic tasks tool
- **WHEN** `tasks_tools.py` is invoked with `--course <CODE>`
- **THEN** it fetches assignment metadata from Canvas API and returns or persists the records deterministically.

### Requirement: Calendar Event Upserting
The system SHALL ensure that any synced assignment containing a due date triggers `calendar_tools.py upsert-event` to maintain `agents/workspace/calendar.json` in sync.

#### Scenario: Syncing assignment with due date
- **WHEN** an assignment with a due date is processed
- **THEN** an event with `source: "canvas_assignment"` is upserted into `agents/workspace/calendar.json`.
