import os
import sys
import json
import httpx
import asyncio
from datetime import datetime, timedelta
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

async def fetch_courses(client):
    url = f"{api_url}/api/v1/users/self/courses"
    params = {"enrollment_state": "active", "per_page": 50}
    response = await client.get(url, params=params)
    response.raise_for_status()
    # Filter out courses with access restricted
    courses = [c for c in response.json() if not c.get("access_restricted_by_date")]
    return courses

async def fetch_announcements(days=1):
    if not token:
        print("❌ Error: CANVAS_API_TOKEN no está configurado.")
        sys.exit(1)

    async with httpx.AsyncClient(headers=headers, timeout=30.0) as client:
        try:
            print("🔍 Buscando cursos activos...")
            courses = await fetch_courses(client)
            if not courses:
                print("⚠️ No se encontraron cursos activos.")
                sys.exit(0)
            
            context_codes = [f"course_{c['id']}" for c in courses]
            course_map = {f"course_{c['id']}": c.get("course_code", c.get("name")) for c in courses}
            
            # Fetch announcements from the last N days
            start_date = (datetime.utcnow() - timedelta(days=days)).isoformat() + "Z"
            end_date = datetime.utcnow().isoformat() + "Z"
            
            url = f"{api_url}/api/v1/announcements"
            params = {
                "context_codes[]": context_codes,
                "start_date": start_date,
                "end_date": end_date,
                "per_page": 50
            }
            
            print(f"📥 Descargando anuncios desde {start_date} ({days} días)...")
            response = await client.get(url, params=params)
            response.raise_for_status()
            announcements = response.json()
            
            # Enrich with course codes
            enriched_announcements = []
            for ann in announcements:
                context_code = ann.get("context_code")
                course_code = course_map.get(context_code, context_code)
                ann["course_code"] = course_code
                enriched_announcements.append(ann)
            
            # Save to temporary JSON
            WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)
            output_file = WORKSPACE_DIR / "daily_announcements_raw.json"
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(enriched_announcements, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Se encontraron {len(enriched_announcements)} anuncios.")
            print(f"📁 Guardados en {output_file.relative_to(AGENTS_DIR.parent)}")
            
        except httpx.HTTPStatusError as e:
            print(f"❌ Error HTTP: {e.response.status_code} - {e.response.text}")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error inesperado: {str(e)}")
            sys.exit(1)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Fetch Canvas announcements")
    parser.add_argument("--days", type=int, default=1, help="Number of days to look back")
    args = parser.parse_args()
    asyncio.run(fetch_announcements(days=args.days))
