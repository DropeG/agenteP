# Design

## Visual System

Este sistema visual define la estética ultra-minimalista de **Agente P**. La interfaz se compone casi en su totalidad de elementos en escala de grises con tipografía de alto contraste, utilizando la paleta de colores de Perry el Ornitorrinco estrictamente como acentos sutiles (estados activos y alertas).

### Color Palette (OKLCH)

```css
:root {
  /* Fondo y Neutros (Minimalismo Extremo) */
  --bg-primary: oklch(0.99 0.002 0);     /* Blanco puro para el área de trabajo */
  --bg-secondary: oklch(0.99 0.002 0);   /* Fondo blanco */
  --bg-tertiary: oklch(0.96 0.005 195);  /* Gris neutro muy claro para hovers y campos */
  
  --text-primary: oklch(0.18 0.01 195);   /* Negro/Gris muy oscuro para máxima legibilidad */
  --text-secondary: oklch(0.45 0.01 195); /* Gris medio para metadatos */
  --text-muted: oklch(0.65 0.01 195);     /* Gris claro para placeholders e íconos */
  
  --border-clean: oklch(0.91 0.006 195);  /* Borde delgado gris claro (#e4e4e7) */

  /* Acentuación Perry el Ornitorrinco (≤5% del total de la interfaz) */
  --accent-primary: oklch(0.62 0.14 195);  /* Turquesa Perry (solo para logo y estados activos) */
  --accent-secondary: oklch(0.72 0.20 50);   /* Naranja Pico (solo para alertas críticas o exámenes) */
  --accent-dark: oklch(0.35 0.08 20);    /* Marrón Sombrero */
  
  /* Status Colors */
  --color-success: oklch(0.65 0.18 140);
  --color-warning: var(--accent-secondary);
  --color-danger: oklch(0.57 0.21 29);
}
```

### Typography

- **Sans-Serif**: `Inter`, system-ui, sans-serif.
- **Monospace**: `JetBrains Mono`, monospace (usado únicamente para consola de logs).
- **Escala**:
  - Títulos principales: `1.75rem` (semi-bold)
  - Subtítulos / Títulos de secciones: `1.25rem` (medium)
  - Texto base: `0.95rem` (regular, interlineado `1.5`)
  - Etiquetas pequeñas / Metadatos: `0.8rem`

### Layout & Component Architecture

1. **Barra Lateral (Sidebar)**:
   - Reducida al mínimo absoluto.
   - Contiene únicamente el logo de Perry en 2D en la parte superior, y dos botones de navegación: "Mis Ramos" y "Configuración".
   - Al pie, un indicador de estado del servidor en un color de acento muy discreto.

2. **Grid de Ramos**:
   - Tarjetas planas (`border: 1px solid var(--border-clean)`) con esquinas sutiles (`border-radius: var(--border-radius-sm)`).
   - Sin sombras por defecto. En hover/active se dibuja un borde de color turquesa Perry (`var(--accent-primary)`) y una elevación óptica muy leve.
   - Contenido de la tarjeta: Únicamente la Sigla (ej: `MAT1630`) y el Nombre (ej: `Cálculo III`) con tipografía limpia y espaciada.

3. **Vista de Detalle del Ramo (Contexto Expandido)**:
   - Al hacer click en una tarjeta de ramo en la página principal, se despliega o expande el panel contextual de ese ramo justo debajo.
   - Este panel contiene:
     - **Tareas y Entregas**: Listado de tareas Canvas pendientes de ese ramo con el estado del agente (Pendiente, Resolviendo, Borrador Listo).
     - **Consola del Agente**: Logs de ejecución del agente en tiempo real para ese curso.
     - **Resúmenes**: Documentos y slides resumidas automáticamente para ese curso.
     - **Calendario del Ramo**: Fechas importantes del curso.

## Accessibility

- Contraste superior a 4.5:1 en todo el texto.
- Navegación por teclado completa (`tabIndex={0}`, focos visibles claros en turquesa).
- Animaciones suaves de apertura/despliegue (`fadeIn`), respetando la preferencia del sistema de movimiento reducido.
