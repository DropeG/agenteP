---
name: guardian
description: "Ingest and track Canvas UC announcements incrementally by finding the oldest unprocessed announcement, saving it to workspace, and updating state.json."
---

# Skill: guardian

Use this skill when running **El Guardián** to check Canvas UC for new announcements, save them locally, and advance the course processing state.

## Step 1: Discover & Select Oldest Unmarked Announcement

1. Query Canvas API (`GET /api/v1/courses?enrollment_state=active`) to get the course ID for the target course (e.g. `IIC2143`).
2. Fetch all announcements for the course (`GET /api/v1/courses/{course_id}/discussion_topics?only_announcements=true&per_page=100`).
3. Sort all retrieved announcements chronologically from **oldest to newest** based on `posted_at` or `created_at`.
4. Read the course tracking file at `agents/workspace/{COURSE_CODE}/state.json`:
   - If `state.json` does not exist, initialize `last_processed_index` as `-1`.
   - Set target index = `last_processed_index + 1`.
5. If target index >= total announcements count, report that all announcements are processed.
6. Otherwise, select the announcement at target index (the oldest unmarked announcement).

## Step 2: Save Announcement & Mark State

1. Create directory `agents/workspace/{COURSE_CODE}/announcements/` if it does not exist.
2. Format a clean filename: `{PREFIX}_{SAFE_TITLE}.md` (where `{PREFIX}` is `01`, `02`, etc. based on `target_index + 1`).
3. Save the raw announcement title, date, author, and content into `agents/workspace/{COURSE_CODE}/announcements/{FILENAME}`.
4. Update `agents/workspace/{COURSE_CODE}/state.json`:
   ```json
   {
     "course_code": "{COURSE_CODE}",
     "last_processed_index": target_index,
     "last_posted_at": "{POSTED_AT}"
   }
   ```
5. Log the ingestion step so the next run automatically picks up the following unmarked announcement (`target_index + 1`).

## Step 3: Calendar Date Extraction & Rescheduling

1. Analyze the processed announcement content for any evaluation dates, submission deadlines, or rescheduled events (e.g., *"La I1 se corrió al 10 de septiembre"* or *"Entrega Tarea 1 extendida hasta..."*).
2. If any evaluation date or deadline is mentioned or modified, execute `calendar_tools.py upsert-event` to register/update it in `agents/workspace/calendar.json`:
   ```bash
   backend/venv/bin/python agents/core/calendar_tools.py upsert-event \
     --course {COURSE_CODE} \
     --title "{EVENT_TITLE}" \
     --type {EVENT_TYPE} \
     --date "{ISO_DATE_STRING}" \
     --source "announcement"
   ```
