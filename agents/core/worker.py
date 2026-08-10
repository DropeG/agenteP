import os
import re
import json
import httpx
from pypdf import PdfReader
from dotenv import load_dotenv
from agents.core.supabase_client import supabase

load_dotenv(dotenv_path="backend/.env")

CANVAS_URL = os.getenv("CANVAS_API_URL", "https://cursos.canvas.uc.cl")
CANVAS_TOKEN = os.getenv("CANVAS_API_TOKEN")

def download_canvas_file(file_api_url, save_dir):
    """Downloads a file asset from Canvas API using authorization token."""
    headers = {"Authorization": f"Bearer {CANVAS_TOKEN}"}
    os.makedirs(save_dir, exist_ok=True)
    
    with httpx.Client(timeout=60.0, follow_redirects=True) as client:
        # 1. Get file metadata (download URL & display name)
        meta_res = client.get(file_api_url, headers=headers)
        if meta_res.status_code != 200:
            print(f"❌ Error fetching file metadata from {file_api_url}: {meta_res.status_code}")
            return None, None

        file_info = meta_res.json()
        filename = file_info.get("filename") or file_info.get("display_name") or "canvas_file.pdf"
        download_url = file_info.get("url")

        if not download_url:
            print("❌ Download URL not found in metadata.")
            return None, None

        # 2. Download raw file content
        file_res = client.get(download_url, headers=headers)
        local_path = os.path.join(save_dir, filename)

        with open(local_path, "wb") as f:
            f.write(file_res.content)

        print(f"  └─ 📥 Downloaded Canvas Asset: {local_path} ({len(file_res.content)} bytes)")
        return local_path, filename

def parse_pdf_text(pdf_path):
    """Extracts raw text content from a PDF file using pypdf."""
    try:
        reader = PdfReader(pdf_path)
        text_content = []
        for i, page in enumerate(reader.pages):
            text_content.append(f"--- Página {i+1} ---\n" + (page.extract_text() or ""))
        return "\n\n".join(text_content)
    except Exception as e:
        print(f"⚠️ PDF Text Extraction error: {e}")
        return ""

def process_pending_tasks():
    print("==========================================================================")
    print("⚙️ [El Auxiliar / Worker Daemon] Processing Pending Tasks")
    print("==========================================================================\n")

    # Fetch pending tasks
    task_res = supabase.table("tasks").select("*").eq("status", "pending").order("id", desc=False).execute()
    pending_tasks = task_res.data or []

    if not pending_tasks:
        print("ℹ️ No pending tasks found in queue.")
        return

    headers = {"Authorization": f"Bearer {CANVAS_TOKEN}"}

    for task in pending_tasks:
        tid = task["id"]
        sigla = task["course_code"]
        prompt = task["prompt"]
        print(f"Processing Task #{tid} ({task['task_type']}) for {sigla}...")

        # Extract source announcement path from prompt
        match = re.search(r"saved at (agents/workspace/[^\s]+\.md)", prompt)
        if not match:
            print(f"⚠️ Could not find announcement file path in task #{tid}")
            continue

        ann_path = match.group(1)
        if not os.path.exists(ann_path):
            print(f"⚠️ File not found: {ann_path}")
            continue

        with open(ann_path, "r", encoding="utf-8") as f:
            ann_text = f.read()

        # 1. Detect Canvas file API endpoints in HTML text
        file_api_matches = re.findall(r'data-api-endpoint="(https://cursos\.canvas\.uc\.cl/api/v1/courses/\d+/files/\d+)"', ann_text)
        if not file_api_matches:
            file_api_matches = re.findall(r'href="(https://cursos\.canvas\.uc\.cl/api/v1/courses/\d+/files/\d+)"', ann_text)

        # 2. Detect external links (GitHub, docs, guides)
        ext_links = re.findall(r'href="(https?://(?!cursos\.canvas\.uc\.cl)[^"]+)"', ann_text)
        resource_urls = [link[0] for link in ext_links]

        # Determine task directory (e.g. Tarea 1 -> agents/workspace/IIC2143/tareas/tarea_1/)
        text_lower = ann_text.lower()
        if "tarea" in text_lower:
            task_num_match = re.search(r"tarea\s*(\d+)", text_lower)
            tnum = task_num_match.group(1) if task_num_match else "1"
            sub_dir = f"agents/workspace/{sigla}/tareas/tarea_{tnum}"
        elif "examen" in text_lower or "interrogacion" in text_lower:
            sub_dir = f"agents/workspace/{sigla}/evaluaciones/evaluacion"
        else:
            sub_dir = f"agents/workspace/{sigla}/anuncios_procesados"

        os.makedirs(sub_dir, exist_ok=True)

        downloaded_assets = []
        parsed_pdf_texts = []

        # 3. Download linked Canvas assets & parse PDFs
        for file_api_url in file_api_matches:
            local_file, filename = download_canvas_file(file_api_url, sub_dir)
            if local_file:
                downloaded_assets.append(filename)
                if filename.endswith(".pdf"):
                    pdf_text = parse_pdf_text(local_file)
                    parsed_pdf_texts.append(f"### Contenido PDF: {filename}\n\n" + pdf_text)

        # 4. Write clean organized homework folder files
        enunciado_file = os.path.join(sub_dir, "enunciado.md")
        with open(enunciado_file, "w", encoding="utf-8") as f:
            f.write(f"# Enunciado & Recursos Procesados\n\n")
            f.write(f"**Origen:** {ann_path}\n\n")
            f.write(f"## Anuncio Original\n\n{ann_text}\n\n")
            if parsed_pdf_texts:
                f.write("## Documentos Adjuntos Extraídos\n\n" + "\n\n".join(parsed_pdf_texts) + "\n\n")

        recursos_file = os.path.join(sub_dir, "recursos.json")
        with open(recursos_file, "w", encoding="utf-8") as f:
            json.dump({
                "source_announcement": ann_path,
                "downloaded_assets": downloaded_assets,
                "external_links": resource_urls
            }, f, indent=2)

        # 5. Mark task completed in Supabase Cloud
        res_summary = {
            "status": "completed",
            "message": f"Organized assignment into {sub_dir}/",
            "downloaded_assets": downloaded_assets,
            "resources_found": len(resource_urls),
            "enunciado_path": enunciado_file
        }

        supabase.table("tasks").update({
            "status": "completed",
            "result": res_summary
        }).eq("id", tid).execute()

        supabase.table("logs").insert({
            "agent_name": "El Auxiliar",
            "message": f"Completed Task #{tid}: Downloaded {len(downloaded_assets)} asset(s) & organized {sub_dir}/",
            "course_code": sigla,
            "level": "info"
        }).execute()

        print(f"\n==========================================================================")
        print(f"✅ Completed Task #{tid} for {sigla}")
        print(f"==========================================================================")
        print(f"📌 Task Directory: {sub_dir}/")
        print(f"📌 Downloaded:     {downloaded_assets}")
        print(f"📌 External Links: {resource_urls}")
        print(f"📌 Enunciado:      {enunciado_file}")

if __name__ == "__main__":
    process_pending_tasks()
