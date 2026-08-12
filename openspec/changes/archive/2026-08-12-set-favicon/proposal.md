## Why

El frontend de la aplicación actualmente utiliza la referencia por defecto `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` y la etiqueta de título genérica `<title>frontend</title>`. Reemplazarlo por el logo SVG de Agente P (`agente-p-logo.svg`) y actualizar el título de la página mejora la identidad visual, la coherencia de marca y la experiencia de usuario al identificar la pestaña en el navegador.

## What Changes

- Actualizar el favicon en `frontend/index.html` para usar `/agente-p-logo.svg`.
- Actualizar la etiqueta `<title>` en `frontend/index.html` para mostrar `Agente P`.

## Capabilities

### New Capabilities
- `app-branding`: Configuración del favicon e identidad visual básica del encabezado HTML de la aplicación.

### Modified Capabilities
<!-- Ninguna capacidad existente cambia sus requerimientos de nivel de especificación. -->

## Impact

- **Código Afectado**: `frontend/index.html`.
- **APIs / Dependencias**: Ninguna (reutiliza el asset SVG ya existente en `frontend/public/agente-p-logo.svg`).
