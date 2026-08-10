## ADDED Requirements

### Requirement: Canvas CLI API Primitives
The system SHALL provide clean, deterministic CLI primitives in `canvas_tools.py` that return structured JSON outputs for Canvas courses, files, folders, and modules without hardcoded semantic search filters.

#### Scenario: Listing files for a course
- **WHEN** the CLI command `python3 agents/core/canvas_tools.py list-files --course IIC2143` is executed
- **THEN** the script outputs a JSON list containing file metadata (id, filename, display_name, size, url, updated_at).

#### Scenario: Downloading a specific file by ID
- **WHEN** the CLI command `python3 agents/core/canvas_tools.py download-file-by-id --file-id 12345 --dest agents/workspace/IIC2143/syllabus.pdf` is executed
- **THEN** the target file is streamed from Canvas API and saved directly to the requested destination path.

### Requirement: Agentic Syllabus Discovery
The `profile_course` skill SHALL guide the AI agent through semantic reasoning steps over Canvas API primitive outputs to locate, download, and parse the syllabus regardless of non-standard filenames or module placement.

#### Scenario: Locating syllabus with non-standard filename
- **WHEN** a course syllabus is stored as a file named `Silabo_2026_V2.pdf` or buried inside a course folder
- **THEN** the AI agent inspects the file/module JSON output from `canvas_tools.py`, identifies `Silabo_2026_V2.pdf` as the syllabus through semantic reasoning, downloads it using `download-file-by-id`, and builds the course profile.
