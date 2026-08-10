import time
from agents.core.supabase_client import supabase

def push_live_demo_task():
    print("==========================================================================")
    print("📢 [El Guardián Simulation] Pushing new Canvas announcement task to Supabase Cloud...")
    print("==========================================================================\n")

    course_code = "IIC2143"
    announcement_title = "Entrega 2 de Proyecto disponible en Canvas"
    prompt_text = "Evaluate the new announcement: 'Entrega 2 de Proyecto disponible'. Determine if it introduces a new task, deadline, or group submission rules."

    # 1. Insert log
    supabase.table("logs").insert({
        "agent_name": "El Guardián",
        "message": f"Ingested new announcement for {course_code}: '{announcement_title}'",
        "course_code": course_code,
        "level": "info"
    }).execute()
    print("  └─ Logged ingestion event to Supabase Cloud")

    # 2. Insert pending task
    res = supabase.table("tasks").insert({
        "course_code": course_code,
        "task_type": "evaluate_announcement",
        "prompt": prompt_text,
        "status": "pending"
    }).execute()

    inserted_task = res.data[0] if res.data else None
    task_id = inserted_task.get("id") if inserted_task else "N/A"

    print(f"  └─ Inserted pending Task #{task_id} for {course_code} into Supabase Cloud! ⚡")
    print("\n👉 Check your browser at http://localhost:5173/ — the badge on IIC2143 will update automatically!")

if __name__ == "__main__":
    push_live_demo_task()
