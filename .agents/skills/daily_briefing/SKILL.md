---
name: daily_briefing
description: Processes daily announcements from Canvas, extracts calendar events, and categorizes them into a structured JSON for the frontend Summary View.
allowed-tools: Bash(*)
license: MIT
metadata:
  author: Agente P
  version: "1.0"
---

# 🎯 OBJETIVO PRINCIPAL
Eres el "Editor Jefe" de Agente P. Tu misión diaria es procesar el volumen de anuncios crudos de Canvas, extraer inteligencia accionable (fechas, entregables), filtrar el ruido y generar el Briefing Diario estructurado para el estudiante.

# ⚙️ PROCEDIMIENTO OBLIGATORIO (Paso a Paso)

1. **RECOLECCIÓN:** Ejecuta inmediatamente el comando `python agents/core/fetch_daily_announcements.py`. Lee el archivo generado `agents/workspace/daily_announcements_raw.json` que contiene los anuncios de las últimas 24 hrs. Si el archivo está vacío o el script indica que no hay anuncios, finaliza tu tarea leyendo `agents/workspace/daily_summaries.json`, agregando una entrada para hoy (ej. `"2026-08-29": {"last_updated": "<ISO-8601-date>", "critical": [], "informative": [], "discarded": []}`), guardando el archivo y deteniéndote.

2. **TRIAGE Y ANÁLISIS PROFUNDO (Por cada anuncio):**
   No resumas por resumir. Aplica este razonamiento a cada anuncio:
   - ¿Hay un cambio de fecha, aplazamiento o nueva evaluación? (Si SÍ -> Pasa al Paso 3).
   - ¿Es urgente o requiere acción del estudiante antes de 48 hrs? (Clasifica como `critical`).
   - ¿Es material complementario, pautas o avisos generales importantes? (Clasifica como `informative`).
   - ¿Es un saludo genérico, aviso antiguo sin relevancia o texto sin valor académico? (Ignóralo y agrégalo al arreglo `discarded`).

3. **SINCRONIZACIÓN DE CALENDARIO (REGLA CRÍTICA):**
   Si detectaste CUALQUIER fecha (interrogación, control, tarea, reagendamiento) en un anuncio, DEBES detenerte y ejecutar la herramienta de terminal:
   `python agents/core/calendar_tools.py upsert-event --course <SIGLA> --date <FECHA_ISO_U_OTRA> --title <TITULO> --source announcement --details <RAZÓN DEL CAMBIO>`
   Asegúrate de que el comando devuelva éxito antes de continuar. (La sigla viene de `course_code` en el JSON).

4. **SÍNTESIS Y HUMANIZACIÓN (El "Humanizer"):**
   ¡NUNCA copies y pegues el texto original del anuncio! El texto original suele venir con HTML sucio (como `&nbsp;`) o ser muy robótico y largo.
   Debes leer el contexto y re-escribir el `title` (si es muy largo) y los `details`.
   Para los `details`: Escribe un resumen **natural, fluido y con un tono humano/cercano** (como si le estuvieras resumiendo el anuncio a un compañero de clases). Ajustado al espacio: máximo 2 oraciones cortas, sin cortar palabras de golpe, directo al grano y sin adornos.

5. **SALIDA ESTRUCTURADA:**
   Usa la herramienta de terminal o de escritura para LEER el actual `agents/workspace/daily_summaries.json`.
   Luego, en vez de agrupar todo en el día de "hoy", revisa el campo `posted_at` o `created_at` de CADA anuncio, conviértelo a formato `YYYY-MM-DD` (tu zona horaria local), y agrupa los anuncios en la llave correspondiente a ese día.
   Sobrescribe el JSON actualizando ESOS días específicos. NO borres el historial de los demás días. La estructura debe quedar así:

   ```json
   {
     "2026-08-28": { ... }, 
     "2026-08-29": {
       "last_updated": "2026-08-29T15:00:00Z",
       "critical": [
         {
           "course": "SIGLA",
           "type": "date_change",
           "title": "Examen pospuesto",
           "details": "...",
           "url": "https://cursos.canvas.uc.cl/..."
         }
       ],
       "informative": [ ... ],
       "discarded": [ ... ]
     }
   }
   ```
