# Agente P - Project Context

## 1. Project Overview
**Agente P** is a personal, automated academic assistant system. It consists of multiple Autonomous Agents running 24/7 (or on a scheduled basis) on a server. Their primary goal is to manage, track, and solve university assignments for the user (a student at Pontificia Universidad Católica de Chile).

## 2. Architecture, Data Flow & Tech Stack
Based on the **AI Worker Pattern**, the architecture uses the following stack:
*   **The Backend / Agents (Python):** Python scripts running locally. The worker process polls tasks and creates bridge files in `agents/io/` for the assistant to resolve, avoiding external API calls.
*   **Task Queue & Database (Supabase / SQLite):** SQLite database locally, migrating to a free-tier Supabase PostgreSQL database for cloud-hosted runs.
*   **The Frontend (React + Vite):** A minimalist SPA hosted for free (e.g. Vercel) to monitor agents, view tasks, and read logs.

## 3. Frontend & User Interface
A companion web application allows the user to monitor agent progress, view completed tasks, and read agent logs. 
*   **Design Constraints (Strict):** Ultra-minimalist (95% black and white), `Inter` typography. No generic AI glassmorphism or purple gradients. 
*   **Accents (≤5%):** Turquoise (`#00a3a6`), Orange (`#ff9e1b`), and Brown (`#4b2430`).
*   **Layout:** Focused on a clean grid of "Ramo" (Subject) cards. Clicking a card expands a detail panel to show agent activity and logs in `JetBrains Mono`.

## 4. Budget & Constraints (Zero-Cost Focus)
**CRITICAL RULE:** The user is a student with a limited budget. The project MUST prioritize 100% free tiers, open-source tools, and student benefits. 
*   **Leverage Student Benefits:** Actively use the GitHub Student Developer Pack (e.g., free server credits for DigitalOcean/Azure).
*   **LLM Access (Zero-Cost Bridge):** We completely bypass direct cloud API connections (which require payment cards for billing setup). Instead, we use Antigravity (the coding assistant) as our LLM processor. The worker writes requests to `agents/io/pending_task.json` and waits for Antigravity to write the solution to `agents/io/resolved_task.json`.
*   If a free option does not exist, the most cost-effective alternative must be thoroughly justified.

---
*Note: This document will evolve as more technical decisions are made.*
