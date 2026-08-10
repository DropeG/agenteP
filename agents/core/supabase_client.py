import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / "backend" / ".env"
load_dotenv(ENV_PATH)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in backend/.env")

supabase: Client = create_client(supabase_url, supabase_key)
