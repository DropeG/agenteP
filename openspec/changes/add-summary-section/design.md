## Context

El frontend de Agente P cuenta actualmente con un Sidebar primario (`Sidebar.jsx`) que gestiona tres vistas principales: "Mis Ramos" (`ramos`), "Calendario" (`calendar`) y "Configuración" (`settings`), orquestadas por el estado `activeView` en `App.jsx`.

Se busca incorporar una cuarta sección de primer nivel denominada **Resumen**, diseñada para albergar futuras funcionalidades de resúmenes de estudio y síntesis de clases. En esta etapa inicial, la sección debe estar plenamente integrada a nivel de navegación e interfaz, renderizando una vista base en blanco/limpia sin dependencias de red.

## Goals / Non-Goals

**Goals:**
- Añadir el botón "Resumen" en el sidebar global con su ícono representativo (`FileText` de `lucide-react`).
- Manejar la navegación hacia la vista `summary` en `App.jsx`, sincronizando el estado `activeView` y reseteando `selectedCourse` adecuadamente.
- Crear un componente modular `SummaryView.jsx` (o vista base) que renderice una estructura limpia y minimalista, acorde a la guía de estilo de Agente P.
- Asegurar comportamiento responsivo completo (drawer móvil y desktop).

**Non-Goals:**
- Generar o cargar resúmenes reales desde APIs o modelos de lenguaje en esta fase.
- Modificar la lógica existente de las vistas de cursos o calendario.

## Decisions

- **Ubicación en el Sidebar**: Se ubicará después de "Calendario" y antes de "Configuración" (`Mis Ramos` -> `Calendario` -> `Resumen` -> `Configuración`), reflejando el orden de herramientas académicas del estudiante.
- **Ícono de navegación**: Se utilizará `FileText` de `lucide-react`, consistente con los íconos existentes (`BookOpen`, `Calendar`, `Settings`).
- **Componente dedicado (`SummaryView.jsx`)**: Separar la vista en su propio componente en `frontend/src/components/SummaryView.jsx` para facilitar la incorporación progresiva de sub-vistas, filtros y contenido en iteraciones posteriores.

## Risks / Trade-offs

- **[Riesgo]** Vistas vacías pueden parecer incompletas si no tienen estructura visual clara.
  - **Mitigación**: Mantener un diseño limpio y minimalista con un contenedor base y encabezado sutil acorde a la estética editorial del proyecto.
