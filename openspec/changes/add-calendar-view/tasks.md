## 1. Sidebar Integration

- [x] 1.1 Update `Sidebar.jsx` to include "Calendario" navigation item with `Calendar` icon.
- [x] 1.2 Update `App.jsx` state handler and routing logic to support `activeView === 'calendar'`.

## 2. Calendar Component & Data Binding

- [x] 2.1 Create `CalendarView.jsx` with current month grid view layout and month navigation header.
- [x] 2.2 Implement data loader utility to read and parse `agents/workspace/calendar.json`.
- [x] 2.3 Render day cells and bind event badges formatted with course code, title, and Perry accent tags.

## 3. Filtering & Inspection UI

- [x] 3.1 Implement filter pills for course codes (`IIC2523`, `EYP1027`, `IIC2213`, etc.) and evaluation types.
- [x] 3.2 Create event inspector side drawer/panel displaying full details (start time, location, modules, source).
- [x] 3.3 Ensure full mobile and tablet responsive layout matching Agente P design rules.
