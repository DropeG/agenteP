## Context

El comportamiento anterior de `profile_course` asumía equivocadamente que la propiedad `syllabus_body` de Canvas o una búsqueda rígida de archivos traería el programa del curso. El análisis real de 5 asignaturas activas de la UC demostró que cada equipo docente publica el programa en lugares distintos:
- IIC2173: Módulo "Reglas del curso" -> PDF enlazado.
- IIC2213: Módulo "Administrativo" -> `programa.pdf`.
- EYP1027: Módulo "Presentaciones de Clases" -> `Programación.pdf` (diapositivas, no el programa) vs programa real.
- IIC2513: Módulo "❗Importante" -> `Programa.pdf`.
- IIC2523: Anuncio de Bienvenida -> Repositorio externo en GitHub.

## Goals / Non-Goals

**Goals:**
- Reestructurar el Paso 1 y Paso 2 de `.agents/skills/profile_course/SKILL.md` para formalizar el algoritmo de Búsqueda Agentil Humanoide en 4 fuentes vivas.
- Definir un protocolo obligatorio de Corroboración Semántica de Contexto (verificación de marcas de identidad de un Syllabus: Evaluaciones, Ponderaciones, Fechas, Profesores, Normas).
- Garantizar que los falsos positivos (como clases o diapositivas) sean descartados de forma transparente.

**Non-Goals:**
- No alterar la base de datos de Supabase ni las APIs de React del frontend.

## Decisions

### Decision 1: Inspección de 4 Fuentes Vivas en Paralelo o Secuencia Priorizada
1. `Página de Inicio (Wiki / default_view)`
2. `Módulos e Ítems`
3. `Archivos de la asignatura`
4. `Anuncios y enlaces externos`

### Decision 2: Marcas de Identidad para la Corroboración Semántica
Un candidato solo se valida como el verdadero Syllabus si su texto contiene al menos 2 de las siguientes marcas estructurales:
- Sección de Evaluaciones o Cálculo de Nota Final (`Ncalc`, `NF =`, `Ponderaciones`, `Interrogaciones`, `Tareas`, `Controles`, `Proyecto`).
- Sección de Objetivos / Resultados de Aprendizaje.
- Sección de Equipo Docente (Profesores / Ayudantes).
- Sección de Integridad Académica o Normas del Curso.

## Risks / Trade-offs

- **[Riesgo]** Cursos sin ningún programa subido en Canvas ni enlaces externos.
  - **Mitigación**: Registrar advertencia clara en `course_profile.json` indicando que no se detectó un Syllabus oficial y recurrir al fallback seguro de Assignment Groups.
