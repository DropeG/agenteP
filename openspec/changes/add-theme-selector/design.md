## Context

Actualmente el proyecto utiliza variables CSS alojadas en `:root` en `frontend/src/index.css`. Estas variables (`--color-page-bg`, `--color-action-primary`, etc.) definen un tema base llamado "Agente P". Se requiere implementar un selector que permita cambiar este tema dinámicamente entre varias paletas populares y preservar dicha configuración en `localStorage`.

## Goals / Non-Goals

**Goals:**
- Implementar 6 temas adicionales al predeterminado.
- Almacenar el tema preferido en `localStorage` (`agente_p_theme`).
- Modificar el atributo `data-theme` del elemento `<html>` global para activar los estilos.
- Prevenir el parpadeo blanco (FOUC) durante el primer render.

**Non-Goals:**
- No refactorizaremos componentes de React para forzar colores hardcodeados; los componentes deben ser completamente agnósticos al tema activo y seguir utilizando las variables CSS globales.
- No se incluirá una lógica de "Sincronización con el sistema (prefers-color-scheme)" por el momento; será únicamente una selección manual explicita.

## Decisions

- **Estrategia CSS:** Se utilizarán selectores de atributos en CSS (ej. `[data-theme="monokai"]`) en el archivo `index.css`. Esto aprovecha la arquitectura existente de variables CSS sin requerir bibliotecas como styled-components.
- **Prevención FOUC:** Se inyectará un pequeño script bloqueante en el `<head>` del archivo `index.html` que lea `localStorage` y aplique el atributo de inmediato antes del renderizado de React.
- **Selector de UI:** Se creará un componente dedicado `ThemeSelector.jsx` que mostrará tarjetas (swatches) que se iteran desde un array de configuración interno.

## Risks / Trade-offs

- **FOUC script en index.html:** Agregar scripts bloqueantes en el head se considera mala práctica para performance, pero este script es minúsculo (<1kb) y se ejecuta localmente, por lo que el impacto es imperceptible y la ganancia en UX al evitar el parpadeo blanco lo justifica por completo.
