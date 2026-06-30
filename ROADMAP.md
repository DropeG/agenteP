# Agente P - Project Roadmap

This document breaks down the entire project into small, manageable tasks. You can check these off `[x]` as we complete them over different coding sessions.

## Phase 1: Local Backend & Agent Core (Python)
*Goal: Build a working agent locally that can read a task and execute a basic skill.*
- [x] Initialize Python virtual environment.
- [ ] Create folder structure (`backend/core`, `backend/skills`).
- [ ] Set up environment variables (`.env`) for LLM API keys.
- [ ] Create a local `dummy_queue.json` to simulate pending tasks.
- [ ] Build the `worker.py` script: A loop that reads the queue, sends the task to the LLM, and prints a response.
- [ ] Create a "Dummy Skill": Let the agent write a short text file to prove it can execute actions.

## Phase 2: Database Integration (Supabase - Free Tier)
*Goal: Move the task queue from local files to a real cloud database.*
- [ ] Create a free Supabase project online.
- [ ] Design the database tables (`tasks` and `logs`).
- [ ] Install Supabase Python client in our backend.
- [ ] Modify `worker.py` to fetch tasks from Supabase instead of the local JSON.
- [ ] Modify `worker.py` to upload its execution logs back to Supabase.

## Phase 3: The Frontend Dashboard (Next.js - Free Tier)
*Goal: Build the minimalist web app to monitor the agents.*
- [ ] Initialize Next.js project (`frontend/`).
- [ ] Set up global CSS respecting strict design rules (95% black/white, `Inter` font, Perry accents).
- [ ] Connect Next.js to Supabase.
- [ ] Build the "Mis Ramos" (Subject Cards) view.
- [ ] Build the "Agent Detail Panel" to view real-time logs (in `JetBrains Mono`).

## Phase 4: University Integrations (The Real Skills)
*Goal: Give the agents the ability to actually interact with university platforms.*
- [ ] Investigate Canvas UC integration (API vs. Web Scraping with Playwright).
- [ ] Build the `fetch_canvas_assignments` skill.
- [ ] Investigate Outlook integration (Microsoft Graph API).
- [ ] Build the `read_outlook_emails` skill.
- [ ] Allow the agent to automatically add new assignments to the Supabase task queue.

---
*Note: Focus on completing one single checkbox per session to avoid feeling overwhelmed.*
