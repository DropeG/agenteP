## Context

Para mantener a los estudiantes actualizados sin que tengan que leer decenas de anuncios irrelevantes, se implementará un pipeline automatizado de resumen diario. En lugar de usar un enjambre de sub-agentes (Scatter-Gather), se optó por una arquitectura más ligera y eficiente: un único script recolector determinista emparejado con un único agente orquestador que analiza todo en un solo pase.

## Goals / Non-Goals

**Goals:**
- Implementar `fetch_daily_announcements.py` para recolección pura de I/O desde Canvas API.
- Definir un Prompt Goal/Skill detallado para que el Agente Orquestador (Antigravity) actúe como "Editor Jefe", extrayendo fechas y clasificando relevancia.
- Proveer los datos resultantes mediante un contrato JSON estricto (`daily_summary.json`).
- Renderizar los datos dinámicamente en `SummaryView.jsx` con diseño ultra-minimalista y separadores visuales por nivel de urgencia.

**Non-Goals:**
- No se utilizarán librerías de IA pagas (`google-genai`, `openai`) en el backend (scripts Python), cumpliendo estrictamente con la arquitectura de Agente P.
- No se creará una base de datos compleja; un archivo local JSON es suficiente para el resumen efímero del día.

## Decisions

- **Arquitectura Pipeline + 1 Agente**: Se descarta el enfoque de múltiples agentes por ramo debido al bajo volumen de anuncios diarios universitarios (típicamente <15). Un solo pase del agente analizando un JSON consolidado es más rápido, económico e igualmente preciso.
- **Sincronización de Calendario Directa**: El agente tiene la instrucción explícita de usar la CLI de calendario (`calendar_tools.py`) a mitad del proceso si detecta fechas, garantizando que el calendario sea la única fuente de verdad para eventos, independiente del resumen.
- **Contrato JSON Estricto**: Para permitir el diseño `$impeccable`, el agente debe producir un objeto JSON con claves específicas (`critical`, `informative`, `discarded_count`) en lugar de texto libre, facilitando el mapeo en React (Tarjetas Naranjas vs Tarjetas Blancas).

## Risks / Trade-offs

- **[Riesgo]** El agente podría alucinar y mezclar el ramo A con el ramo B en el resumen.
  - **Mitigación**: El script de Python estructurará el raw JSON inyectando el código del curso de forma prominente en cada bloque de anuncio, y el prompt del agente forzará a mantener la clave `course` en la salida.
- **[Riesgo]** La generación de JSON inválido por parte del LLM que rompa el frontend.
  - **Mitigación**: Requerir que el frontend maneje gracefully los errores de parseo de JSON en `SummaryView.jsx`.
