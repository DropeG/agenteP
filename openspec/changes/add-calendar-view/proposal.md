## Why

Los estudiantes necesitan visualizar de manera centralizada y clara las fechas importantes de sus ramos (interrogaciones, exámenes, entregas de tareas, controles) sincronizadas directamente con `workspace/calendar.json` generado por los agentes de Agente P.

## What Changes

- **Sidebar Navigation**: Agregar una nueva sección "Calendario" con ícono representativo (`Calendar`) entre "Mis Ramos" y "Configuración".
- **Vista Principal de Calendario**: Crear un nuevo componente visual `CalendarView.jsx` que muestra por defecto la grilla del mes actual.
- **Integración de Datos de Calendar**: Cargar y mapear dinámicamente los eventos evaluativos desde `agents/workspace/calendar.json`.
- **Filtros e Inspector de Eventos**: Permitir al estudiante filtrar eventos por ramo o tipo de evaluación y seleccionar días o eventos para ver detalles completos (fecha, hora, módulo, origen).

## Capabilities

### New Capabilities
- `calendar-view`: Vista de calendario interactiva en el frontend de Agente P vinculada a `workspace/calendar.json`.

### Modified Capabilities

## Impact

- `frontend/src/components/Sidebar.jsx`: Adición de la pestaña Calendario.
- `frontend/src/App.jsx`: Manejo del estado `activeView === 'calendar'` y renderizado de `CalendarView`.
- `frontend/src/components/CalendarView.jsx`: Componente principal del calendario.
- `frontend/src/index.css` / `App.css`: Estilos ultra-minimalistas con la paleta Perry (≤5% acentos).
