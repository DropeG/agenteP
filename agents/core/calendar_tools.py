import sys
import os
import json
import argparse
import unicodedata
import re
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

def parse_iso_datetime(d_str):
    if not d_str:
        return None
    try:
        dt = datetime.fromisoformat(str(d_str).replace("Z", "+00:00"))
        if dt.tzinfo is not None:
            dt = dt.replace(tzinfo=None)
        return dt
    except Exception:
        return None

def save_calendar(events):
    WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)
    # Sort events by date
    def parse_event_date(evt):
        d_str = evt.get("date") or evt.get("start_at") or ""
        dt = parse_iso_datetime(d_str)
        return dt if dt is not None else datetime.max

    events.sort(key=parse_event_date)
    with open(CALENDAR_FILE, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2, ensure_ascii=False)

def slugify(text):
    if not text:
        return ""
    normalized = unicodedata.normalize('NFKD', str(text))
    ascii_text = normalized.encode('ascii', 'ignore').decode('utf-8')
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', ascii_text.lower()).strip('-')
    return slug

def normalize_event_type(t_str):
    if not t_str:
        return "general"
    slug = slugify(t_str)
    if "interrogac" in slug:
        return "interrogacion"
    if "examen" in slug:
        return "examen"
    if "tarea" in slug:
        return "tarea"
    if "control" in slug:
        return "control"
    if "actividad" in slug:
        return "actividad"
    if "laboratorio" in slug:
        return "laboratorio"
    if "proyecto" in slug:
        return "proyecto"
    return slug

def are_events_semantically_equivalent(evt1, evt2):
    # Same course check
    c1 = (evt1.get("course_code") or "").upper()
    c2 = (evt2.get("course_code") or "").upper()
    if not c1 or not c2 or c1 != c2:
        return False

    # Check IDs
    id1 = slugify(evt1.get("id", ""))
    id2 = slugify(evt2.get("id", ""))
    if id1 and id2 and id1 == id2:
        return True

    # Check dates
    d1 = parse_iso_datetime(evt1.get("date") or evt1.get("start_at"))
    d2 = parse_iso_datetime(evt2.get("date") or evt2.get("start_at"))
    if d1 and d2:
        # Same calendar day
        if (d1.year, d1.month, d1.day) == (d2.year, d2.month, d2.day):
            s1 = slugify(evt1.get("title", ""))
            s2 = slugify(evt2.get("title", ""))
            # Substring matching (e.g. ac01 in ac01-algoritmo-panadero or t1 vs tarea-1)
            if s1 and s2 and (s1 in s2 or s2 in s1):
                return True
            # Same evaluation type and same time
            t1 = normalize_event_type(evt1.get("type"))
            t2 = normalize_event_type(evt2.get("type"))
            if t1 == t2 and abs((d1 - d2).total_seconds()) <= 7200: # Within 2 hours
                return True

    return False

def upsert_event(course_code, title, date, event_type="general", event_id=None, location=None, details=None, source="agent"):
    events = load_calendar()
    course_code = course_code.upper()

    if not event_id:
        slug_title = slugify(title)
        event_id = f"{course_code.lower()}-{slug_title}"
    else:
        event_id = slugify(event_id)

    norm_type = normalize_event_type(event_type)
    now_iso = datetime.now().isoformat()

    incoming_event = {
        "id": event_id,
        "course_code": course_code,
        "title": title,
        "type": norm_type,
        "date": date,
        "start_at": date,
        "location": location,
        "details": details,
        "source": source,
        "last_updated": now_iso
    }

    # Two-tier matching:
    # 1. Exact canonical ID match
    # 2. Semantic equivalence (same course + date + type/title)
    existing_index = None
    for idx, evt in enumerate(events):
        if slugify(evt.get("id", "")) == event_id:
            existing_index = idx
            break

    if existing_index is None:
        for idx, evt in enumerate(events):
            if are_events_semantically_equivalent(evt, incoming_event):
                existing_index = idx
                break

    if existing_index is not None:
        existing = events[existing_index]
        # Preserve existing richer metadata if incoming has None
        merged_location = location if location is not None else existing.get("location")
        merged_details = details if details is not None else existing.get("details")
        
        events[existing_index].update({
            "id": event_id,
            "course_code": course_code,
            "title": title,
            "type": norm_type,
            "date": date,
            "start_at": date,
            "location": merged_location,
            "details": merged_details,
            "source": source,
            "last_updated": now_iso
        })
        action = "updated"
    else:
        events.append(incoming_event)
        action = "created"

    save_calendar(events)
    result = {
        "status": "success",
        "action": action,
        "event": incoming_event,
        "total_calendar_events": len(events)
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))

def deduplicate_calendar():
    events = load_calendar()
    unique_events = []

    for evt in events:
        matched_idx = None
        for u_idx, u_evt in enumerate(unique_events):
            if are_events_semantically_equivalent(evt, u_evt):
                matched_idx = u_idx
                break

        if matched_idx is None:
            # Canonicalize ID and type
            evt["id"] = slugify(evt.get("id", ""))
            evt["type"] = normalize_event_type(evt.get("type", ""))
            unique_events.append(evt)
        else:
            # Merge into existing unique event, keeping richest metadata
            existing = unique_events[matched_idx]
            # If current has better details/location, use them
            if not existing.get("location") and evt.get("location"):
                existing["location"] = evt.get("location")
            if not existing.get("details") and evt.get("details"):
                existing["details"] = evt.get("details")
            # If current has a more detailed title, use it
            if len(evt.get("title", "")) > len(existing.get("title", "")):
                existing["title"] = evt.get("title")
            # Update last_updated
            existing["last_updated"] = datetime.now().isoformat()

    save_calendar(unique_events)
    result = {
        "status": "success",
        "original_count": len(events),
        "cleaned_count": len(unique_events),
        "removed_duplicates": len(events) - len(unique_events)
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))

def list_events(course_code=None, event_type=None):
    events = load_calendar()
    if course_code:
        events = [e for e in events if e.get("course_code", "").upper() == course_code.upper()]
    if event_type:
        events = [e for e in events if normalize_event_type(e.get("type", "")) == normalize_event_type(event_type)]
    print(json.dumps(events, indent=2, ensure_ascii=False))

def remove_event(event_id):
    events = load_calendar()
    initial_len = len(events)
    target_slug = slugify(event_id)
    events = [e for e in events if slugify(e.get("id", "")) != target_slug]
    if len(events) < initial_len:
        save_calendar(events)
        print(json.dumps({"status": "success", "removed_id": event_id}))
    else:
        print(json.dumps({"error": f"Event {event_id} not found"}))

def main():
    parser = argparse.ArgumentParser(description="AgenteP Master Calendar Tool")
    parser.add_argument("command", choices=["upsert-event", "list-events", "remove-event", "deduplicate-calendar"])
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
    elif args.command == "deduplicate-calendar":
        deduplicate_calendar()

if __name__ == "__main__":
    main()
