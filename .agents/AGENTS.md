# Reglas de Comportamiento del Agente y Contexto de Diseño (Agente P)

Este archivo contiene las directrices específicas del proyecto AgenteP para garantizar que el agente nunca asuma decisiones estéticas y de distribución del frontend de manera autónoma, y respete la personalidad del producto.

---

## 🚫 Restricciones Críticas (Evitar "AI Slop")
* **Prohibido el Diseño Unilateral**: Nunca inventes estructuras, pestañas o componentes que no hayan sido acordados explícitamente con el usuario.
* **Prohibido Hardcodear Secretos o 'Hacks' Temporales**: Nunca hardcodees claves de API, tokens o parches temporales en el código de producción o componentes de React. Resuelve los problemas desde la raíz utilizando variables de entorno (.env) y patrones arquitectónicos limpios (ej. proxies de servidor).
* **Prohibido el Uso de SDKs o APIs de IA Pagas en Scripts de Backend**: Los scripts de Python (como El Guardián o Worker) NUNCA deben importar `google-genai`, `openai` ni realizar llamadas a APIs externas pagadas de IA. Todo el razonamiento y control agentil lo realiza directamente el agente (Antigravity). Los scripts de Python sirven como herramientas deterministas y limpias para I/O de datos (API Canvas, archivos locales y Supabase).
* **Agentes 100% Universales y Adaptables (Núcleo del Producto)**: Los agentes (empezando por El Guardián) NUNCA deben hardcodear siglas de ramos (como IIC2143). Deben usar descubrimiento automático de Canvas (`GET /api/v1/courses`) y razonamiento semántico para clasificar, priorizar y enrutar cualquier anuncio o tarea de cualquier ramo actual o futuro sin cambiar 1 sola línea de código.
* **Sin degradados morados/indigos ni "Glassmorphism" por defecto**: No utilices el estilo genérico de las IAs.
* **Sin métricas de adorno**: Nada de gráficos, porcentajes de avance o KPIs falsos en la página principal.
* **No agregues pestañas globales**: No inventes pestañas como "Tablero de Tareas" o "Resúmenes de Clases" en la navegación lateral.
* **Regla de Ejecución Incremental y Lenta (OBLIGATORIO)**: Ir siempre paso a paso. Prohibido procesar lotes masivos (ej. 30 tareas o anuncios de golpe). Probar SIEMPRE con 1 solo ramo / 1 solo elemento primero, verificar que funcione al 100% de inicio a fin, confirmarlo con el usuario, y solo avanzar a más elementos cuando el usuario esté completamente seguro de que funciona bien.

---

## 🎨 Guía Estética y de Layout
* **Estilo**: Ultra-minimalista. 95% blanco y negro con tipografía limpia (`Inter`) y espaciados generosos.
* **Acentos Perry (≤5%)**: El color turquesa (`#00a3a6`), naranja pico (`#ff9e1b`) y marrón del sombrero (`#4b2430`) se usan únicamente para el logo minimalista en 2D, estados activos puntuales y alertas de exámenes críticos.
* **Contenedor Principal Centrado en Ramos**:
  1. Al iniciar sesión, el foco visual absoluto es un grid limpio de tarjetas de asignaturas (ramos).
  2. Las tarjetas son ultra minimalistas: solo contienen la **Sigla** y el **Nombre** del ramo.
  3. Al hacer click en una tarjeta de ramo, esta se expande (abre un panel de detalle) para ver la actividad del agente de *ese* ramo en particular (sus tareas, logs de consola en JetBrains Mono y resúmenes).
* **Navegación Lateral Simplificada**: Menú que solo contiene "Mis Ramos" y "Configuración".
* **Diseño 100% Responsivo Obligatorio**: Todo el desarrollo de frontend DEBE ser completamente responsivo (adaptable a móviles, iPads/tablets y escritorio). En pantallas móviles o tablets, el menú lateral se transforma en un encabezado colapsable con botón hamburguesa, el grid de tarjetas se adapta dinámicamente y los paneles laterales ocupan el 100% del ancho.

---

## 🛠️ Flujo de Co-Creación Visual
1. **Validación Visual**: Antes de escribir cualquier código de frontend, presenta un mockup o plan estructural interactivo (`$impeccable shape`).
2. **Implementación Controlada**: Procesa los cambios en fases incrementales (`$impeccable craft`), probando localmente tras cada cambio.

---

## 🥷 Jujutsu (jj) Version Control
* **Herramienta Principal**: El usuario desea aprender y utilizar **Jujutsu (`jj`)** en lugar de Git para el control de versiones en este proyecto.
* **Instrucción**: Cada vez que el usuario pregunte cómo guardar, hacer commit, o subir (push) cambios, el agente **debe** proporcionar las instrucciones y comandos correspondientes en `jj` (ej. `jj describe`, `jj new`, `jj git push`), explicando brevemente qué hace cada comando para ayudarle a aprender.
