import os
import re
import json
import httpx
import asyncio
import argparse
from pathlib import Path
from dotenv import load_dotenv
from fetch_announcements import html_to_markdown, clean_filename, fetch_courses

# Setup paths relative to this script
AGENTS_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = AGENTS_DIR / "workspace"

# Load environment variables
load_dotenv()
token = os.getenv("CANVAS_API_TOKEN")
api_url = os.getenv("CANVAS_API_URL", "https://cursos.canvas.uc.cl")

if not token:
    load_dotenv(AGENTS_DIR.parent / "backend" / ".env")
    token = os.getenv("CANVAS_API_TOKEN")

headers = {"Authorization": f"Bearer {token}"} if token else {}

async def get_course_id(client, course_code):
    courses = await fetch_courses(client)
    for c in courses:
        # e.g., match 'IIC2143' against 'IIC2143-1'
        if course_code.upper() in c.get("course_code", "").upper():
            return c["id"], c.get("name", c["course_code"])
    print(f"❌ Course {course_code} not found in active courses.")
    return None, None

async def list_assignments(client, course_code):
    course_id, _ = await get_course_id(client, course_code)
    if not course_id: return

    url = f"{api_url}/api/v1/courses/{course_id}/assignments"
    print(f"🔍 Searching assignments for {course_code}...")
    
    assignments = []
    # Handle pagination simply (fetch a few pages if needed)
    response = await client.get(url, params={"per_page": 50})
    response.raise_for_status()
    assignments.extend(response.json())
    
    print(f"\n📋 Found {len(assignments)} assignments for {course_code}:")
    for a in assignments:
        due = a.get("due_at", "No due date")
        print(f" - [{a['id']}] {a['name']} (Due: {due})")

async def setup_assignment(client, course_code, assignment_name):
    course_id, course_name = await get_course_id(client, course_code)
    if not course_id: return

    url = f"{api_url}/api/v1/courses/{course_id}/assignments"
    response = await client.get(url, params={"search_term": assignment_name, "per_page": 50})
    response.raise_for_status()
    results = response.json()
    
    if not results:
        print(f"❌ No assignment found matching '{assignment_name}'")
        return
        
    assignment = results[0] # Take the best match
    
    safe_name = clean_filename(assignment["name"])
    course_dir = WORKSPACE_DIR / course_code.upper()
    assign_dir = course_dir / safe_name
    assign_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Save Instructions
    instructions = html_to_markdown(assignment.get("description", ""))
    frontmatter = f"""---
title: "{assignment['name']}"
course: "{course_code.upper()}"
due_at: "{assignment.get('due_at')}"
url: "{assignment.get('html_url')}"
---

# {assignment['name']}

{instructions}
"""
    with open(assign_dir / "instructions.md", "w", encoding="utf-8") as f:
        f.write(frontmatter)
        
    # 2. Save Rubric if exists
    rubric = assignment.get("rubric", [])
    if rubric:
        with open(assign_dir / "rubric.json", "w", encoding="utf-8") as f:
            json.dump(rubric, f, indent=2, ensure_ascii=False)
            
    # 3. Save Meta
    meta = {
        "assignment_id": assignment["id"],
        "course_id": course_id,
        "name": assignment["name"],
        "points_possible": assignment.get("points_possible")
    }
    with open(assign_dir / "workspace_meta.json", "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Workspace setup complete for '{assignment['name']}' at {assign_dir}")

async def download_file(client, course_code, file_query):
    course_id, _ = await get_course_id(client, course_code)
    if not course_id: return

    url = f"{api_url}/api/v1/courses/{course_id}/files"
    response = await client.get(url, params={"search_term": file_query, "per_page": 10})
    response.raise_for_status()
    files = response.json()
    
    if not files:
        print(f"❌ No files found matching '{file_query}'")
        return
        
    target_file = files[0]
    download_url = target_file.get("url")
    filename = target_file.get("filename")
    
    if not download_url:
        print(f"❌ File found but no download URL available.")
        return
        
    course_dir = WORKSPACE_DIR / course_code.upper()
    downloads_dir = course_dir / "downloads"
    downloads_dir.mkdir(parents=True, exist_ok=True)
    
    save_path = downloads_dir / filename
    print(f"⬇️ Downloading {filename} ({target_file.get('size')} bytes)...")
    
    async with client.stream("GET", download_url) as r:
        r.raise_for_status()
        with open(save_path, "wb") as f:
            async for chunk in r.aiter_bytes():
                f.write(chunk)
                
    print(f"✅ Saved to {save_path}")

async def download_syllabus(client, course_code):
    course_id, course_name = await get_course_id(client, course_code)
    if not course_id: return
    
    course_dir = WORKSPACE_DIR / course_code.upper()
    course_dir.mkdir(parents=True, exist_ok=True)
    
    # Method 1: Get the syllabus_body property from course API
    url = f"{api_url}/api/v1/courses/{course_id}"
    response = await client.get(url, params={"include[]": "syllabus_body"})
    response.raise_for_status()
    course_data = response.json()
    
    syllabus_body = course_data.get("syllabus_body")
    if syllabus_body:
        md_syllabus = html_to_markdown(syllabus_body)
        frontmatter = f"---\ntitle: Programa del Curso\ncourse: {course_code.upper()}\n---\n\n# Programa del Curso ({course_name})\n\n"
        with open(course_dir / "programa_del_curso.md", "w", encoding="utf-8") as f:
            f.write(frontmatter + md_syllabus)
        print(f"✅ Found and saved HTML syllabus body to {course_dir / 'programa_del_curso.md'}")
    else:
        print("⚠️ No syllabus_body found on course object. Falling back to file search...")
        
    # Method 2: Also try to download any PDF/Word file named "Programa"
    file_url = f"{api_url}/api/v1/courses/{course_id}/files"
    f_response = await client.get(file_url, params={"search_term": "programa", "per_page": 5})
    files = f_response.json()
    
    for f in files:
        if "programa" in f.get("filename", "").lower():
            download_url = f.get("url")
            save_path = course_dir / f.get("filename")
            print(f"⬇️ Downloading {f.get('filename')}...")
            async with client.stream("GET", download_url) as r:
                r.raise_for_status()
                with open(save_path, "wb") as out_f:
                    async for chunk in r.aiter_bytes():
                        out_f.write(chunk)
            print(f"✅ Saved file to {save_path}")
            return
            
    if not syllabus_body and not files:
        print("❌ Could not find any syllabus body or file containing 'programa'.")

async def main():
    if not token:
        print("❌ Error: CANVAS_API_TOKEN not set!")
        return

    parser = argparse.ArgumentParser(description="Canvas UC Integrations Helper")
    parser.add_argument("command", choices=["list-assignments", "setup-assignment", "download-file", "download-syllabus"])
    parser.add_argument("--course", required=True, help="Course Code (e.g. IIC2143)")
    parser.add_argument("--assignment-name", help="Name of the assignment to setup")
    parser.add_argument("--file-name", help="Name of the file to search and download")
    
    args = parser.parse_args()
    
    async with httpx.AsyncClient(headers=headers, follow_redirects=True) as client:
        if args.command == "list-assignments":
            await list_assignments(client, args.course)
        elif args.command == "setup-assignment":
            if not args.assignment_name:
                print("❌ Error: --assignment-name is required for setup-assignment")
                return
            await setup_assignment(client, args.course, args.assignment_name)
        elif args.command == "download-file":
            if not args.file_name:
                print("❌ Error: --file-name is required for download-file")
                return
            await download_file(client, args.course, args.file_name)
        elif args.command == "download-syllabus":
            await download_syllabus(client, args.course)

if __name__ == "__main__":
    asyncio.run(main())
