## Context

El frontend de Agente P es una SPA basada en React con Vite. En `frontend/index.html` se define la plantilla HTML base servida al cliente. La carpeta `frontend/public/` contiene los assets estáticos que Vite expone en la raíz (`/`).

Actualmente, `frontend/public/agente-p-logo.svg` ya existe y contiene la versión gráfica vectorial oficial de Agente P.

## Goals / Non-Goals

**Goals:**
- Configurar el favicon de la aplicación web en `frontend/index.html` usando `/agente-p-logo.svg`.
- Actualizar el título del documento HTML a `Agente P`.

**Non-Goals:**
- Generar nuevos assets o modificar la ilustración SVG existente.
- Reorganizar la estructura de carpetas en `frontend/public/`.

## Decisions

### Decision 1: Uso de SVG nativo frente a PNG/ICO
- **Elección**: Reemplazar href con `/agente-p-logo.svg` y mantener `type="image/svg+xml"`.
- **Alternativas consideradas**: Convertir a `.ico` o `.png`.
- **Razón**: Los favicons SVG se adaptan de forma vectorial nítida en pantallas de alta densidad de píxeles (Retina/4K) y son soportados nativamente por todos los navegadores modernos.

## Risks / Trade-offs

- **[Riesgo] Caching del navegador**: El navegador podría mantener en caché el favicon viejo temporalmente.
  - **Mitigación**: Forzar refresco en navegador (Cmd+Shift+R) al validar localmente.
