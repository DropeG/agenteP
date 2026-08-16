## 1. Calendar Tools Enhancement

- [x] 1.1 Update `slugify()` in `agents/core/calendar_tools.py` with `unicodedata.normalize('NFKD')` for diacritic-safe slug generation
- [x] 1.2 Implement two-tier semantic matching in `upsert_event()` to update existing same-course/same-date evaluations in-place
- [x] 1.3 Add `deduplicate-calendar` CLI command to `agents/core/calendar_tools.py`

## 2. Calendar Storage Cleanup

- [x] 2.1 Clean and merge existing duplicated events in `agents/workspace/calendar.json`, keeping enriched metadata

## 3. Verification

- [x] 3.1 Test idempotent upserts across simulated Syllabus and Canvas API event loads
- [x] 3.2 Verify `calendar.json` integrity and confirm all duplicated cards are gone
