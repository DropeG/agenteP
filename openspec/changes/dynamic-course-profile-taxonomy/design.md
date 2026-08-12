## Context

Actualmente, el profiling de ramos en AgenteP se realiza a través de la skill `profile_course`, la cual genera `agents/workspace/{COURSE_CODE}/course_profile.json`. En su diseño original, el objeto incluía un mapa fijo llamado `structure`:

```json
"structure": {
  "has_tareas": false,
  "has_laboratorios": false,
  "has_proyecto": true,
  "has_interrogaciones": true
}
```

Esto generó un problema práctico en ramos como IIC2523 (Sistemas Distribuidos), donde las evaluaciones no se llaman "tareas" ni "laboratorios", sino "Actividades Formativas (AC)" y "Controles". Al no existir estas categorías en la estructura rígida, las carpetas no se scaffoldearon y el material de la AC01 se descargó en una carpeta suelta no categorizada.

## Goals / Non-Goals

**Goals:**
- Eliminar la propiedad `structure` basada en booleanos estáticos en `course_profile.json`.
- Implementar un descubrimiento dinámico de categorías de evaluación que convierta cualquier nombre de categoría (ej: "Actividades Formativas") en un `key` y nombre de carpeta `folder` sanitizados en `snake_case`.
- Actualizar `profile_course` skill (`.agents/skills/profile_course/SKILL.md`) para realizar scaffolding dinámico de carpetas basado en las categorías encontradas.
- Actualizar la lógica de guardado y descarga de tareas (`setup_assignment` en `canvas_tools.py` u otras herramientas) para que guarde automáticamente en la carpeta de la categoría correcta (`{COURSE_CODE}/{category_folder}/{assignment_name}/`).
- Reorganizar las carpetas existentes (ej. IIC2523) para adaptar la estructura a la nueva taxonomía limpia.

**Non-Goals:**
- No alterar la integración con Supabase ni los contratos de API del backend.
- No requerir cambios en el frontend de React (las tarjetas de ramos consumen `course_code` y `course_name` sin depender de las banderas estáticas de `structure`).

## Decisions

### Decision 1: Estructura dinámicamente extensible en `course_profile.json`
Sustituir `structure` por un arreglo de objetos `evaluations`:
```json
"evaluations": [
  {
    "key": "actividades_formativas",
    "name": "Actividades Formativas",
    "folder": "actividades_formativas",
    "weight": 17.5,
    "details": "25% de la nota ACyES"
  }
]
```
- **Razón**: Permite representar cualquier tipo de evaluación sin importar el nombre que el profesor utilice en Canvas o en el Syllabus.
- **Alternativas consideradas**: Mantener booleanos dinámicos en un diccionario `has_X`. Se descartó porque los booleanos no capturan el nombre formal, peso porcentual ni la ruta del directorio (`folder`).

### Decision 2: Sanitización y Mapeo `folder`
Convertir cualquier categoría identificada a un nombre de directorio seguro (`snake_case` sin tildes ni caracteres especiales). Ej: "Actividades Formativas (AC)" -> `actividades_formativas`.

### Decision 3: Categorización Semántica Inteligente de Tareas
Cuando se ejecuta `setup-assignment --course CODE --assignment-name NAME`, el agente busca la categoría a la que pertenece la tarea en Canvas (a través del `assignment_group_id` o coincidencia semántica) y la guarda dentro de `agents/workspace/{CODE}/{folder}/{safe_name}/`.

## Risks / Trade-offs

- **[Riesgo]** Ramos antiguos en workspace pueden tener archivos en la raíz antigua.
  - **Mitigación**: Ejecutar un script o paso de migración limpia que mueva las carpetas existentes (como `IIC2523/AC01`) a su subcarpeta correspondiente (`IIC2523/actividades_formativas/AC01/`).
