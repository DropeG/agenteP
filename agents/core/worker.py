import os
import json
import time
from pathlib import Path

# Setup paths relative to this script
AGENTS_DIR = Path(__file__).resolve().parent.parent
QUEUE_FILE = AGENTS_DIR / "dummy_queue.json"
IO_DIR = AGENTS_DIR / "io"
PENDING_FILE = IO_DIR / "pending_task.json"
RESOLVED_FILE = IO_DIR / "resolved_task.json"

# Ensure io directory exists
IO_DIR.mkdir(parents=True, exist_ok=True)

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
        json.dump(queue, f, indent=2)

def main():
    print("[Agente P Worker] Starting task worker...")
    print(f"[Agente P Worker] Monitoring queue: {QUEUE_FILE}")
    
    while True:
        queue = load_queue()
        pending_tasks = [t for t in queue if t.get("status") == "pending"]
        
        if not pending_tasks:
            print("[Agente P Worker] No pending tasks in queue. Exiting.")
            break
            
        task = pending_tasks[0]
        task_id = task.get("id")
        task_prompt = task.get("prompt")
        task_type = task.get("task_type")
        
        print(f"\n[Agente P Worker] Found pending Task #{task_id} (Type: {task_type})")
        print(f"[Agente P Worker] Task Prompt: '{task_prompt}'")
        
        # Mark as processing
        task["status"] = "processing"
        save_queue(queue)
        
        # Write to pending_task.json to request solving
        pending_data = {
            "id": task_id,
            "task_type": task_type,
            "prompt": task_prompt
        }
        with open(PENDING_FILE, "w", encoding="utf-8") as f:
            json.dump(pending_data, f, indent=2)
            
        print("[Agente P Worker] Wrote task details to agents/io/pending_task.json")
        print("\n==========================================================================")
        print("⚠️  LLM API Bypassed: Waiting for Antigravity to solve the task.")
        print("👉 Please tell Antigravity in your chat:")
        print(f"   \"Solve the pending task in agents/io/pending_task.json\"")
        print("==========================================================================\n")
        
        print("Waiting for agents/io/resolved_task.json...", end="", flush=True)
        
        # Wait for resolved_task.json
        while not RESOLVED_FILE.exists():
            time.sleep(2)
            print(".", end="", flush=True)
            
        print("\n[Agente P Worker] Resolution detected!")
        
        # Read resolution
        try:
            with open(RESOLVED_FILE, "r", encoding="utf-8") as f:
                resolution = json.load(f)
            
            print(f"[Agente P Worker] Task #{task_id} marked as completed.")
            print("[Agente P Worker] Result summary:")
            print(f"  Status: {resolution.get('status', 'unknown')}")
            print(f"  Message: {resolution.get('message', 'No message provided')}")
            
            # Clean up communication files
            if PENDING_FILE.exists():
                PENDING_FILE.unlink()
            if RESOLVED_FILE.exists():
                RESOLVED_FILE.unlink()
                
            # Update status in database/queue
            queue = load_queue()
            for t in queue:
                if t.get("id") == task_id:
                    t["status"] = "completed"
                    t["result"] = resolution
            save_queue(queue)
            
        except Exception as e:
            print(f"\n[Agente P Worker] Error reading resolution: {e}")
            # Reset task to pending so it can be retried
            queue = load_queue()
            for t in queue:
                if t.get("id") == task_id:
                    t["status"] = "pending"
            save_queue(queue)
            break
            
        time.sleep(1)

if __name__ == "__main__":
    main()
