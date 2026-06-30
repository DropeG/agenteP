# Agente P - Project Context

## 1. Project Overview
**Agente P** is a personal, automated academic assistant system. It consists of multiple Autonomous Agents running 24/7 (or on a scheduled basis) on a server. Their primary goal is to manage, track, and solve university assignments for the user (a student at Pontificia Universidad Católica de Chile).

## 2. Architecture, Data Flow & Tech Stack
Based on the **AI Worker Pattern**, the architecture uses the following stack:
*   **The Backend / Agents (Python):** Python scripts running locally (for now) and later on a free cloud server (DigitalOcean/Azure via Student Pack). Agents process one task at a time, using tools to scrape Canvas UC or read Outlook emails.
*   **Task Queue & Database (Supabase):** A free-tier PostgreSQL database. It acts as the central hub where tasks are queued, statuses are updated, and agent logs are stored.
*   **The Frontend (Next.js):** A minimalist web app hosted for free on Vercel to monitor agents, view tasks, and read logs.

## 3. Frontend & User Interface
A companion web application will be built to allow the user to monitor agent progress, view completed tasks, and read agent logs. 
*   **Design Constraints (Strict):** Ultra-minimalist (95% black and white), `Inter` typography. No generic AI glassmorphism or purple gradients. 
*   **Accents (≤5%):** Turquoise (`#00a3a6`), Orange (`#ff9e1b`), and Brown (`#4b2430`).
*   **Layout:** Focused on a clean grid of "Ramo" (Subject) cards. Clicking a card expands a detail panel to show agent activity and logs in `JetBrains Mono`.

## 4. Budget & Constraints (Zero-Cost Focus)
**CRITICAL RULE:** The user is a student with a limited budget. The project MUST prioritize 100% free tiers, open-source tools, and student benefits. 
*   **Leverage Student Benefits:** Actively use the GitHub Student Developer Pack (e.g., free server credits for DigitalOcean/Azure).
*   **LLM Access:** Utilize available models (Google Gemini Pro, Codex paid by brother) to avoid incurring new API costs.
*   If a free option does not exist, the most cost-effective alternative must be thoroughly justified.

---
*Note: This document will evolve as more technical decisions are made.*
