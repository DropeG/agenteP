## Context

Currently, `canvas_tools.py` embeds hardcoded filtering rules (like searching for `"programa"` or filtering folders matching `"clase"`, `"diapositiva"`, etc.). This causes failures whenever Canvas courses use non-standard file names, custom folder structures, or module-based organizations.

Per `.agents/AGENTS.md` rules:
1. Python scripts MUST remain clean, deterministic data tools (Canvas API & file I/O) without paid AI dependencies.
2. AI agents MUST perform 100% of the reasoning, classification, and routing decisions.

## Goals / Non-Goals

**Goals:**
- Refactor `canvas_tools.py` into modular Canvas API primitives (`get-course-info`, `list-files`, `list-folders`, `list-modules`, `download-file-by-id`) that return clean JSON.
- Update `.agents/skills/profile_course/SKILL.md` to guide the AI agent step-by-step to inspect Canvas API outputs, semantically identify syllabi, download by ID, and profile the course.
- Prepare the architecture so the user can test skills against real Canvas courses and refine skill prompts based on empirical feedback.

**Non-Goals:**
- Placing AI/LLM SDK calls inside Python backend scripts (strictly prohibited by project rules).
- Hardcoding course codes or course-specific regexes.

## Decisions

### Decision 1: JSON Output for API Primitives
Instead of formatted console text printouts (`print("📋 Found X assignments")`), `canvas_tools.py` subcommands will output clean, readable JSON. This allows the AI agent to parse file IDs, filenames, updated dates, and module trees with total precision.

### Decision 2: Agent-Led Semantic Search
Instead of `download-syllabus` running a hardcoded search, the `profile_course` skill will instruct the agent:
1. Fetch course details and inspect native `syllabus_body`.
2. Fetch course files/modules JSON.
3. Reason semantically to select the syllabus candidate (even if named `Silabo_2026.pdf` or `Reglas_General.pdf`).
4. Execute `download-file-by-id` for the chosen ID.

## Risks / Trade-offs

- **[Risk] Large File Tree Payload**: A course with hundreds of files might output a large JSON payload.
  - *Mitigation*: Limit default `list-files` per_page or allow filtering by parent folder while keeping output structured.
