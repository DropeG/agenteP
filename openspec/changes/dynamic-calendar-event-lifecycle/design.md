## Context

Las fechas de exámenes, tareas, interrogaciones y entregas de proyecto cambian frecuentemente durante el semestre por feriados, ajustes de la dirección de pregrado o avisos de profesores. Sin un modelo de ciclo de vida transparente, las actualizaciones podríando duplicar eventos o perder la razón del cambio.

## Goals / Non-Goals

**Goals:**
- Actualizar la skill `profile_course` (Paso 4.5) para formalizar la Fase 1 del ciclo de vida (línea base del Syllabus).
- Asegurar que `calendar_tools.py upsert-event` se utilice como el único método idempotente para crear o actualizar fechas.
- Permitir que El Guardián y otras rutinas actualicen eventos existentes sin crear duplicados.

**Non-Goals:**
- No modificar el esquema JSON de Supabase ni alterar la vista de React.

## Decisions

### Decision 1: Idempotencia basada en Slug Unique Identifier (`course_code-slug_title`)
Cada evento en `calendar.json` utiliza un ID unívoco (ej. `iic2523-ac01`, `iic2173-i1`). Al llamar a `upsert_event`, si el ID ya existe, actualiza los campos en lugar de insertar una entrada repetida.

### Decision 2: Trazabilidad por `source` y `last_updated`
Los eventos registran `source`: `"syllabus"`, `"canvas_assignment"`, o `"announcement"`, junto con la fecha de última modificación `last_updated`.

## Risks / Trade-offs

- **[Riesgo]** Múltiples eventos con títulos muy parecidos.
  - **Mitigación**: `slugify` genera identificadores únicos combinando la sigla del ramo y el título sanitizado.
