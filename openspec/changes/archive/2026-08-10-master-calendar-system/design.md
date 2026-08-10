## Context

Course evaluation dates and homework deadlines currently live in separate files (`course_profile.json`, assignment metadata, announcement logs). By introducing a central Master Calendar data store (`agents/workspace/calendar.json`) driven by an event-extraction rule, all agents and skills can stream dates into a single, unified timeline.

## Goals / Non-Goals

**Goals:**
- Implement `calendar_tools.py` with CLI subcommands (`upsert-event`, `list-events`, `remove-event`) managing `agents/workspace/calendar.json`.
- Add a mandatory Date Extraction Rule to `.agents/AGENTS.md` so every agent turn remains aware of calendar date updates.
- Update `profile_course/SKILL.md` and `guardian/SKILL.md` to instruct the agent step-by-step to invoke `calendar_tools.py` when discovering or modifying dates.

**Non-Goals:**
- External OAuth calendar integration (Google Calendar API / Apple iCal API) in this phase. (The `calendar.json` file serves as the clean data layer for future frontend and `.ics` exports).

## Decisions

### Decision 1: Event ID Standardization & Deduplication
To prevent duplicate calendar entries when multiple skills process the same evaluation, event IDs will follow the deterministic convention:
`{course_code}-{type_slug}` (e.g., `iic2213-i1`, `iic2213-i2`, `iic2213-examen`, `iic2143-tarea-1`).
Running `upsert-event` with an existing `event-id` updates the date and details in place.

### Decision 2: ISO-8601 Date Formatting
All dates stored in `calendar.json` MUST be ISO-8601 strings (e.g. `2026-09-03T17:30:00-04:00`) to enable precise chronological sorting and frontend rendering.

## Risks / Trade-offs

- **[Risk] Fuzzy Date Text in Announcements**: An announcement might say *"La I1 se corre al próximo jueves"* without giving an explicit ISO timestamp.
  - *Mitigation*: The agent uses current context and semester date math to infer the ISO date before calling `upsert-event`.
