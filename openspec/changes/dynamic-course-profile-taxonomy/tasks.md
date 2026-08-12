## 1. Skill & Schema Updates

- [x] 1.1 Actualizar `.agents/skills/profile_course/SKILL.md` eliminando la sección rígida `structure` y reemplazándola por el arreglo dinámico `evaluations` con campos `key`, `name`, `folder`, `weight` y `details`.
- [x] 1.2 Actualizar las instrucciones de scaffolding en `profile_course/SKILL.md` para iterar dinámicamente sobre la lista `evaluations` y crear carpetas `agents/workspace/{COURSE_CODE}/{eval.folder}/`.

## 2. Canvas Tools & Setup Assignment Refactoring

- [x] 2.1 Modificar `setup_assignment` en `agents/core/canvas_tools.py` para consultar el `course_profile.json` del ramo y determinar la subcarpeta de categoría correspondiente en vez de guardar directamente en la raíz de la asignatura.
- [x] 2.2 Añadir mapeo semántico o por `assignment_group_id` en `canvas_tools.py` para clasificar asignaciones en su categoría correspondiente.

## 3. Migration & Verification

- [x] 3.1 Reorganizar la carpeta `agents/workspace/IIC2523/` moviendo `AC01/` a `agents/workspace/IIC2523/actividades_formativas/AC01/` y regenerando `course_profile.json` con la nueva estructura dinámica.
- [x] 3.2 Probar la ejecución de `profile_course` y `setup_assignment` con 1 ramo para verificar que las carpetas se scaffolding y enrutan correctamente de principio a fin.
