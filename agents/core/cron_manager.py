#!/usr/bin/env python3
"""
cron_manager.py - Deterministic tool for managing cron jobs in Agente P.
Updates agents/workspace/cron_status.json and synchronizes macOS crontab.
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

# Resolve workspace directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATUS_FILE = BASE_DIR / "agents" / "workspace" / "cron_status.json"

def load_cron_status():
    if not STATUS_FILE.exists():
        return {}
    try:
        with open(STATUS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ Error reading {STATUS_FILE}: {e}")
        return {}

def save_cron_status(data):
    STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATUS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Updated {STATUS_FILE}")

def sync_macos_crontab(target_script, new_schedule):
    """
    Updates the crontab line corresponding to target_script on macOS.
    """
    if not target_script or not os.path.exists(target_script):
        print(f"ℹ️ Target script '{target_script}' not found locally or empty. Skipping crontab injection.")
        return False

    try:
        # 1. Read existing crontab
        res = subprocess.run(["crontab", "-l"], capture_output=True, text=True)
        current_crontab = res.stdout if res.returncode == 0 else ""

        lines = current_crontab.splitlines()
        updated_lines = []
        found = False
        target_norm = os.path.abspath(target_script)

        for line in lines:
            trimmed = line.strip()
            # If line mentions target script, replace schedule
            if target_script in trimmed or target_norm in trimmed:
                updated_lines.append(f"{new_schedule} {target_norm}")
                found = True
            else:
                updated_lines.append(line)

        if not found:
            # Append as new entry
            updated_lines.append(f"{new_schedule} {target_norm}")

        new_crontab_content = "\n".join(updated_lines).strip() + "\n"

        # 2. Write new crontab
        write_res = subprocess.run(["crontab", "-"], input=new_crontab_content, text=True, capture_output=True)
        if write_res.returncode == 0:
            print(f"✅ macOS crontab synchronized with: {new_schedule} {target_norm}")
            return True
        else:
            print(f"⚠️ Failed to update crontab: {write_res.stderr}")
            return False
    except Exception as e:
        print(f"⚠️ Error syncing macOS crontab: {e}")
        return False

def update_schedule(job_id, new_schedule, schedule_label=None, sync_os=True):
    data = load_cron_status()
    if job_id not in data:
        print(f"❌ Job '{job_id}' not found in {STATUS_FILE}")
        return False

    job = data[job_id]
    job["schedule"] = new_schedule
    if schedule_label:
        job["schedule_label"] = schedule_label

    target_script = job.get("target_script")
    save_cron_status(data)

    if sync_os and target_script:
        sync_macos_crontab(target_script, new_schedule)

    return True

def main():
    parser = argparse.ArgumentParser(description="Agente P Cron Manager")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # update command
    update_parser = subparsers.add_parser("update", help="Update a cron schedule")
    update_parser.add_argument("--id", required=True, help="Job identifier (e.g. daily_briefing)")
    update_parser.add_argument("--schedule", required=True, help="Cron expression (e.g. '0 15 * * *')")
    update_parser.add_argument("--label", required=False, help="Human-readable label")
    update_parser.add_argument("--no-os-sync", action="store_true", help="Skip macOS crontab sync")

    args = parser.parse_args()

    if args.command == "update":
        success = update_schedule(
            job_id=args.id,
            new_schedule=args.schedule,
            schedule_label=args.label,
            sync_os=not args.no_os_sync
        )
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
