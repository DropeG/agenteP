## 1. CSS & Foundation

- [x] 1.1 Inyectar script bloqueante en `frontend/index.html` (dentro de `<head>`) para leer `agente_p_theme` de `localStorage` y aplicar `data-theme`.
- [x] 1.2 Agregar bloque `[data-theme="light"]` en `frontend/src/index.css`.
- [x] 1.3 Agregar bloque `[data-theme="dark"]` en `frontend/src/index.css`.
- [x] 1.4 Agregar bloque `[data-theme="monokai"]` en `frontend/src/index.css`.
- [x] 1.5 Agregar bloque `[data-theme="dracula"]` en `frontend/src/index.css`.
- [x] 1.6 Agregar bloque `[data-theme="owca"]` en `frontend/src/index.css`.
- [x] 1.7 Agregar bloque `[data-theme="coffee"]` en `frontend/src/index.css`.

## 2. Componentes UI

- [x] 2.1 Crear archivo `ThemeSelector.jsx` en la carpeta de componentes (ej. `frontend/src/components/ThemeSelector.jsx`).
- [x] 2.2 Diseñar el layout del `ThemeSelector` mostrando los 7 temas disponibles.
- [x] 2.3 Implementar la lógica de onClick en `ThemeSelector` para cambiar el atributo `data-theme` en `document.documentElement` y actualizar `localStorage`.

## 3. Integración

- [x] 3.1 Importar y renderizar `ThemeSelector` dentro de la vista principal de Configuración (Settings).
- [x] 3.2 Verificar que el selector resalte visualmente el tema actualmente activo.
- [x] 3.3 Probar la recarga de página para confirmar que no ocurre FOUC y que la selección persiste.
