# Proposal: Course Detail View & Contextual Navigation

## Why

Currently, clicking a course card on the main grid ("Mis Ramos") does not open a dedicated course detail view. Students need a focused workspace to view individual course information without losing their place in the app. Implementing a dual-sidebar layout with a collapsed primary sidebar and a course-specific sub-sidebar maximizes horizontal screen space and allows step-by-step addition of course-specific features starting with an MVP "General" section.

## What Changes

- **Primary Sidebar Collapse**: Transition the main navigation sidebar (`Sidebar.jsx`) from expanded (`240px`) to collapsed mini-mode (`64px`, icons + logo only) when a course is selected.
- **Course Sub-sidebar**: Introduce a secondary course navigation panel (`CourseSubSidebar.jsx`, `200px`) displaying the selected course code, a "Volver a Ramos" button, and navigation items starting with "General".
- **Course General View**: Create a dedicated view (`CourseGeneralView.jsx`) displaying:
  - Course Name & Code header
  - Course Description
  - Evaluation Rules & Dates (from `course_profile.json` and `calendar.json`)
  - Teaching Team (Professors and Ayudantes with emails and quick copy)
- **Responsive Layout Adaptation**: Ensure the dual-sidebar layout seamlessly adapts on desktop, tablet, and mobile.

## Capabilities

### New Capabilities
- `course-detail-view`: View and navigate individual course details with dual-sidebar layout and General course info.

### Modified Capabilities
None.

## Impact
- `frontend/src/App.jsx`: State management for selected course and view routing.
- `frontend/src/components/Sidebar.jsx`: Support for collapsed icon-only mode.
- `frontend/src/components/CourseGrid.jsx` & `CourseCard.jsx`: Click handlers for selecting a course.
- `frontend/src/components/CourseSubSidebar.jsx`: [NEW] Secondary navigation sidebar for active course scope.
- `frontend/src/components/CourseGeneralView.jsx`: [NEW] Component rendering course description, evaluation rules, and contacts.
