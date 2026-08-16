## Why

`agents/workspace/calendar.json` contains duplicate evaluation and task entries (e.g. `iic2213-interrogaci-n-1--i1` and `iic2213-interrogacion_1_i1`, `eyp1027-t1` and `eyp1027-tarea_1`, `iic2523-ac01` and `iic2523-ac01_algoritmo_panadero`) due to non-unicode slugification discarding accented characters, naming discrepancies between Syllabus and Canvas, and strict ID-only matching in `upsert_event`. This causes confusing duplicate tiles in the frontend Calendar view and course general view.

## What Changes

- Clean and deduplicate existing entries in `agents/workspace/calendar.json`, preserving rich metadata (locations, rooms, and descriptions).
- Implement robust unicode slugification and canonical ID generation in `agents/core/calendar_tools.py` using `unicodedata.normalize('NFKD')`.
- Add two-tier semantic matching (ID match + course + date/time matching) in `upsert_event` so that repeated or slightly differently-named ingestions update existing records rather than appending duplicates.
- Ensure CLI commands and skill prompts enforce canonical identifiers and idempotent updates.

## Capabilities

### New Capabilities
- `calendar-deduplication`: Robust slug normalization, semantic date-based deduplication, and automated calendar cleanup to guarantee zero duplicate evaluations.

### Modified Capabilities
<!-- No requirement changes to existing front-end capabilities -->

## Impact

- `agents/workspace/calendar.json`: Cleaned and deduplicated.
- `agents/core/calendar_tools.py`: Enhanced `slugify`, `upsert_event`, and deduplication helpers.
- `frontend/src/components/CalendarView.jsx` and `CourseGeneralView.jsx`: Cleaner, duplicate-free display.
