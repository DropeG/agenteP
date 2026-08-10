# Visual Design System (Agente P)

This document defines the visual theme, semantic tokens, color system, and component patterns for **Agente P** aligned with the official `agente-p-logo.svg`.

---

## 🎨 Color Palette & Semantic Tokens

### Logo Base Palette
* `--brand-turquoise`: `#08ACB1`
* `--brand-orange`: `#F99814`
* `--brand-hat-brown`: `#8B3F0A`
* `--brand-dark-brown`: `#45240F`
* `--brand-cream`: `#FAF7F2`

### Semantic Token System (CSS & OKLCH)

```css
:root {
  /* Surfaces & Environment (85-95% Neutral) */
  --color-page-bg: oklch(0.978 0.007 80.5);         /* #FAF7F2 Warm Cream */
  --color-surface-bg: oklch(0.995 0.003 80.5);      /* Warm Off-White */
  --color-elevated-surface: oklch(1.0 0 0);         /* #FFFFFF Pure White Cards */
  --color-border: oklch(0.910 0.010 80.5);          /* Subtle Warm Border */
  --color-border-hover: oklch(0.820 0.018 80.5);    /* Hover Warm Border */

  /* Text & Ink */
  --color-text-primary: oklch(0.245 0.048 55.2);    /* #45240F Dark Brown High-Contrast Ink */
  --color-text-secondary: oklch(0.420 0.035 55.2);  /* Muted Warm Brown Text */
  --color-text-muted: oklch(0.580 0.025 55.2);      /* Secondary Labels */

  /* Actions & Interactive */
  --color-action-primary: #08ACB1;                   /* Logo Turquoise */
  --color-action-primary-hover: oklch(0.60 0.12 195);/* Darker Turquoise Hover */
  --color-action-secondary: #8B3F0A;                 /* Logo Hat Brown */
  --color-focus-ring: #08ACB1;                       /* Turquoise Focus Ring */

  /* Agent Execution Statuses */
  --color-agent-running: #08ACB1;                     /* Turquoise Pulse */
  --color-agent-waiting: #8B3F0A;                     /* Hat Brown Pause */
  --color-agent-completed: oklch(0.55 0.14 150);     /* Muted Green Check */
  --color-agent-failed: oklch(0.52 0.18 25);         /* Deep Red Alert */

  /* Urgency & Alerts */
  --color-warning: #F99814;                          /* Logo Beak Orange */
  --color-critical-deadline: #F99814;                 /* High Priority Exam/Deadline Alert */

  /* Dark Console Environment */
  --color-bg-console: #1A1816;                      /* Dark Warm Console */
  --color-text-console: #ECE6DE;                    /* Warm Console Monospace Text */
}
```

---

## 🔤 Typography

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

* **UI & Navigation:** Use `--font-sans` (`Inter`) with clean letter spacing (-0.01em to -0.02em).
* **Console Logs & Code:** Use `--font-mono` (`JetBrains Mono`) for real-time agent output, task prompts, and JSON rubrics.

---

## 📐 Layout & Architecture

* **Primary Global Sidebar (Tier 1):** Width 72px (icon-bar) or 220px fixed left. Contains global links:
  * **Logo & Brand:** `agente-p-logo.svg` displayed at top.
  * **Global Items:** **"Mis Ramos"** (Dashboard) and **"Configuración"** (Settings).
* **Secondary Course Sidebar (Tier 2 - Canvas UC Pattern):** Width 200px. Appears adjacent to Primary Sidebar when a course card is selected, offering course-specific sub-navigation:
  1. **Actividad Agente** (Amie-style Timeline Feed & Monospace Console Logs)
  2. **Programa del Curso** (Syllabus & Grading Weights from `course_profile.json`)
  3. **Anuncios** (Ingested announcement markdown posts)
  4. **Tareas & Evaluaciones** (HW, Exams & Projects)
  5. **Materiales** (Parsed Class Slides & Summaries)
* **Main Content Area:** Renders either the "Mis Ramos" Course Cards grid or the active course sub-view content.
* **Course Card:** Minimalist elevated white card (`#FFFFFF`) with subtle warm border, showing:
  * Course Sigla (e.g. `IIC2143`)
  * Course Name (e.g. `Ingeniería de Software`)
* **Detail Panel (Console & Timeline View):** Slide-out or expandable drawer presenting:
  1. **Amie-Style Timeline Feed:** Agent actions and completed tasks grouped chronologically by date headers (*Today*, *Yesterday*, *Last Week*, *Past*).
  2. **Console Output:** Real-time agent execution logs rendered in `JetBrains Mono`.

### Responsive Breakpoints
* **Desktop (≥1024px):** Fixed 240px left sidebar, centered multi-column course grid (`repeat(auto-fit, minmax(280px, 1fr))`), 560px drawer.
* **Tablet / iPad (768px - 1023px):** Compact 200px sidebar, 2-column grid, 480px drawer.
* **Mobile (<768px):** Collapsible top header with hamburger menu button, 1-column course grid, full-screen 100% width detail panel.

---

## 🚫 Absolute Bans & Anti-Patterns
* NO gradient text or background-clip text.
* NO side-stripe card borders (`border-left: 4px solid ...`).
* NO glassmorphism or default backdrop-blur overuse.
* NO fake KPI graphs, progress circles, or decorative metrics.
