## ADDED Requirements

### Requirement: Centralized documentation layout
The system SHALL maintain all project documentation, brand assets, architecture designs, and context guides strictly inside dedicated subdirectories under `docs/`.

#### Scenario: Documentation subfolder structure
- **WHEN** inspecting the repository structure
- **THEN** documentation files SHALL be located in `docs/assets/`, `docs/architecture/`, `docs/context/`, or `docs/design/`

### Requirement: Root directory cleanliness
The repository root directory SHALL contain only standard project files (`README.md`, `.env.example`, `.gitignore`, configuration manifests) and code directories (`backend/`, `frontend/`, `agents/`, `docs/`, `openspec/`).

#### Scenario: Loose documentation check in root
- **WHEN** listing the files in the workspace root
- **THEN** no standalone product, design, or architecture Markdown files SHALL exist in the root except `README.md`

### Requirement: Up-to-date README documentation links
The `README.md` file SHALL link accurately to all documentation files in their new locations under `docs/`.

#### Scenario: Navigating from README
- **WHEN** a user or developer follows links in `README.md`
- **THEN** all links SHALL resolve correctly to existing files within `docs/`
