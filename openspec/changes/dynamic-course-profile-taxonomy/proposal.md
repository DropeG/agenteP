## Why

El esquema actual de inicialización de ramos (`profile_course` skill) utiliza una sección rígida `structure` con banderas booleanas hardcodeadas (`has_tareas`, `has_laboratorios`, `has_proyecto`, `has_interrogaciones`). Esto causa fallos de organización cuando una asignatura utiliza categorías de evaluación no estándar (ej: "Actividades Formativas", "Controles", "Quizzes", "Talleres", "Ensayos", "Hitos"), obligando al agente a guardar material directamente en carpetas sueltas desordenadas.

Requerimos un sistema de perfilamiento de cursos dinámico y universal que descubra automáticamente todas las categorías de evaluación de cualquier asignatura desde Canvas (Syllabus/Módulos/Grupos de Tareas) y cree carpetas de workspace limpias y estructuradas dinámicamente.

## What Changes

- **Deprecación de `structure` rígido**: Reemplazar las banderas booleanas duras (`has_tareas`, `has_laboratorios`, etc.) por un arreglo o mapa dinámico de evaluaciones (`evaluations`) en `course_profile.json`.
- **Scaffolding dinámico de directorios**: Actualizar `profile_course` skill para iterar sobre las categorías descubiertas y crear carpetas `agents/workspace/{COURSE_CODE}/{eval.folder}/` para cada tipo de evaluación real del ramo.
- **Descarga y enrutamiento ordenado**: Modificar la lógica de obtención de tareas/evaluaciones para que ubique cada entrega/instrucción dentro de la subcarpeta de su categoría correspondiente (ej: `actividades_formativas/AC01/` en vez de `AC01/` en la raíz).
- **Refactor de ramas creadas previamente**: Reorganizar `IIC2523` y otros ramos existentes para ajustarlos a la nueva taxonomía ordenada.

## Capabilities

### New Capabilities
- `course-taxonomy-profiling`: Descubrimiento automático, categorización dinámica y scaffolding de taxonomía de carpetas para asignaturas UC de forma universal sin hardcodear tipos de evaluación.

### Modified Capabilities
(Ninguna exigencia a capacidades existentes ha cambiado a nivel de contrato)

## Impact

- `.agents/skills/profile_course/SKILL.md`: Actualización del flujo de profiling, JSON schema de `course_profile.json` y lógica de scaffolding.
- `agents/core/canvas_tools.py` / `agents/workspace/`: Estructura de carpetas bajo `agents/workspace/{COURSE_CODE}/`.
- No afecta las claves de API ni componentes del frontend react, manteniendo compatibilidad con las tarjetas de ramo.
