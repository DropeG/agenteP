import os
import shutil
import json
from dotenv import load_dotenv
from agents.core.supabase_client import supabase

load_dotenv(dotenv_path="backend/.env")

def clean_all():
    print("==========================================================================")
    print("🧹 [Clean Reset] Wiping workspace, dummy queue and Supabase database to 0")
    print("==========================================================================\n")

    # 1. Wipe local workspace directory
    if os.path.exists("agents/workspace"):
        shutil.rmtree("agents/workspace")
    os.makedirs("agents/workspace", exist_ok=True)
    print("  └─ [Clean 1] Local workspace directory completely deleted.")

    # 2. Reset dummy_queue.json
    dummy_queue_path = "agents/dummy_queue.json"
    with open(dummy_queue_path, "w", encoding="utf-8") as f:
        json.dump([], f, indent=2)
    print("  └─ [Clean 2] agents/dummy_queue.json reset to empty list [].")

    # 3. Wipe Supabase database tables
    try:
        supabase.table("tasks").delete().neq("id", 0).execute()
        supabase.table("logs").delete().neq("id", 0).execute()
        print("  └─ [Clean 3] Supabase Cloud tasks and logs tables wiped to 0 rows.")
    except Exception as e:
        print(f"  └─ [Clean 3 Warning] Supabase wipe encountered: {e}")

    print("\n✅ Clean Reset Complete! System is at 100% clean slate.")

if __name__ == "__main__":
    clean_all()

