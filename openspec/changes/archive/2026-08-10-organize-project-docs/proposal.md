## Why

The project root currently contains multiple loose Markdown files (`IMPLEMENTED_FEATURES.md`, `PRODUCT.md`, `DESIGN.md`, `PROJECT_CONTEXT.md`, `ARCHITECTURE_OPTIONS.md`, `ROADMAP.md`) and asset files (`agente-p-logo.png`). This creates clutter, makes project navigation harder, and results in content overlap with files in `docs/`.

Organizing these documents into clean, categorized subdirectories inside `docs/` creates a clear single source of truth for project context, design guidelines, and architecture specs while leaving the repository root clean.

## What Changes

- Create structured subdirectories in `docs/`: `docs/assets/`, `docs/architecture/`, `docs/context/`, and `docs/design/`.
- Move asset `agente-p-logo.png` to `docs/assets/agente-p-logo.png`.
- Consolidate and move `ARCHITECTURE_OPTIONS.md` into `docs/architecture/options.md` (removing root duplicate).
- Move `IMPLEMENTED_FEATURES.md` into `docs/architecture/features.md`.
- Move `PROJECT_CONTEXT.md` into `docs/context/project_context.md`.
- Move `PRODUCT.md` into `docs/context/product_vision.md`.
- Consolidate `DESIGN.md` into `docs/design/design_system.md`.
- Move `ROADMAP.md` to `docs/roadmap.md`.
- Update `README.md` links to point to the new organized file paths in `docs/`.

## Capabilities

### New Capabilities
- `project-documentation`: Defines the standard directory layout, categorization, and single-source-of-truth guidelines for project documentation.

### Modified Capabilities

(None - no existing specs in `openspec/specs/`)

## Impact

- **Root Directory**: Cleaned up to contain only essential project files (`README.md`, config files, source folders).
- **Docs Directory**: Structured repository documentation categorized by domain.
- **Documentation Links**: Updated cross-references in `README.md`.
