## Why

Course deadlines and evaluation dates arrive asynchronously throughout the semester from three distinct channels: course syllabi (exams), Canvas assignments (homework deadlines), and announcements (date changes or extensions). 

Without a central calendar store, these dates remain scattered across separate course folders. Implementing a centralized Master Calendar system (`master_calendar.json`) driven by an event extraction rule ensures that every agent automatically registers any detected date into a single, unified semester timeline.

## What Changes

- **Create `calendar_tools.py`**: Build a deterministic CLI helper script providing `upsert-event`, `list-events`, and `remove-event` commands to manage `agents/workspace/calendar.json`.
- **Global Agent Rule (`AGENTS.md`)**: Add a mandatory global behavior rule requiring any agent processing course materials (syllabus, announcements, assignments) to invoke `calendar_tools.py upsert-event` upon discovering a date.
- **Update Skills (`profile_course`, `guardian`)**: Add explicit date extraction steps to `profile_course/SKILL.md` (syllabus exam dates) and `guardian/SKILL.md` (announcement date changes).
- **Master Calendar Data Store (`calendar.json`)**: Maintain a clean, ISO-8601 formatted, chronologically sorted JSON store of all course events and deadlines in `agents/workspace/calendar.json`.

## Capabilities

### New Capabilities
- `master-calendar`: Event-driven calendar extraction and centralized semester schedule management.

### Modified Capabilities
*(None)*

## Impact

- **Affected Code**: `agents/core/calendar_tools.py`, `.agents/AGENTS.md`, `.agents/skills/profile_course/SKILL.md`, `.agents/skills/guardian/SKILL.md`.
- **Data Stores**: `agents/workspace/calendar.json`.
- **User Workflow**: The AI agent automatically populates and updates a unified calendar whenever reading syllabi, homeworks, or announcements.
