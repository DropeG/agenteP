## Context

Agente P mantiene un archivo dinámico de eventos evaluativos en `agents/workspace/calendar.json` generado mediante la ingesta y perfilamiento de programas de cursos (Syllabus) y Canvas. Actualmente, la interfaz web cuenta con "Mis Ramos" y "Configuración", pero carecía de una vista de calendario visual centralizada.

## Goals / Non-Goals

**Goals:**
- Añadir el ítem "Calendario" en `Sidebar.jsx`.
- Implementar `CalendarView.jsx` que renderice la grilla del mes actual por defecto, respetando las guías estéticas de Agente P (ultra-minimalista, 95% blanco/negro, ≤5% acentos Perry).
- Importar y mapear dinámicamente `agents/workspace/calendar.json`.
- Proveer filtro por ramo, filtro por tipo de evaluación y panel inspector de eventos.

**Non-Goals:**
- Modificación directa de `calendar.json` desde la UI (el archivo es alimentado por los scripts/agentes del backend).
- Integración externa con Google Calendar o iCal (fuera del alcance inicial).

## Decisions

### Decision 1: Data Integration & Loading Strategy
- **Choice**: Ingestar `calendar.json` mediante importación directa o fetch dinámico con un fallback seguro si el JSON aún no ha sido poblado o formateado.
- **Rationale**: Permite reactividad inmediata en el frontend sin dependencias pesadas ni peticiones complejas a servidores de terceros.

### Decision 2: Color Accent Palette & Visual Hierarchy
- **Choice**:
  - Exámenes e Interrogaciones: Usar acento Perry Naranja (`#ff9e1b`) o Turquesa (`#00a3a6`) en pequeñas insignias (badges) ≤5% de la superficie visual.
  - Controles y Tareas: Usar insignias monocromáticas / borde tenue `var(--color-border)`.
- **Rationale**: Cumple con la restricción estética de `AGENTS.md` evitando "AI Slop" y manteniendo la interfaz sobria y limpia.

## Risks / Trade-offs

- [Risk] Registros con fechas pasadas o fuera del mes actual → Mitigación: Permitir navegación entre meses anteriores/siguientes (`←` y `→`) y botón de acceso rápido "Hoy".
- [Risk] Eventos duplicados o con formato de fecha variado (`ISO` vs `String` sin zona horaria) → Mitigación: Formateador de fechas robusto usando Date nativo de Javascript.
