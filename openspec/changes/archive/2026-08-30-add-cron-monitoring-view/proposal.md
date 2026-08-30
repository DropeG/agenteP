## Why

A medida que Agente P crece con tareas periódicas y automatizaciones en segundo plano (como el `daily_briefing` de anuncios y el calendario), no existe actualmente una interfaz dentro de la plataforma para observar el estado de ejecución, periodicidad y registros (logs) de estos procesos. 

Esta propuesta introduce una sección de "Configuración Avanzada / Automatizaciones & Crons" para ofrecer monitoreo pasivo en tiempo real con cero sobrecarga técnica (KISS & YAGNI).

## What Changes

- **Esquema de Estado de Crons (`agents/workspace/cron_status.json`)**: Definición canónica y auto-descubrible de los crons registrados, su cadencia cron, estado (`success`, `running`, `error`, `idle`), última y próxima corrida, e historial de logs.
- **Acceso Avanzado en Configuración (`frontend/src/components/ThemeSelector.jsx` / `App.jsx`)**: Añade un bloque de "Configuración Avanzada" con una tarjeta interactiva para ingresar a la vista de Automatizaciones & Crons.
- **Vista de Monitoreo de Crons (`frontend/src/components/CronMonitoringView.jsx`)**: Componente reactivo que renderiza dinámicamente cada cron registrado, su estado visual y un acordeón desplegable para consultar sus logs en fuente `JetBrains Mono` con soporte para copiar al portapapeles.
- **Inicialización del Cron de Resumen Diario (`daily_briefing`)**: Configuración de los metadatos y logs iniciales para el cron encargado de actualizar la sección Resumen de Canvas.

## Capabilities

### New Capabilities
- `cron-monitoring-view`: Interfaz y capa de datos para visualizar el estado, periodicidad y consola de logs de las automatizaciones y cron jobs registrados en el workspace.

### Modified Capabilities
<!-- Ningún cambio a requisitos de especificaciones existentes -->

## Impact

- **Frontend**: Nuevo componente `CronMonitoringView.jsx`, integración en `App.jsx` bajo el flujo de navegación de `Settings`, y loader o import directo de `cron_status.json`.
- **Backend / Workspace**: Nuevo archivo canónico `agents/workspace/cron_status.json`.
- **Compatibilidad**: 100% responsivo, respeta los 7 temas (`data-theme`) y las directrices de diseño sin dependencias externas.
