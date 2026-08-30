## Why

Permitir a los usuarios personalizar el entorno visual de la aplicación según sus preferencias o entorno de trabajo (ej: programación, lectura nocturna, accesibilidad), integrando temas muy populares como Monokai, Dracula o un modo alto contraste, mientras mantenemos el actual tema de "Agente P" como base.

## What Changes

- Se añadirá una paleta de 6 nuevos temas utilizando variables CSS nativas, aprovechando la estructura actual de `:root`.
- Se implementará un componente `ThemeSelector` en la vista de configuración para elegir visualmente entre los temas.
- Se agregará lógica para persistir la selección en `localStorage` y prevenir el FOUC (Flash of Unstyled Content).

## Capabilities

### New Capabilities
- `theme-selector`: Capacidad para previsualizar, seleccionar y persistir globalmente una paleta de colores o "tema" en toda la interfaz.

### Modified Capabilities
- (Ninguna)

## Impact

- **UI/Componentes:** Nuevo componente de selección en la sección de configuración.
- **CSS:** Modificación de `frontend/src/index.css` para soportar múltiples bloques `[data-theme]`.
- **HTML:** Pequeño script inyectado en `frontend/index.html` para la lectura síncrona del tema desde `localStorage`.
