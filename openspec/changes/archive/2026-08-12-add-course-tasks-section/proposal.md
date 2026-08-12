## Why

Estudiantes navegando por un curso específico en AgenteP necesitan un acceso rápido y centralizado a sus tareas académicas (evaluaciones, entregas, controles y actividades formativas), distinguiendo claramente entre tareas pendientes ("Por Hacer") y tareas completadas ("Ya Hechas").

## What Changes

- **Nuevo ítem "Tareas" en el sidebar secundario de cada curso (`CourseSubSidebar`)**: Permite alternar entre la vista "General" y la vista "Tareas" del ramo seleccionado.
- **Nueva vista `CourseTasksView`**: Renderiza el panel principal con la sección de "Tareas por hacer" (pendientes/próximas) y la sección de "Tareas ya hechas" (completadas).
- **Mapeo estático y mock visual preliminar**: Se scaffoldeará la interfaz estática para validación de UI/UX respetando el sistema de diseño minimalista de AgenteP, sin implementar lógica de marcado interactivo ni calificaciones por ahora.

## Capabilities

### New Capabilities
- `course-tasks-view`: Visualización y organización de tareas por hacer y tareas ya hechas dentro de cada ramo.

### Modified Capabilities
(Ninguna capacidad existente cambia sus requerimientos)

## Impact

- `frontend/src/components/CourseSubSidebar.jsx`: Agrega botón de navegación "Tareas".
- `frontend/src/components/CourseTasksView.jsx`: [NUEVO] Componente de vista de tareas del ramo.
- `frontend/src/App.jsx`: Manejo de estado de navegación activa dentro del curso (`courseView: 'general' | 'tasks'`).
