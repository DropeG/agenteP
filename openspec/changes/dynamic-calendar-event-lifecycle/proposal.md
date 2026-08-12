## Why

Las fechas de evaluaciones universitarias son dinámicas y vivas a lo largo de un semestre (aplazamientos, modificaciones por feriados, nuevas entregas imprevistas publicadas en anuncios). Para mantener el Calendario Maestro del estudiante (`agents/workspace/calendar.json`) 100% fiel a la realidad sin duplicar eventos ni perder la trazabilidad de los cambios, se requiere formalizar la regla del **Ciclo de Vida de Eventos en 3 Fases**.

## What Changes

- **Paso 4.5 en `profile_course` (`.agents/skills/profile_course/SKILL.md`)**: Formalizar la fase de línea base inicial del calendario registrando eventos del Syllabus con `source: "syllabus"`.
- **Directriz de Trazabilidad e Idempotencia (`.agents/AGENTS.md`)**: Reforzar la regla obligatoria para que `profile_course`, `setup_assignment` y `El Guardián` utilicen la función idempotente `upsert-event` de `calendar_tools.py` con trazabilidad de origen (`syllabus` -> `canvas_assignment` -> `announcement`).
- **Registro de Razones de Reagendamiento**: Permitir que cuando se detecte un aplazamiento en vivo (vía anuncio o Canvas API), el evento se actualice con la nueva fecha y se registre el motivo en el campo `details`.

## Capabilities

### New Capabilities
- `dynamic-calendar-event-lifecycle`: Ciclo de vida dinámico e idempotente de eventos del calendario maestro con trazabilidad de fuente (`syllabus`, `canvas_assignment`, `announcement`) y soporte para reagendamientos y aplazamientos en vivo.

## Impact

- `.agents/skills/profile_course/SKILL.md`: Actualización del Paso 4.5.
- `.agents/AGENTS.md`: Refuerzo de la directriz de extracción y actualización de fechas al calendario maestro.
