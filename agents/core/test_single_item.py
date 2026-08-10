import time
from agents.core.supabase_client import supabase

def run_single_item_test():
    print("==========================================================================")
    print("🐢 [Incremental Single-Item Test] Ingesting EXACTLY 1 announcement for IIC2143")
    print("==========================================================================\n")

    course_code = "IIC2143"
    title = "Examen / Examen Pasado (IIC2143)"
    prompt_text = "Evaluate Canvas announcement: 'Examen / Examen Pasado' for IIC2143. Identify exam dates, rooms, and study material locations."

    # 1. Log ingestion event
    supabase.table("logs").insert({
        "agent_name": "El Guardián",
        "message": f"Ingested Canvas announcement: '{title}' for {course_code}",
        "course_code": course_code,
        "level": "info"
    }).execute()
    print("  └─ [Step 1] Ingestion log pushed to Supabase Cloud")

    # 2. Insert single pending task
    res = supabase.table("tasks").insert({
        "course_code": course_code,
        "task_type": "evaluate_announcement",
        "prompt": prompt_text,
        "status": "pending"
    }).execute()
    
    task_id = res.data[0]["id"] if res.data else "N/A"
    print(f"  └─ [Step 2] Single pending Task #{task_id} inserted into Supabase Cloud! ⚡")
    print("\n👉 Check your browser at http://localhost:5173/ — IIC2143 card will show '1 Tarea'.")

if __name__ == "__main__":
    run_single_item_test()
