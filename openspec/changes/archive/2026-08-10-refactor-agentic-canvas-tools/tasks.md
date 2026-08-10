## 1. Refactor Canvas API Primitives (`canvas_tools.py`)

- [x] 1.1 Add `get-course-info` subcommand to return course metadata and `syllabus_body` in JSON format.
- [x] 1.2 Add `list-files` subcommand to return a structured JSON array of course files (`id`, `filename`, `display_name`, `size`, `updated_at`).
- [x] 1.3 Add `list-modules` subcommand to return a structured JSON array of course modules and items.
- [x] 1.4 Add `download-file-by-id` subcommand to download any Canvas file by ID directly to a target filepath.

## 2. Refactor `profile_course` Skill

- [x] 2.1 Update `.agents/skills/profile_course/SKILL.md` to use Canvas CLI primitives instead of hardcoded `download-syllabus`.
- [x] 2.2 Add explicit agent reasoning instructions for evaluating files and module items semantically to detect syllabus candidates.
- [x] 2.3 Instruct the agent to invoke `download-file-by-id`, parse syllabus contents (MD/PDF), generate `course_profile.json`, and scaffold active evaluation directories.

## 3. Verification & Testing

- [x] 3.1 Test all updated CLI commands in `canvas_tools.py` for valid JSON output.
- [x] 3.2 Run `profile_course` on a test course and verify agent reasoning and syllabus discovery.
