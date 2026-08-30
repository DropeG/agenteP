## Why

Se requiere incorporar una nueva sección global en la navegación principal de Agente P llamada **Resumen**, situada junto a "Mis Ramos", "Calendario" y "Configuración". Inicialmente, esta sección servirá como un contenedor base limpio/en blanco donde posteriormente se estructurarán y desplegarán resúmenes de estudio, material sintetizado y resúmenes de clases generados por los agentes.

## What Changes

- **Navegación en Sidebar**: Agregar el botón de navegación "Resumen" con un ícono representativo (ej. `FileText` de Lucide) en el sidebar principal (Tier 1).
- **Manejo de Estado en App**: Añadir la vista `summary` / `resumen` al estado `activeView` en `App.jsx`, asegurando la transición limpia y reseteo de selección de cursos.
- **Vista Base en Blanco (SummaryView / Placeholder)**: Crear un componente base `SummaryView.jsx` (o contenedor de sección) limpio y minimalista que se renderice al hacer click en "Resumen", preparado para recibir contenido futuro.

## Capabilities

### New Capabilities
- `summary-view`: Nueva sección de Resumen en la navegación global de Agente P que renderiza una vista base minimalista en blanco para futuros módulos de resúmenes.

### Modified Capabilities

## Impact

- `frontend/src/components/Sidebar.jsx`: Inclusión del botón "Resumen" con su ícono y estado activo.
- `frontend/src/App.jsx`: Soporte para `activeView === 'summary'` y renderizado de la vista de Resumen.
- `frontend/src/components/SummaryView.jsx`: Nuevo componente de vista base en blanco.
