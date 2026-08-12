## 1. Dynamic Course Loader Utility

- [x] 1.1 Create `frontend/src/utils/courseLoader.js` using Vite `import.meta.glob` to discover and parse `agents/workspace/*/course_profile.json`.

## 2. Frontend Integration

- [x] 2.1 Update `App.jsx` to replace `INITIAL_COURSES` with `loadWorkspaceCourses()`.
- [x] 2.2 Verify that `CourseGrid` renders clean course cards for all 5 workspace courses (`EYP1027`, `IIC2173`, `IIC2213`, `IIC2513`, `IIC2523`).
