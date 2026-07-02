import os
import re
import html
import json
import httpx
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Setup paths relative to this script
AGENTS_DIR = Path(__file__).resolve().parent.parent
QUEUE_FILE = AGENTS_DIR / "dummy_queue.json"
WORKSPACE_DIR = AGENTS_DIR / "workspace"

# Load environment variables
load_dotenv()
token = os.getenv("CANVAS_API_TOKEN")
api_url = os.getenv("CANVAS_API_URL", "https://cursos.canvas.uc.cl")

if not token:
    # Try loading from backend/.env
    load_dotenv(AGENTS_DIR.parent / "backend" / ".env")
    token = os.getenv("CANVAS_API_TOKEN")

# Headers for Canvas API
headers = {"Authorization": f"Bearer {token}"} if token else {}

def html_to_markdown(html_content):
    if not html_content:
        return ""
    # Decode HTML entities (e.g. &nbsp; -> space)
    text = html.unescape(html_content)
    
    # Replace links: <a href="URL">TEXT</a> -> [TEXT](URL)
    text = re.sub(r'<a\s+[^>]*href=["\']([^"\']*)["\'][^>]*>(.*?)</a>', r'[\2](\1)', text, flags=re.IGNORECASE | re.DOTALL)
    
    # Replace headers: <hX>Text</hX> -> # Text
    text = re.sub(r'<h[1-6][^>]*>(.*?)</h[1-6]>', r'\n\n# \1\n\n', text, flags=re.IGNORECASE)
    
    # Replace list items: <li>Text</li> -> * Text
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'\n* \1', text, flags=re.IGNORECASE)
    
    # Replace bold: <strong>Text</strong> or <b>Text</b> -> **Text**
    text = re.sub(r'<(?:strong|b)[^>]*>(.*?)</(?:strong|b)>', r'**\1**', text, flags=re.IGNORECASE)
    
    # Replace italics: <em>Text</em> or <i>Text</i> -> *Text*
    text = re.sub(r'<(?:em|i)[^>]*>(.*?)</(?:em|i)>', r'*\1*', text, flags=re.IGNORECASE)
    
    # Replace paragraph endings and breaks
    text = re.sub(r'</p>', r'\n\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<br\s*/?>', r'\n', text, flags=re.IGNORECASE)
    
    # Strip remaining HTML tags
    text = re.sub(r'<[^>]+?>', '', text)
    
    # Collapse multiple blank lines
    text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)
    
    return text.strip()

def clean_filename(title):
    # Keep only alphanumeric characters, spaces, hyphens, and underscores
    clean = re.sub(r'[^\w\s-]', '', title)
    # Replace spaces and hyphens with underscores
    clean = re.sub(r'[-\s]+', '_', clean)
    return clean.lower()

def load_queue():
    if not QUEUE_FILE.exists():
        return []
    try:
        with open(QUEUE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_queue(queue):
    with open(QUEUE_FILE, "w", encoding="utf-8") as f:
        json.dump(queue, f, indent=2, ensure_ascii=False)

async def fetch_courses(client):
    url = f"{api_url}/api/v1/courses"
    print(f"[El Guardián] Querying active courses from Canvas...")
    response = await client.get(url, params={"enrollment_state": "active", "per_page": 50})
    response.raise_for_status()
    courses = response.json()
    # Filter out courses without course_code or access restrictions
    return [c for c in courses if c.get("course_code") and c.get("id")]

async def fetch_announcements(client, course_id):
    url = f"{api_url}/api/v1/courses/{course_id}/discussion_topics"
    response = await client.get(url, params={"only_announcements": True, "per_page": 20})
    response.raise_for_status()
    return response.json()

async def main():
    if not token:
        print("❌ Error: CANVAS_API_TOKEN not set in environment or .env files!")
        return

    print("==========================================================================")
    print("🚀 Running El Guardián: Canvas Announcement Ingestor")
    print("==========================================================================\n")

    queue = load_queue()
    
    async with httpx.AsyncClient(headers=headers) as client:
        try:
            courses = await fetch_courses(client)
            print(f"[El Guardián] Found {len(courses)} active courses.")
        except Exception as e:
            print(f"❌ Error fetching courses: {e}")
            return

        for course in courses:
            course_id = course["id"]
            course_code = course["course_code"]
            course_name = course.get("name", course_code)
            
            # Clean course code (e.g. MAT1630-1 -> MAT1630)
            clean_code = course_code.split("-")[0].strip()
            
            # Setup directories
            course_dir = WORKSPACE_DIR / clean_code
            announcements_dir = course_dir / "announcements"
            announcements_dir.mkdir(parents=True, exist_ok=True)
            
            # Load processed list
            processed_file = course_dir / "processed_announcements.json"
            processed_ids = []
            if processed_file.exists():
                try:
                    with open(processed_file, "r", encoding="utf-8") as f:
                        processed_ids = json.load(f)
                except json.JSONDecodeError:
                    pass
            
            try:
                announcements = await fetch_announcements(client, course_id)
            except Exception as e:
                print(f"⚠️  [El Guardián] Could not fetch announcements for {clean_code}: {e}")
                continue

            # Filter new announcements
            new_announcements = [ann for ann in announcements if str(ann["id"]) not in processed_ids]
            
            if not new_announcements:
                continue
                
            print(f"\n📢 [{clean_code}] Found {len(new_announcements)} new announcements:")
            
            # Sort chronologically (oldest first)
            new_announcements.sort(key=lambda x: x.get("posted_at") or x.get("created_at") or "")
            
            for ann in new_announcements:
                ann_id = str(ann["id"])
                title = ann.get("title", f"Announcement_{ann_id}")
                author = ann.get("author", {}).get("display_name", "Unknown Author")
                posted_at = ann.get("posted_at") or ann.get("created_at", "")
                ann_url = ann.get("html_url", "")
                
                safe_title = clean_filename(title)
                file_path = announcements_dir / f"{safe_title}.md"
                relative_path = f"agents/workspace/{clean_code}/announcements/{safe_title}.md"
                
                # Convert HTML to clean markdown
                clean_body = html_to_markdown(ann.get("message", ""))
                
                # Format frontmatter
                frontmatter = f"""---
title: "{title}"
course_code: "{clean_code}"
course_name: "{course_name}"
author: "{author}"
posted_at: "{posted_at}"
url: "{ann_url}"
---

# {title}

{clean_body}
"""
                # Save markdown file
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(frontmatter)
                
                print(f"  └─ Saved: {relative_path}")
                
                # Check if task already exists in queue by checking dynamic properties or duplicate detection
                if not any(t.get("id") == ann_id for t in queue):
                    # Add to queue
                    new_task = {
                        "id": ann_id,
                        "course_code": clean_code,
                        "course_name": course_name,
                        "task_type": "evaluate_announcement",
                        "title": title,
                        "announcement_path": relative_path,
                        "prompt": f"Evaluate the new announcement saved at {relative_path}. Determine if it introduces a new task or updates an existing one.",
                        "status": "pending"
                    }
                    queue.append(new_task)
                
                # Mark as processed
                processed_ids.append(ann_id)

            # Save processed announcements file
            with open(processed_file, "w", encoding="utf-8") as f:
                json.dump(processed_ids, f, indent=2)

        save_queue(queue)
        print("\n==========================================================================")
        print("✅ El Guardián run complete! Queue updated.")
        print("==========================================================================\n")

if __name__ == "__main__":
    asyncio.run(main())
