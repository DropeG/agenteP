# Design System

## Visual Theme & Color Palette

Agente P utiliza un sistema de diseño ultra-minimalista centrado en un 95% en tonos neutros cálidos/crema, con toques sutiles del personaje Perry el Ornitorrinco ($\le$ 5%).

### Color Tokens

```css
/* Logo & Perry Palette */
--brand-turquoise: #08ACB1;
--brand-orange: #F99814;
--brand-hat-brown: #8B3F0A;
--brand-dark-brown: #45240F;
--brand-cream: #FAF7F2;

/* Surface & Backgrounds */
--color-page-bg: #FAF7F2;
--color-surface-bg: #F5F1E8;
--color-elevated-surface: #FFFFFF;
--color-border: #E8E2D7;
--color-border-hover: #D8CFBE;

/* Text & Ink */
--color-text-primary: #45240F;
--color-text-secondary: #745A48;
--color-text-muted: #9E8876;

/* Actions & Focus */
--color-action-primary: #08ACB1;
--color-action-primary-hover: #068E93;
--color-focus-ring: #08ACB1;

/* Fonts */
--font-sans: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

## Typography

- **Body & UI**: `Inter` (pesos: 400, 500, 600, 700).
- **Código & Siglas de Ramos**: `JetBrains Mono` (pesos: 400, 500, 600).

## Components

### Sidebar (`Sidebar.jsx`)
- Ancho fijo de 240px en escritorio (o colapsable).
- Logo 2D de Agente P en la parte superior.
- Navegación simplificada: **Mis Ramos** y **Configuración**.
- Encabezado móvil colapsable con menú hamburguesa en pantallas $<768px$.

### Tarjeta de Ramo (`CourseCard.jsx`)
- Tarjeta estática elevable en superficie blanca (`#FFFFFF`) con borde de 1px (`#E8E2D7`) y radio de borde de 12px.
- Muestra la **Sigla** del ramo en fuente Mono con color turquesa (`#08ACB1`).
- Muestra el **Nombre** del ramo en fuente Inter semibold.

### Grid de Ramos (`CourseGrid.jsx`)
- Layout en cuadrícula responsiva: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`.
- Encabezado claro con el número de cursos activos.

## Layout & Responsive Breakpoints

- **Escritorio ($\ge 1024px$)**: Sidebar fijo de 240px a la izquierda, área principal con `margin-left: 240px`.
- **Tablet ($768px - 1023px$)**: Sidebar compacto de 200px.
- **Móvil ($<768px$)**: Encabezado superior fijo de 60px con botón hamburguesa, sidebar en drawer superpuesto.
