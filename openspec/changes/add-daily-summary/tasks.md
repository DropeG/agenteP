## 1. Backend & Recolección (I/O)

- [x] 1.1 Crear `agents/core/fetch_daily_announcements.py` para consultar la API de Canvas y guardar anuncios de las últimas 24 horas en un JSON temporal.

## 2. Lógica Agentil (Prompt & Triage)

- [x] 2.1 Crear el archivo de skill/prompt `agents/skills/daily_briefing/SKILL.md` con las instrucciones maestras del "Editor Jefe" (incluyendo uso de `calendar_tools.py` y formato de salida JSON).
- [x] 2.2 Escribir script o configurar el cron system/`schedule` para ejecutar la secuencia (recolección -> análisis -> escritura de `workspace/daily_summary.json`).

## 3. Frontend & Visualización ($impeccable)

- [x] 3.1 Actualizar `frontend/src/components/SummaryView.jsx` para leer y parsear `agents/workspace/daily_summary.json`.
- [x] 3.2 Implementar el renderizado visual de la zona "Crítica" usando tarjetas con acento naranja (estilo Perry) para fechas y urgencias.
- [x] 3.3 Implementar el renderizado de la zona "Informativa" (blanco/negro) y el footer sutil para el contador de anuncios descartados (`discarded_count`).
- [x] 3.4 Añadir manejo de estado vacío (Empty State) para los días en que no se generó resumen o hubo 0 anuncios.
