import sys
import os
import json
import argparse
from pathlib import Path
from datetime import datetime

AGENTS_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = AGENTS_DIR / "workspace"
CALENDAR_FILE = WORKSPACE_DIR / "calendar.json"

def load_calendar():
    if not CALENDAR_FILE.exists():
        return []
    try:
        with open(CALENDAR_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_calendar(events):
    WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)
    # Sort events by date
    def parse_event_date(evt):
        d_str = evt.get("date") or evt.get("start_at") or ""
        try:
            return datetime.fromisoformat(d_str.replace("Z", "+00:00"))
        except Exception:
            return datetime.max

    events.sort(key=parse_event_date)
    with open(CALENDAR_FILE, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2, ensure_ascii=False)

def slugify(text):
    import re
    return re.sub(r'[^a-zA-Z0-9]', '-', text.lower()).strip('-')

def upsert_event(course_code, title, date, event_type="general", event_id=None, location=None, details=None, source="agent"):
    events = load_calendar()
    course_code = course_code.upper()

    if not event_id:
        slug_title = slugify(title)
        event_id = f"{course_code.lower()}-{slug_title}"

    now_iso = datetime.now().isoformat()
    existing_index = None
    for idx, evt in enumerate(events):
        if evt.get("id") == event_id:
            existing_index = idx
            break

    event_data = {
        "id": event_id,
        "course_code": course_code,
        "title": title,
        "type": event_type,
        "date": date,
        "start_at": date,
        "location": location,
        "details": details,
        "source": source,
        "last_updated": now_iso
    }

    if existing_index is not None:
        events[existing_index].update(event_data)
        action = "updated"
    else:
        events.append(event_data)
        action = "created"

    save_calendar(events)
    result = {
        "status": "success",
        "action": action,
        "event": event_data,
        "total_calendar_events": len(events)
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))

def list_events(course_code=None, event_type=None):
    events = load_calendar()
    if course_code:
        events = [e for e in events if e.get("course_code", "").upper() == course_code.upper()]
    if event_type:
        events = [e for e in events if e.get("type", "").lower() == event_type.lower()]
    print(json.dumps(events, indent=2, ensure_ascii=False))

def remove_event(event_id):
    events = load_calendar()
    initial_len = len(events)
    events = [e for e in events if e.get("id") != event_id]
    if len(events) < initial_len:
        save_calendar(events)
        print(json.dumps({"status": "success", "removed_id": event_id}))
    else:
        print(json.dumps({"error": f"Event {event_id} not found"}))

def main():
    parser = argparse.ArgumentParser(description="AgenteP Master Calendar Tool")
    parser.add_argument("command", choices=["upsert-event", "list-events", "remove-event"])
    parser.add_argument("--course", help="Course Code (e.g. IIC2213)")
    parser.add_argument("--event-id", help="Unique event ID (e.g. iic2213-i1)")
    parser.add_argument("--title", help="Event title (e.g. Interrogación 1)")
    parser.add_argument("--type", help="Event type (interrogacion, examen, tarea, proyecto, laboratorio)")
    parser.add_argument("--date", help="ISO-8601 date string (e.g. 2026-09-03T17:30:00-04:00)")
    parser.add_argument("--location", help="Event location (e.g. Sala AE102)")
    parser.add_argument("--details", help="Additional details/notes")
    parser.add_argument("--source", help="Data source (syllabus, announcement, canvas_assignment)")

    args = parser.parse_args()

    if args.command == "upsert-event":
        if not args.course or not args.title or not args.date:
            print("❌ Error: --course, --title, and --date are required for upsert-event")
            return
        upsert_event(
            course_code=args.course,
            title=args.title,
            date=args.date,
            event_type=args.type or "general",
            event_id=args.event_id,
            location=args.location,
            details=args.details,
            source=args.source or "agent"
        )
    elif args.command == "list-events":
        list_events(course_code=args.course, event_type=args.type)
    elif args.command == "remove-event":
        if not args.event_id:
            print("❌ Error: --event-id is required for remove-event")
            return
        remove_event(args.event_id)

if __name__ == "__main__":
    main()
