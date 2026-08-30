## Context

Agente P opera con procesos autónomos y programados que corren en segundo plano (como la recolección diaria de anuncios y generación del resumen matutino con `fetch_daily_announcements.py`, y la sincronización de tareas de Canvas). Actualmente, no hay visibilidad desde la interfaz gráfica sobre qué procesos están activos, cuándo se ejecutaron por última vez, ni qué registros produjeron.

Siguiendo los principios **KISS** y **YAGNI**, este diseño implementa un registro liviano y desacoplado en el workspace (`agents/workspace/cron_status.json`) y una vista reactiva de observabilidad bajo la sección de Configuración Avanzada.

## Goals / Non-Goals

**Goals:**
- Proporcionar una arquitectura de datos simple, canónica y local en `agents/workspace/cron_status.json` para rastrear crons, estados y logs.
- Permitir el descubrimiento dinámico de tareas programadas (cualquier nuevo cron añadido al JSON se renderiza automáticamente sin tocar código de React).
- Integrar una navegación intuitiva dentro de Configuración (Configuración Principal -> Configuración Avanzada / Crons -> Detalle de Logs).
- Presentar los logs en un acordeón desplegable por tarjeta con formato de terminal en `JetBrains Mono` y botón para copiar al portapapeles.
- Diseñar la solución para que un **agente orquestador** y sus subagentes puedan actualizar el estado de sus ejecuciones de forma transparente e independiente.

**Non-Goals:**
- No implementar triggers activos (botones de "Ejecutar ahora" o "Pausar/Reanudar") en esta primera fase; el monitor es pasivo de solo lectura.
- No implementar bases de datos adicionales, WebSockets ni dependencias externas complejas.

## Decisions

### Decision 1: Fuente de Datos Canónica Local en JSON (`agents/workspace/cron_status.json`)
- **Elección**: Almacenar el registro de crons y logs en un archivo JSON local en el workspace.
- **Alternativas consideradas**:
  - *Base de datos Supabase / tabla `logs`*: Añadiría overhead de red, requeriría autenticación previa y no funcionaría offline.
  - *Archivos `.log` planos separados*: Requeriría múltiples lecturas y parseo complejo de cadenas de texto en el frontend.
- **Razón**: Máxima simplicidad (KISS), velocidad instantánea en Vite y compatibilidad total con la arquitectura existente (`calendar.json`, `daily_summaries.json`).

### Decision 2: Navegación por Sub-vista en Configuración
- **Elección**: Tarjeta de "Configuración Avanzada: Automatizaciones & Crons" dentro de la vista de Configuración que abre una sub-vista dedicada con botón "← Volver a Configuración".
- **Alternativas consideradas**:
  - *Pestaña global en el Sidebar*: Prohibido por las reglas de `AGENTS.md` (evitar pestañas globales recargadas).
  - *Sección vertical continua en la misma página de Configuración*: Podría saturar la vista principal de configuración con logs largos.
- **Razón**: Mantiene la pantalla principal de Configuración limpia y minimalista, reservando la vista técnica para cuando el usuario la requiera explícitamente.

### Decision 3: Acordeón Desplegable para Logs por Cron
- **Elección**: Cada tarjeta de cron incluye un botón colapsable que despliega su respectivo visor de terminal debajo de la tarjeta.
- **Alternativas consideradas**:
  - *Consola modal emergente*: Interrumpe el flujo visual y es menos amigable en dispositivos móviles.
  - *Consola fija al pie de página*: Ocupa espacio vertical constante y requiere sincronizar selecciones de estado.
- **Razón**: Permite inspeccionar múltiples crons ordenadamente manteniendo el contexto visual de cada tarea.

### Decision 4: Integración con Agente Orquestador y Subagentes
- **Elección**: Cualquier script, agente o subagente ejecutado por el orquestador actualiza la entrada correspondiente en `cron_status.json` registrando timestamps y líneas de log estructuradas.
- **Razón**: Desacopla la lógica de ejecución del frontend y permite que subagentes independientes reporten su estado sin intermediarios complejos.

## Data Model (`cron_status.json`)

```json
{
  "daily_briefing": {
    "id": "daily_briefing",
    "name": "Daily Briefing (Resumen Diario)",
    "description": "Procesa anuncios diarios de Canvas, actualiza el calendario y genera el resumen matutino.",
    "schedule": "0 8 * * *",
    "status": "success",
    "last_run": "2026-08-30T08:00:00-04:00",
    "next_run": "2026-08-31T08:00:00-04:00",
    "logs": [
      {
        "timestamp": "2026-08-30 08:00:01",
        "level": "info",
        "message": "Iniciando escaneo de anuncios en Canvas..."
      },
      {
        "timestamp": "2026-08-30 08:00:03",
        "level": "info",
        "message": "3 nuevos anuncios encontrados."
      },
      {
        "timestamp": "2026-08-30 08:00:05",
        "level": "success",
        "message": "Resumen generado y guardado en daily_summaries.json."
      }
    ]
  }
}
```

## Risks / Trade-offs

- **[Riesgo] Crecimiento excesivo de logs en el JSON**: Si un cron corre miles de veces, el arreglo de `logs` podría volverse muy pesado.  
  → **Mitigación**: Limitar el historial en cada ejecución a los últimos 50-100 registros más recientes (FIFO).
- **[Riesgo] Fallo al cargar el JSON si está vacío o ausente**:  
  → **Mitigación**: El loader del frontend implementa fallback a un objeto vacío o estado inicial seguro.
