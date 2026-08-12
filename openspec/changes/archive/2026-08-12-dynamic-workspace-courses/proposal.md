## Why

Currently, the Agente P frontend hardcodes a single course card (`IIC2143 - Ingeniería de Software`) in `App.jsx`. However, the workspace (`agents/workspace/`) already contains multiple profiled course directories with structured `course_profile.json` metadata. Loading courses dynamically ensures the frontend automatically reflects all courses present in the workspace without hardcoding course codes or names.

## What Changes

- Create a dynamic course loader in the frontend using Vite's `import.meta.glob` to inspect `agents/workspace/*/course_profile.json`.
- Update `App.jsx` to replace `INITIAL_COURSES` with the dynamically loaded workspace courses.
- Render cards for all profiled workspace courses in `CourseGrid` (currently `EYP1027`, `IIC2173`, `IIC2213`, `IIC2513`, `IIC2523`).
- Keep the interaction minimal for now: display only the clean course cards (Sigla and Nombre) without opening detail modal/views yet.

## Capabilities

### New Capabilities
- `workspace-course-cards`: Dynamic discovery and rendering of course cards based on `course_profile.json` files in `agents/workspace/`.

### Modified Capabilities

## Impact

- `frontend/src/App.jsx`: Replaces static `INITIAL_COURSES` array with dynamic course loader.
- `frontend/src/utils/courseLoader.js`: New utility module for dynamic JSON discovery.
- `frontend/src/components/CourseGrid.jsx`: Renders dynamic list of courses.
