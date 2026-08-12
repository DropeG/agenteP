## ADDED Requirements

### Requirement: Four-Source Canvas Syllabus Exploration
The system MUST explore four distinct Canvas sources (Front Page, Modules & Items, Files, and Announcements) to discover potential course syllabus documents.

#### Scenario: Exploring multiple Canvas sources
- **WHEN** `profile_course` executes for a course
- **THEN** the system checks Front Page, Modules, Files, and Announcements to gather all potential syllabus candidates (HTML bodies, PDF files, or external links like GitHub).

### Requirement: Semantic Context Verification
The system MUST perform semantic verification on candidate syllabus documents before accepting them as the official Syllabus.

#### Scenario: Differentiating real syllabus from class slides
- **WHEN** a candidate file (such as `Programación.pdf`) is found
- **THEN** the system inspects its text for syllabus markers (grading rules, evaluation weights, objectives) and discards it if it represents lecture slides rather than the official course syllabus.
