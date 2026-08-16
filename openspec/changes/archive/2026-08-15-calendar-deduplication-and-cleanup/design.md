## Context

The calendar file `agents/workspace/calendar.json` stores master evaluation dates for all enrolled courses. Ingestions come from three sources:
1. Syllabus profiling (`source: "syllabus"`)
2. Canvas API / assignment sync (`source: "canvas_assignment"` / `"canvas"`)
3. Announcement tracking via El Guardián (`source: "announcement"`)

Because `slugify()` previously stripped non-ASCII characters without diacritic stripping (converting 'ó' to hyphens) and `upsert_event()` only matched exact string IDs, slight differences in naming or formatting created duplicated records on identical dates.

## Goals / Non-Goals

**Goals:**
- Provide a robust, unicode-aware `slugify()` function that maps diacritics to ASCII and handles underscores/hyphens cleanly.
- Implement two-tier event matching in `upsert_event()`: match by canonical ID first, and fallback to `course_code` + `date/time` (or canonical evaluation type + number) to prevent duplicates.
- Clean and deduplicate `calendar.json` by merging existing duplicate events while retaining the most complete metadata (locations, descriptions, details).
- Provide an automated cleanup / test command in `calendar_tools.py` (e.g. `deduplicate-calendar`).

**Non-Goals:**
- Changing frontend UI components (the UI already renders whatever is in `calendar.json` cleanly).
- Modifying Canvas API endpoints or remote backend databases.

## Decisions

### Decision 1: `unicodedata.normalize('NFKD')` for Slug Generation
- **Rationale**: Python's standard library `unicodedata` cleanly decomposes accented characters ('ó' -> 'o' + combining acute) so that combining marks can be discarded with `encode('ascii', 'ignore')`.
- **Alternative considered**: Regex replace lists (e.g. `text.replace('ó', 'o')`), which is incomplete and error-prone.

### Decision 2: Two-Tier Matching for Upserts
- **Tier 1**: Exact canonical ID match (`evt['id'] == target_id`).
- **Tier 2**: Semantic match: if same `course_code` and same normalized date (YYYY-MM-DD) or close time window with compatible type/title, treat as an update to the existing event and optionally harmonize the ID.
- **Rationale**: Guarantees idempotency even when Syllabus calls an event 'AC01 - Algoritmo Panadero' and Canvas calls it 'AC01'.

## Risks / Trade-offs

- **[Risk]** Merging two genuinely distinct events that occur on the same day for the same course (e.g., two different quick quizzes).
  - **Mitigation**: Semantic matching requires both course and title/type compatibility (e.g., matching evaluation numbers or specific titles) or exact time overlap, rather than blindly merging all same-day events.
