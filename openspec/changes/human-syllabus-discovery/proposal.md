## Why

Las implementaciones previas de búsqueda de Syllabus dependían de supuestos frágiles (asumir que el programa siempre estaba en la propiedad HTML nativa `syllabus_body` de Canvas o en grupos de tareas automáticos). En la práctica real de la UC, los profesores publican el programa en 4 fuentes vivas distintas: Página de Inicio (Wiki/Módulos), Módulos e Ítems, Archivos subidos, o Anuncios con links externos (ej. GitHub).

Para garantizar una búsqueda verdaderamente universal y robusta, la skill `profile_course` debe implementar un flujo de **Búsqueda Agentil Humanoide** que escanee las 4 fuentes vivas y realice una **Corroboración Semántica de Contexto** sobre cada candidato para descartar falsos positivos y confirmar el verdadero Programa del Curso.

## What Changes

- **Flujo de Búsqueda Humanoide en 4 Fuentes Vivas**: Actualizar `profile_course` skill (`.agents/skills/profile_course/SKILL.md`) para explorar ordenadamente:
  1. Página de Inicio (`front_page`)
  2. Módulos e Ítems (`modules`)
  3. Archivos del curso (`files`)
  4. Anuncios y links externos (`announcements`)
- **Corroboración Semántica de Contexto**: Exigir que el agente abra y valide el contenido del candidato confirmando la existencia de marcas de identidad de un Syllabus (sección de Evaluaciones, Ponderaciones, Objetivos o Reglas del Curso) antes de guardarlo como `programa_del_curso.md` / `programa_del_curso.pdf`.
- **Descarte de Falsos Positivos**: Filtrar archivos de clases (ej. `Programación.pdf`) o menciones fuera de contexto.

## Capabilities

### New Capabilities
- `human-syllabus-discovery`: Algoritmo de exploración humanoide de 4 fuentes vivas de Canvas con verificación semántica de contexto para localizar el Syllabus de cualquier asignatura sin importar dónde lo publique el equipo docente.

## Impact

- `.agents/skills/profile_course/SKILL.md`: Reestructuración completa de los Pasos 1 y 2.
- `.agents/AGENTS.md`: Registro permanente de la directriz de exploración humanoide en 4 fuentes vivas.
