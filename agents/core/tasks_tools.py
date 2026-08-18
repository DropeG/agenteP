import os
import sys
import json
import httpx
import asyncio
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Setup paths relative to this script
AGENTS_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = AGENTS_DIR / "workspace"
sys.path.insert(0, str(Path(__file__).resolve().parent))

# Load environment variables
load_dotenv()
token = os.getenv("CANVAS_API_TOKEN")
api_url = os.getenv("CANVAS_API_URL", "https://cursos.canvas.uc.cl")

if not token:
    load_dotenv(AGENTS_DIR.parent / "backend" / ".env")
    token = os.getenv("CANVAS_API_TOKEN")

headers = {"Authorization": f"Bearer {token}"} if token else {}

async def fetch_courses(client):
    try:
        url = f"{api_url}/api/v1/users/self/courses"
        response = await client.get(url, params={"per_page": 50})
        response.raise_for_status()
        return response.json()
    except Exception:
        url = f"{api_url}/api/v1/courses"
        response = await client.get(url, params={"per_page": 50})
        response.raise_for_status()
        return response.json()

async def get_course_id(client, course_code):
    if str(course_code).isdigit():
        return int(course_code), str(course_code)
    try:
        courses = await fetch_courses(client)
        for c in courses:
            if course_code.upper() in c.get("course_code", "").upper():
                return c["id"], c.get("name", c["course_code"])
    except Exception as e:
        print(f"⚠️ Could not list active courses ({e}).", file=sys.stderr)
    return None, None

async def list_raw_assignments(course_code):
    async with httpx.AsyncClient(headers=headers, timeout=30.0) as client:
        course_id, course_name = await get_course_id(client, course_code)
        if not course_id:
            print(f"❌ Course {course_code} not found in Canvas.", file=sys.stderr)
            return []

        url = f"{api_url}/api/v1/courses/{course_id}/assignments"
        assignments = []
        page = 1
        while True:
            response = await client.get(url, params={"per_page": 50, "page": page})
            response.raise_for_status()
            batch = response.json()
            if not batch:
                break
            assignments.extend(batch)
            if len(batch) < 50:
                break
            page += 1

        cleaned = []
        for a in assignments:
            cleaned.append({
                "id": a.get("id"),
                "name": a.get("name"),
                "description": a.get("description"),
                "due_at": a.get("due_at"),
                "unlock_at": a.get("unlock_at"),
                "lock_at": a.get("lock_at"),
                "points_possible": a.get("points_possible"),
                "has_submitted_submissions": a.get("has_submitted_submissions", False),
                "submission_types": a.get("submission_types", []),
                "assignment_group_id": a.get("assignment_group_id"),
                "html_url": a.get("html_url")
            })
        return cleaned

def save_course_tasks(course_code, tasks_data):
    course_dir = WORKSPACE_DIR / course_code.upper()
    course_dir.mkdir(parents=True, exist_ok=True)
    tasks_file = course_dir / "tasks.json"
    with open(tasks_file, "w", encoding="utf-8") as f:
        json.dump(tasks_data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved {len(tasks_data)} tasks to {tasks_file}")

def get_course_tasks(course_code):
    tasks_file = WORKSPACE_DIR / course_code.upper() / "tasks.json"
    if not tasks_file.exists():
        return []
    with open(tasks_file, "r", encoding="utf-8") as f:
        return json.load(f)

def merge_course_tasks(course_code, new_tasks_list):
    course_dir = WORKSPACE_DIR / course_code.upper()
    course_dir.mkdir(parents=True, exist_ok=True)
    tasks_file = course_dir / "tasks.json"

    existing_tasks = []
    if tasks_file.exists():
        try:
            with open(tasks_file, "r", encoding="utf-8") as f:
                existing_tasks = json.load(f)
        except Exception:
            existing_tasks = []

    # Map existing by ID and external_id
    existing_map = {}
    for t in existing_tasks:
        tid = t.get("id")
        ext_id = str(t.get("source", {}).get("external_id", ""))
        if tid:
            existing_map[tid] = t
        if ext_id:
            existing_map[f"ext:{ext_id}"] = t

    added_count = 0
    updated_count = 0
    unchanged_count = 0
    final_tasks = []

    seen_ids = set()

    for n_task in new_tasks_list:
        tid = n_task.get("id")
        ext_id = str(n_task.get("source", {}).get("external_id", ""))
        
        match = existing_map.get(tid) or (existing_map.get(f"ext:{ext_id}") if ext_id else None)

        if match:
            # Check if updated
            has_diff = (
                match.get("status") != n_task.get("status") or
                match.get("dates") != n_task.get("dates") or
                match.get("points") != n_task.get("points") or
                match.get("title") != n_task.get("title") or
                match.get("category") != n_task.get("category")
            )
            merged = {**match, **n_task}
            if has_diff:
                updated_count += 1
            else:
                unchanged_count += 1
            final_tasks.append(merged)
            seen_ids.add(merged.get("id"))
        else:
            added_count += 1
            final_tasks.append(n_task)
            seen_ids.add(n_task.get("id"))

    # Also keep any pre-existing tasks that weren't in new_tasks (e.g. manual tasks or other sources)
    for e_task in existing_tasks:
        if e_task.get("id") not in seen_ids:
            final_tasks.append(e_task)
            seen_ids.add(e_task.get("id"))

    with open(tasks_file, "w", encoding="utf-8") as f:
        json.dump(final_tasks, f, indent=2, ensure_ascii=False)

    print(json.dumps({
        "status": "success",
        "course_code": course_code.upper(),
        "total_tasks": len(final_tasks),
        "added": added_count,
        "updated": updated_count,
        "unchanged": unchanged_count
    }, indent=2, ensure_ascii=False))

def list_workspace_courses():
    if not WORKSPACE_DIR.exists():
        return []
    courses = []
    for p in WORKSPACE_DIR.iterdir():
        if p.is_dir() and (p / "course_profile.json").exists():
            courses.append(p.name.upper())
    courses.sort()
    return courses

def main():
    parser = argparse.ArgumentParser(description="Deterministic Tasks I/O Tools for Agente P")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # list-workspace-courses
    subparsers.add_parser("list-workspace-courses", help="List all course codes present in workspace")

    # list-raw-assignments
    p_raw = subparsers.add_parser("list-raw-assignments", help="Fetch raw assignments from Canvas API")
    p_raw.add_argument("--course", required=True, help="Course code or numeric ID")

    # save-course-tasks
    p_save = subparsers.add_parser("save-course-tasks", help="Save canonical tasks array to workspace")
    p_save.add_argument("--course", required=True, help="Course code")
    p_save.add_argument("--data", help="JSON string containing tasks array")
    p_save.add_argument("--file", help="Path to JSON file containing tasks array")

    # merge-course-tasks (idempotent upsert)
    p_merge = subparsers.add_parser("merge-course-tasks", help="Idempotently merge tasks array with existing tasks.json")
    p_merge.add_argument("--course", required=True, help="Course code")
    p_merge.add_argument("--data", help="JSON string containing tasks array")
    p_merge.add_argument("--file", help="Path to JSON file containing tasks array")

    # get-course-tasks
    p_get = subparsers.add_parser("get-course-tasks", help="Get canonical tasks from workspace")
    p_get.add_argument("--course", required=True, help="Course code")

    args = parser.parse_args()

    if args.command == "list-workspace-courses":
        courses = list_workspace_courses()
        print(json.dumps(courses, indent=2))

    elif args.command == "list-raw-assignments":
        results = asyncio.run(list_raw_assignments(args.course))
        print(json.dumps(results, indent=2, ensure_ascii=False))

    elif args.command == "save-course-tasks":
        if args.file:
            with open(args.file, "r", encoding="utf-8") as f:
                tasks_data = json.load(f)
        elif args.data:
            tasks_data = json.loads(args.data)
        else:
            print("❌ Must provide either --data or --file", file=sys.stderr)
            sys.exit(1)
        save_course_tasks(args.course, tasks_data)

    elif args.command == "merge-course-tasks":
        if args.file:
            with open(args.file, "r", encoding="utf-8") as f:
                tasks_data = json.load(f)
        elif args.data:
            tasks_data = json.loads(args.data)
        else:
            print("❌ Must provide either --data or --file", file=sys.stderr)
            sys.exit(1)
        merge_course_tasks(args.course, tasks_data)

    elif args.command == "get-course-tasks":
        tasks = get_course_tasks(args.course)
        print(json.dumps(tasks, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()

