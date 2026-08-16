## ADDED Requirements

### Requirement: Unicode-Aware Slugification
The system SHALL normalize unicode characters, remove diacritics (e.g. convert 'ó' to 'o', 'ñ' to 'n'), lowercase all letters, and sanitize special characters to single hyphens when generating calendar event identifiers.

#### Scenario: Accented title normalization
- **WHEN** `slugify('Interrogación 1 (I1)')` is called
- **THEN** the generated slug SHALL be `interrogacion-1-i1` without broken characters or double hyphens

### Requirement: Semantic Two-Tier Upsert
The `upsert_event` function in `calendar_tools.py` SHALL perform a two-tier match before inserting a new event:
1. Primary match: Check if `event.id == event_id` (or normalized equivalent).
2. Semantic fallback match: If no ID match is found, check if an existing event exists with the same `course_code` and matching date/time (or normalized canonical type/number within the same evaluation window). If matched, it SHALL update the existing entry in place instead of creating a duplicate.

#### Scenario: Canvas confirmation of Syllabus baseline event
- **WHEN** Canvas sync ingests an assignment with title 'AC01' on a date where a syllabus baseline event 'AC01 - Algoritmo Panadero' already exists for the same course
- **THEN** the system SHALL update the existing event record with Canvas details and not add a second entry

#### Scenario: Exact ID match update
- **WHEN** an announcement or manual command upserts an event with the same ID
- **THEN** the existing event's fields SHALL be updated and the total number of events SHALL remain unchanged

### Requirement: Calendar JSON Cleanup and Deduplication
The calendar storage `agents/workspace/calendar.json` SHALL contain exactly one entry per unique course evaluation event, merging existing duplicated records and preserving richer metadata (locations, details, and valid timestamps).

#### Scenario: Existing duplicates resolved
- **WHEN** the calendar file is loaded after cleanup
- **THEN** all duplicated IDs (such as `iic2213-interrogaci-n-1--i1`, `eyp1027-t1`, `eyp1027-i1`) SHALL be merged into their canonical versions and no two entries SHALL represent the same course evaluation on the same date
