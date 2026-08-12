## Context

Actualmente `CourseSubSidebar.jsx` solo cuenta con una pestaña estática ("General"). En `App.jsx`, al seleccionar un ramo se muestra `CourseGeneralView.jsx`. Se necesita incorporar la vista de tareas por ramo (`CourseTasksView.jsx`) con dos secciones visuales primarias: "Tareas por hacer" y "Tareas ya hechas", manteniendo el diseño minimalista de AgenteP.

## Goals / Non-Goals

**Goals:**
- Añadir el botón de navegación "Tareas" en `CourseSubSidebar.jsx` con su respectiva indicación de estado activo.
- Crear el componente visual `CourseTasksView.jsx` que muestre mockups realistas de las tareas académicas divididas en "Por Hacer" y "Ya Hechas".
- Gestionar el estado de navegación interna del curso (`activeCourseTab: 'general' | 'tasks'`) en `App.jsx` o `CourseSubSidebar`.
- Mantener estrictamente la estética 95% neutra y los colores oficiales de AgenteP (`#FAF7F2`, `#FFFFFF`, `#08ACB1`, `#F99814`).

**Non-Goals:**
- Lógica de persistencia o estado interactivo al marcar checkboxes (se pospone para una iteración posterior según indicación explícita del usuario).
- Integración con Backend / APIs / Supabase en esta etapa.
- Mostrar notas o ponderaciones detalladas por tarea en las hechas (pospuesto).

## Decisions

1. **Estado de Navegación del Curso en App.jsx / State local**:
   - Pasar `activeCourseTab` y `setActiveCourseTab` como prop a `CourseSubSidebar` y renderizar `CourseTasksView` cuando la pestaña sea `'tasks'`.
   - *Alternativa considerada*: Rutas dinámicas en React Router. Se descarta para mantener la arquitectura de SPA ligera actual.

2. **Estructura Estética de `CourseTasksView`**:
   - Usar un contenedor grid de 1 columna para mantener la lectura limpia.
   - Encabezado con badge turquesa de sigla + título `Tareas del Curso` + subtítulo informativo de total de tareas.
   - Dos bloques principales: `Sección Tareas Por Hacer` y `Sección Tareas Ya Hechas` (desplegada).

3. **Datos de Demostración (Mock estático)**:
   - Datos mockeados de tareas típicas UC (Proyecto, Control, Actividad Formativa) para que el usuario pueda evaluar el aspecto visual del frontend.

## Risks / Trade-offs

- **[Riesgo]** Confusión entre eventos del calendario general y tareas específicas del ramo.
  - *Mitigación*: Las tareas del ramo se enfocan en entregables académicos claros (Tareas, Proyectos, Controles) en lugar de eventos de horario.
