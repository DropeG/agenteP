## Context

The repository root currently holds multiple documentation Markdown files and an asset file. These were created during initial development iterations, resulting in duplicate files (e.g. `ARCHITECTURE_OPTIONS.md` and `docs/architecture/options.md`) and fragmented context across `PRODUCT.md`, `DESIGN.md`, `PROJECT_CONTEXT.md`, and `IMPLEMENTED_FEATURES.md`.

Moving all documentation to structured subfolders within `docs/` cleans the project root and establishes a clear navigation system for team members and automated agent skills.

## Goals / Non-Goals

**Goals:**
- Eliminate duplicated documentation between root and `docs/`.
- Establish clean subfolder hierarchy: `docs/assets/`, `docs/architecture/`, `docs/context/`, `docs/design/`, and `docs/roadmap.md`.
- Keep root neat and standard: `README.md`, configuration files (`.env.example`, `.gitignore`), and source directories (`backend/`, `frontend/`, `agents/`, `openspec/`).
- Update internal documentation links in `README.md`.

**Non-Goals:**
- Modifying backend Python code or frontend React components (except path links if referenced).
- Changing user-defined system rules in `.agents/AGENTS.md`.

## Decisions

### Decision 1: Single Source of Truth for Architecture & Design
- **Choice**: Merge root `ARCHITECTURE_OPTIONS.md` into `docs/architecture/options.md` and remove root duplicate. Merge root `DESIGN.md` into `docs/design/design_system.md`.
- **Rationale**: Prevents conflicting design instructions and ensures both human developers and AI tools read the exact same design specs.

### Decision 2: Domain-Based Folder Structure
- **Choice**:
  - Assets ➔ `docs/assets/`
  - Technical / Stack ➔ `docs/architecture/`
  - Product / UC Rules ➔ `docs/context/`
  - Design Tokens & Aesthetics ➔ `docs/design/`
  - Roadmap ➔ `docs/roadmap.md`
- **Rationale**: Groups related documents logically by domain rather than flattening everything at top-level.

## Risks / Trade-offs

- **Broken Links in Documentation** → *Mitigation*: Perform a full `grep` search for all moved file names and update all markdown links in `README.md` and docs.
- **Git / Versioning history tracking** → *Mitigation*: Perform file moves cleanly via file system or version control operations.
