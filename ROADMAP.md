# Agente P - Project Roadmap

This document breaks down the entire project into small, manageable tasks. You can check these off `[x]` as we complete them over different coding sessions.

## Phase 1: Local Backend & Agent Core (Python) ✅
*Goal: Build a working agent locally that can read a task and execute a basic skill.*
- [x] Initialize Python virtual environment.
- [x] Create folder structure (`agents/core`, `agents/skills`, `agents/io`).
- [x] Set up environment variables / bridge configuration (Bypassed LLM API via Antigravity-as-a-Service file bridge).
- [x] Create a local `dummy_queue.json` to simulate pending tasks.
- [x] Build the `worker.py` script: A loop that reads the queue, sends the task to the LLM (bridge), and prints a response.
- [x] Create a "Dummy Skill": Let the agent write a short text file to prove it can execute actions.

## Phase 2: University Integrations & Real Skills
*Goal: Connect to Canvas UC and Outlook to extract tasks and build domain-specific agent skills locally.*
- [x] Investigate Canvas UC integration (API vs. Web Scraping with Playwright - Completed connection testing).
- [x] Build the `fetch_announcements.py` script (El Guardián): Polls courses dynamically, checks for new announcements, and adds tasks to the queue.
- [ ] Build the `fetch_canvas_assignments` skill: Scans for active assignments, downloads rubrics, and sets up workspace folders.
- [ ] Build the study summarizer skill (El Estudiante): Reads slides/PDF files and creates local summaries.
- [ ] Build the grading feedback loop (El Evaluador): Pulls professor remarks to update course style memory.
- [ ] Investigate Outlook integration (Microsoft Graph API) & read emails.

## Phase 3: Database Integration (Supabase - Free Tier)
*Goal: Move the task queue from local files to a real cloud database.*
- [ ] Create a free Supabase project online.
- [ ] Design the database tables (`tasks` and `logs`).
- [ ] Install Supabase Python client in our backend.
- [ ] Modify `worker.py` to fetch tasks from Supabase instead of the local JSON.
- [ ] Modify `worker.py` to upload its execution logs back to Supabase.

## Phase 4: The Frontend Dashboard (React + Vite)
*Goal: Build the minimalist web app to monitor the agents.*
- [ ] Initialize/Configure the React + Vite project (`frontend/`).
- [ ] Set up global CSS respecting strict design rules (95% black/white, `Inter` font, Perry accents).
- [ ] Connect React + Vite to Supabase to read course tasks and agent logs.
- [ ] Build the "Mis Ramos" (Subject Cards) view (only showing Sigla and Name).
- [ ] Build the "Agent Detail Panel" to view real-time logs (in `JetBrains Mono`) and tasks when expanding a course card.

---
*Note: Focus on completing one single checkbox per session to avoid feeling overwhelmed.*
