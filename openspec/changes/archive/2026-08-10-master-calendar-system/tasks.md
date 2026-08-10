## 1. Calendar Primitive Helper (`calendar_tools.py`)

- [x] 1.1 Create `agents/core/calendar_tools.py` with `upsert-event`, `list-events`, and `remove-event` subcommands.
- [x] 1.2 Implement automatic deduplication by `event-id` and chronological sorting when persisting to `agents/workspace/calendar.json`.

## 2. Enforce Global Rules & Skill Workflow Steps

- [x] 2.1 Add mandatory Date Extraction rule to `.agents/AGENTS.md`.
- [x] 2.2 Update `.agents/skills/profile_course/SKILL.md` to include date registration step for syllabus exam dates.
- [x] 2.3 Update `.agents/skills/guardian/SKILL.md` to include date registration step when processing announcement date changes.

## 3. Verification & Testing

- [x] 3.1 Test `calendar_tools.py` CLI commands for event upsert, update, and sorting in `calendar.json`.
- [x] 3.2 Register the exam dates for course `IIC2213` (I1, I2, Examen) into `master_calendar.json` and verify results.
