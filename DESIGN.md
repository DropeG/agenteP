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

- **Body & UI**: `var(--font-sans)` (`Inter`, pesos: 400, 500, 600, 700).
- **Código & Siglas de Ramos & Datos Numéricos**: `var(--font-mono)` (`JetBrains Mono`, pesos: 400, 500, 600).

> **Regla de Oro**: Todos los componentes deben usar `var(--font-sans)` y `var(--font-mono)` en lugar de declarar nombres de fuentes directas.

## Multi-Theme System (`data-theme`)

Agente P soporta 7 temas dinámicos mediante atributos de datos `data-theme` en la etiqueta `<html>`:

1. **Agente P** (`:root` default): Crema cálido con acento turquesa y marrón de Perry.
2. **Light** (`data-theme="light"`): Blanco puro con acento azul moderno.
3. **Dark** (`data-theme="dark"`): Gris oscuro carbón con acento azul suave.
4. **Monokai** (`data-theme="monokai"`): Gris cálido con verde neón y rosa.
5. **Dracula** (`data-theme="dracula"`): Púrpura noche con cian y rosa brillante.
6. **O.W.C.A.** (`data-theme="owca"`): Negro y blanco absoluto con acento verde terminal.
7. **Coffee** (`data-theme="coffee"`): Café tostado profundo con acentos dorados y crema.

> **Regla de Oro**: Queda estrictamente prohibido hardcodear colores hexadecimales en los componentes. Siempre consumir las variables semánticas (`--color-page-bg`, `--color-surface-bg`, `--color-text-primary`, `--color-action-primary`, `--color-warning`, etc.).

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
