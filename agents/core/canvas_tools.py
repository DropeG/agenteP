import os
import sys
import re
import json
import httpx
import asyncio
import argparse
from pathlib import Path
# Setup paths relative to this script
AGENTS_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_DIR = AGENTS_DIR / "workspace"
sys.path.insert(0, str(Path(__file__).resolve().parent))

from dotenv import load_dotenv

# Load environment variables
load_dotenv()
token = os.getenv("CANVAS_API_TOKEN")
api_url = os.getenv("CANVAS_API_URL", "https://cursos.canvas.uc.cl")

if not token:
    load_dotenv(AGENTS_DIR.parent / "backend" / ".env")
    token = os.getenv("CANVAS_API_TOKEN")

headers = {"Authorization": f"Bearer {token}"} if token else {}

def clean_filename(name):
    return re.sub(r'[\\/*?:"<>|]', "_", name).strip()

def html_to_markdown(html_str):
    if not html_str:
        return ""
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html_str, "html.parser")
        return soup.get_text("\n\n").strip()
    except Exception:
        clean = re.sub(r'<br\s*/?>', '\n', html_str, flags=re.IGNORECASE)
        clean = re.sub(r'<p[^>]*>', '\n\n', clean, flags=re.IGNORECASE)
        clean = re.sub(r'<[^>]+>', '', clean)
        return clean.strip()

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
        print(f"⚠️ Could not list active courses automatically ({e}).")
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

def extract_pdf_text(pdf_path, txt_path):
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        text_pages = []
        for i, page in enumerate(reader.pages):
            text_pages.append(f"--- Slide {i+1} ---\n" + (page.extract_text() or ""))
        full_text = "\n\n".join(text_pages)
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(full_text)
        return True
    except Exception as e:
        print(f"❌ Error extracting text from {pdf_path}: {e}")
        return False

async def sync_materials(client, course_code):
    course_id, course_name = await get_course_id(client, course_code)
    if not course_id: return

    # Setup directories
    clases_dir = WORKSPACE_DIR / course_code.upper() / "clases"
    raw_dir = clases_dir / "raw"
    parsed_text_dir = clases_dir / "parsed_text"
    summaries_dir = clases_dir / "summaries"
    
    raw_dir.mkdir(parents=True, exist_ok=True)
    parsed_text_dir.mkdir(parents=True, exist_ok=True)
    summaries_dir.mkdir(parents=True, exist_ok=True)

    # 1. Fetch folders inside the course
    url = f"{api_url}/api/v1/courses/{course_id}/folders"
    response = await client.get(url, params={"per_page": 50})
    response.raise_for_status()
    folders = response.json()
    
    # Filter folders that match our criteria
    target_names = ["clase", "lectur", "diapositiva", "slide", "presentacion", "transparencia"]
    matching_folders = []
    for f in folders:
        name = f.get("name", "").lower()
        if any(term in name for term in target_names):
            matching_folders.append(f)
            
    if not matching_folders:
        print(f"⚠️ No lecture folders found matching slide terms in course {course_code}.")
        return
        
    print(f"📁 Found {len(matching_folders)} matching folder(s): {[f['name'] for f in matching_folders]}")

    from fetch_announcements import load_queue, save_queue
    queue = load_queue()

    for folder in matching_folders:
        folder_id = folder["id"]
        files_url = f"{api_url}/api/v1/folders/{folder_id}/files"
        f_response = await client.get(files_url, params={"per_page": 50})
        f_response.raise_for_status()
        files = f_response.json()
        
        # We only care about PDF or PowerPoint files
        valid_extensions = [".pdf", ".ppt", ".pptx"]
        target_files = [f for f in files if any(f.get("filename", "").lower().endswith(ext) for ext in valid_extensions)]
        
        if not target_files:
            continue
            
        print(f"🔍 Folder '{folder['name']}' has {len(target_files)} material files:")
        for tf in target_files:
            filename = tf.get("filename")
            file_id = str(tf.get("id"))
            download_url = tf.get("url")
            
            raw_path = raw_dir / filename
            txt_path = parsed_text_dir / f"{filename}.txt"
            
            # Download file if it doesn't exist
            if not raw_path.exists():
                print(f"  └─ ⬇️ Downloading new material: {filename}...")
                async with client.stream("GET", download_url) as r:
                    r.raise_for_status()
                    with open(raw_path, "wb") as f_out:
                        async for chunk in r.aiter_bytes():
                            f_out.write(chunk)
                print(f"  └─ ✅ Saved: {raw_path}")
            
            # Extract PDF text if it is a PDF and text file doesn't exist
            if filename.lower().endswith(".pdf") and not txt_path.exists():
                print(f"  └─ ⚙️ Extracting PDF text to txt file...")
                success = extract_pdf_text(raw_path, txt_path)
                if success:
                    print(f"  └─ ✅ Saved: {txt_path}")
            
            # Add summarize task to the queue if not already present
            task_id = f"file_{file_id}"
            if not any(t.get("id") == task_id for t in queue):
                clean_name = filename.rsplit('.', 1)[0]
                new_task = {
                    "id": task_id,
                    "course_code": course_code.upper(),
                    "course_name": course_name,
                    "task_type": "summarize_material",
                    "title": f"Summarize {filename}",
                    "raw_path": f"agents/workspace/{course_code.upper()}/clases/raw/{filename}",
                    "text_path": f"agents/workspace/{course_code.upper()}/clases/parsed_text/{filename}.txt",
                    "summary_path": f"agents/workspace/{course_code.upper()}/clases/summaries/{clean_name}.md",
                    "prompt": f"Summarize the slide text at agents/workspace/{course_code.upper()}/clases/parsed_text/{filename}.txt. Follow the study_summarizer skill format guidelines.",
                    "status": "pending"
                }
                queue.append(new_task)
                print(f"  └─ ➕ Queued task: 'Summarize {filename}'")

    save_queue(queue)
    print("\n==========================================================================")
    print("✅ Sync and Text Extraction Complete!")
    print("==========================================================================\n")

async def get_course_info(client, course_code):
    course_id, course_name = await get_course_id(client, course_code)
    if not course_id:
        print(json.dumps({"error": f"Course {course_code} not found"}))
        return

    url = f"{api_url}/api/v1/courses/{course_id}"
    try:
        response = await client.get(url, params={"include[]": "syllabus_body"})
        response.raise_for_status()
        course_data = response.json()

        result = {
            "course_id": course_id,
            "course_name": course_name,
            "course_code": course_code.upper(),
            "syllabus_body": course_data.get("syllabus_body")
        }
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except httpx.HTTPStatusError as e:
        print(json.dumps({"error": f"Canvas API HTTP Error {e.response.status_code}: {e.response.text}"}))
    except Exception as e:
        print(json.dumps({"error": f"Failed to get course info: {str(e)}"}))

async def list_files(client, course_code):
    course_id, _ = await get_course_id(client, course_code)
    if not course_id:
        print(json.dumps({"error": f"Course {course_code} not found"}))
        return

    url = f"{api_url}/api/v1/courses/{course_id}/files"
    try:
        response = await client.get(url, params={"per_page": 100})
        response.raise_for_status()
        raw_files = response.json()

        files = [
            {
                "id": f.get("id"),
                "filename": f.get("filename"),
                "display_name": f.get("display_name"),
                "size": f.get("size"),
                "updated_at": f.get("updated_at"),
                "url": f.get("url"),
                "folder_id": f.get("folder_id")
            }
            for f in raw_files
        ]
        print(json.dumps(files, indent=2, ensure_ascii=False))
    except httpx.HTTPStatusError as e:
        print(json.dumps({"error": f"Canvas API HTTP Error {e.response.status_code}: {e.response.text}"}))
    except Exception as e:
        print(json.dumps({"error": f"Failed to list files: {str(e)}"}))

async def list_modules(client, course_code):
    course_id, _ = await get_course_id(client, course_code)
    if not course_id:
        print(json.dumps({"error": f"Course {course_code} not found"}))
        return

    url = f"{api_url}/api/v1/courses/{course_id}/modules"
    try:
        response = await client.get(url, params={"include[]": "items", "per_page": 50})
        response.raise_for_status()
        raw_modules = response.json()

        modules = []
        for m in raw_modules:
            items = [
                {
                    "id": item.get("id"),
                    "title": item.get("title"),
                    "type": item.get("type"),
                    "content_id": item.get("content_id"),
                    "url": item.get("url")
                }
                for item in m.get("items", [])
            ]
            modules.append({
                "id": m.get("id"),
                "name": m.get("name"),
                "items": items
            })
        print(json.dumps(modules, indent=2, ensure_ascii=False))
    except httpx.HTTPStatusError as e:
        print(json.dumps({"error": f"Canvas API HTTP Error {e.response.status_code}: {e.response.text}"}))
    except Exception as e:
        print(json.dumps({"error": f"Failed to list modules: {str(e)}"}))

async def download_file_by_id(client, file_id, dest):
    url = f"{api_url}/api/v1/files/{file_id}"
    try:
        response = await client.get(url)
        response.raise_for_status()
        file_info = response.json()

        download_url = file_info.get("url")
        if not download_url:
            print(json.dumps({"error": f"No download URL found for file ID {file_id}"}))
            return

        dest_path = Path(dest)
        dest_path.parent.mkdir(parents=True, exist_ok=True)

        async with client.stream("GET", download_url) as r:
            r.raise_for_status()
            with open(dest_path, "wb") as f:
                async for chunk in r.aiter_bytes():
                    f.write(chunk)

        result = {
            "status": "success",
            "file_id": file_id,
            "filename": file_info.get("filename"),
            "size": file_info.get("size"),
            "saved_to": str(dest_path)
        }
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except httpx.HTTPStatusError as e:
        print(json.dumps({"error": f"Canvas API HTTP Error {e.response.status_code}: {e.response.text}"}))
    except Exception as e:
        print(json.dumps({"error": f"Failed to download file: {str(e)}"}))

async def main():
    if not token:
        print("❌ Error: CANVAS_API_TOKEN not set!")
        return

    parser = argparse.ArgumentParser(description="Canvas UC Integrations Helper")
    parser.add_argument("command", choices=[
        "get-course-info",
        "list-files",
        "list-modules",
        "download-file-by-id",
        "list-assignments",
        "setup-assignment",
        "download-file",
        "download-syllabus",
        "sync-materials"
    ])
    parser.add_argument("--course", help="Course Code (e.g. IIC2143)")
    parser.add_argument("--assignment-name", help="Name of the assignment to setup")
    parser.add_argument("--file-name", help="Name of the file to search and download")
    parser.add_argument("--file-id", help="Canvas File ID to download")
    parser.add_argument("--dest", help="Destination file path for download-file-by-id")
    
    args = parser.parse_args()
    
    async with httpx.AsyncClient(headers=headers, follow_redirects=True, timeout=60.0) as client:
        if args.command == "get-course-info":
            if not args.course:
                print("❌ Error: --course is required for get-course-info")
                return
            await get_course_info(client, args.course)
        elif args.command == "list-files":
            if not args.course:
                print("❌ Error: --course is required for list-files")
                return
            await list_files(client, args.course)
        elif args.command == "list-modules":
            if not args.course:
                print("❌ Error: --course is required for list-modules")
                return
            await list_modules(client, args.course)
        elif args.command == "download-file-by-id":
            if not args.file_id or not args.dest:
                print("❌ Error: --file-id and --dest are required for download-file-by-id")
                return
            await download_file_by_id(client, args.file_id, args.dest)
        elif args.command == "list-assignments":
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
        elif args.command == "sync-materials":
            await sync_materials(client, args.course)

if __name__ == "__main__":
    asyncio.run(main())

