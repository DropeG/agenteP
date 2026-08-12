## ADDED Requirements

### Requirement: Dynamic Evaluation Taxonomy Extraction
The system MUST dynamically discover and extract evaluation categories for any Canvas course by parsing its Syllabus (Programa del Curso), Assignment Groups, and Canvas Modules without relying on hardcoded evaluation types or boolean flags.

#### Scenario: Course with non-standard evaluation categories
- **WHEN** `profile_course` is executed for a course containing non-standard evaluation categories (such as "Actividades Formativas", "Controles", "Quizzes", "Talleres")
- **THEN** the system extracts all categories into an array of objects under `evaluations` in `course_profile.json` with fields `key`, `name`, `folder`, `weight`, and `details`.

### Requirement: Dynamic Workspace Folder Scaffolding
The system MUST automatically iterate over the extracted evaluation categories and scaffold corresponding directories in `agents/workspace/{COURSE_CODE}/{eval.folder}/` during course initialization.

#### Scenario: Scaffolding active evaluation directories
- **WHEN** course profiling completes for a course with categories "Actividades Formativas" and "Controles"
- **THEN** the directories `agents/workspace/{COURSE_CODE}/actividades_formativas/` and `agents/workspace/{COURSE_CODE}/controles/` are created automatically, without creating folders for non-existent evaluation types.

### Requirement: Categorized Assignment Routing and Storage
The system MUST route and save assignment instructions, files, and deliverables into the specific evaluation subfolder corresponding to that assignment's category.

#### Scenario: Saving assignment material in categorized workspace
- **WHEN** an assignment (e.g., AC01) is set up or downloaded
- **THEN** its files (`instructions.md`, `Enunciado.md`, `main.py`) are placed inside `agents/workspace/{COURSE_CODE}/actividades_formativas/AC01/` instead of an un-categorized root folder.
