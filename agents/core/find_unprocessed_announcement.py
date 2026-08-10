import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv(dotenv_path="backend/.env")
CANVAS_URL = os.getenv("CANVAS_API_URL", "https://cursos.canvas.uc.cl")
CANVAS_TOKEN = os.getenv("CANVAS_API_TOKEN")

headers = {"Authorization": f"Bearer {CANVAS_TOKEN}"}

def main():
    with httpx.Client(timeout=30.0) as client:
        res = client.get(f"{CANVAS_URL}/api/v1/courses?enrollment_state=active&per_page=50", headers=headers)
        if res.status_code != 200:
            print(f"❌ Canvas API Error: {res.status_code}")
            return

        courses = res.json()
        iic_course = next((c for c in courses if "IIC2143" in c.get("course_code", "") or "IIC2143" in c.get("name", "")), None)
        if not iic_course:
            print("❌ Course IIC2143 not found!")
            return

        course_id = iic_course["id"]
        ann_res = client.get(f"{CANVAS_URL}/api/v1/courses/{course_id}/discussion_topics?only_announcements=true&per_page=100", headers=headers)
        if ann_res.status_code != 200:
            print(f"❌ Canvas Announcements API Error: {ann_res.status_code}")
            return

        announcements = ann_res.json()
        announcements_sorted = sorted(announcements, key=lambda a: a.get("posted_at") or a.get("created_at") or "")

        state_file = "agents/workspace/IIC2143/state.json"
        last_idx = -1
        if os.path.exists(state_file):
            with open(state_file, "r", encoding="utf-8") as f:
                state = json.load(f)
                last_idx = state.get("last_processed_index", -1)

        next_idx = last_idx + 1
        if next_idx >= len(announcements_sorted):
            print(f"✅ All {len(announcements_sorted)} announcements are already marked!")
        else:
            ann = announcements_sorted[next_idx]
            author_name = ann.get("author", {}).get("display_name", "Unknown")
            message_preview = ann.get("message", "")[:200]
            print(f"📌 Total announcements found: {len(announcements_sorted)}")
            print(f"📌 Last processed index: {last_idx}")
            print(f"\n📢 Oldest UNMARKED Announcement (Index #{next_idx + 1}):")
            print(f" - ID: {ann.get('id')}")
            print(f" - Title: {ann.get('title')}")
            print(f" - Posted At: {ann.get('posted_at')}")
            print(f" - Author: {author_name}")
            print(f" - Message Preview:\n{message_preview}...")

if __name__ == "__main__":
    main()
