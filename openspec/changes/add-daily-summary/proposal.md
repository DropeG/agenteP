## Why

Los estudiantes universitarios reciben múltiples anuncios de Canvas cada día. Leer todos genera fricción, saturación y el riesgo constante de pasar por alto fechas importantes o cambios urgentes. Agente P requiere un pipeline automatizado que filtre este ruido, rescate fechas críticas hacia el calendario de forma autónoma y entregue un resumen clasificado y ultra-minimalista.

## What Changes

- **Script Recolector Determinista:** Creación de un script en Python (`fetch_daily_announcements.py`) que utiliza la API de Canvas para descargar exclusivamente los anuncios de las últimas 24 horas sin consumir tokens de IA.
- **Análisis Agentil Programado (Cron):** Un flujo orquestado donde la IA lee los anuncios en crudo, descarta el ruido, ejecuta la herramienta de terminal de calendario si hay fechas nuevas y sintetiza el resto.
- **Contrato de Datos JSON:** El análisis producirá un archivo estrictamente estructurado en `workspace/daily_summary.json` categorizando los datos en `critical`, `informative` y conteos de `discarded_count`.
- **Renderizado Visual ($impeccable):** El frontend (`SummaryView.jsx`) consumirá este JSON para renderizar tarjetas minimalistas separadas por relevancia visual, respetando las directrices de diseño de Agente P (acentos Perry solo para lo urgente).

## Capabilities

### New Capabilities
- `daily-summary-pipeline`: Flujo completo desde la extracción determinista de anuncios diarios de Canvas, el análisis estructurado del agente mediante clasificación de relevancia y extracción de eventos, hasta la visualización en la interfaz de usuario de Resumen.

### Modified Capabilities

## Impact

- `agents/core/fetch_daily_announcements.py` (Nuevo script)
- `workspace/daily_summary.json` (Nuevo artefacto de estado)
- `frontend/src/components/SummaryView.jsx` (Modificación sustancial para renderizado dinámico de datos)
- `agents/core/calendar_tools.py` (Se reutiliza su función `upsert-event` por parte del agente)
