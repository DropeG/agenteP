import os
import shutil
from dotenv import load_dotenv
from agents.core.supabase_client import supabase

load_dotenv(dotenv_path="backend/.env")

def clean_all():
    print("==========================================================================")
    print("🧹 [Clean Reset] Wiping workspace and Supabase Cloud database to 0")
    print("==========================================================================\n")

    # 1. Wipe local workspace directory
    if os.path.exists("agents/workspace"):
        shutil.rmtree("agents/workspace")
    os.makedirs("agents/workspace", exist_ok=True)
    print("  └─ [Clean 1] Local workspace directory completely deleted.")

    # 2. Wipe Supabase database tables
    supabase.table("tasks").delete().neq("id", 0).execute()
    supabase.table("logs").delete().neq("id", 0).execute()
    print("  └─ [Clean 2] Supabase Cloud tasks and logs tables wiped to 0 rows.")

    print("\n✅ Clean Reset Complete! System is at 100% clean slate.")

if __name__ == "__main__":
    clean_all()
