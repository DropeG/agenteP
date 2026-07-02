# AgenteP: Portal de Agentes Académicos UC 🎓

Este es el repositorio base para **AgenteP**, un portal web con agentes autónomos en segundo plano diseñado para integrarse con **Canvas UC** y **Outlook**, resolver tareas (guardando borradores) y generar resúmenes automáticos de clases mientras se autoprograma de acuerdo al feedback recibido.

---

## 📂 Estructura del Proyecto

*   **`frontend/`**: Aplicación web SPA interactiva en React + Vite.
    *   Ver código principal en: **[App.jsx](file:///Users/pedro/Documents/UC/agenteP/frontend/src/App.jsx)**
    *   Ver estilos visuales en: **[App.css](file:///Users/pedro/Documents/UC/agenteP/frontend/src/App.css)**
*   **`backend/`**: Servidor en FastAPI que conecta las APIs de Canvas UC y Outlook, maneja la base de datos local y expone los servicios web.
    *   Ver servidor en: **[main.py](file:///Users/pedro/Documents/UC/agenteP/backend/app/main.py)**
    *   Ver base de datos en: **[database.py](file:///Users/pedro/Documents/UC/agenteP/backend/app/core/database.py)**
    *   Modelos de datos (Cursos, Tareas, Logs): **[models/](file:///Users/pedro/Documents/UC/agenteP/backend/app/models/)**
    *   Integración con Canvas UC: **[canvas.py](file:///Users/pedro/Documents/UC/agenteP/backend/app/integrations/canvas.py)**
*   **`agents/`**: Lógica de los agentes autónomos de resolución y autoprogramación.
    *   Script del worker local: **[worker.py](file:///Users/pedro/Documents/UC/agenteP/agents/core/worker.py)**
    *   Buzón de tareas puente: **[io/](file:///Users/pedro/Documents/UC/agenteP/agents/io/)**
    *   Librerías necesarias: **[requirements.txt](file:///Users/pedro/Documents/UC/agenteP/agents/requirements.txt)**

---

## 🚀 Instrucciones de Inicialización

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en la plantilla:
```bash
cp .env.example .env
```
Y edítalo con tus claves de Canvas UC (las API keys de LLMs son opcionales/no requeridas ya que usamos a Antigravity como motor de resolución gratuito):
*   🔑 **[.env.example](file:///Users/pedro/Documents/UC/agenteP/.env.example)**

### 2. Frontend (React + Vite)
El entorno del frontend ya ha sido inicializado y compilado exitosamente.

Para iniciar el servidor de desarrollo:
```bash
cd frontend
npm run dev
```
*   *Nota: Por defecto correrá en [http://localhost:5173](http://localhost:5173)*

### 3. Backend (FastAPI + SQLite)
Para iniciar el servidor de la API:

1. Crea un entorno virtual e instala las dependencias:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # En macOS/Linux
   # venv\Scripts\activate   # En Windows
   pip install -r requirements.txt
   ```
2. Corre el servidor con recarga automática:
   ```bash
   uvicorn app.main:app --reload
   ```
   *   *Nota: La API correrá en [http://localhost:8000](http://localhost:8000)*
   *   *Al iniciar por primera vez, se creará automáticamente el archivo de base de datos local `database.db` en la carpeta `backend/`.*

### 4. Bucle del Agente (Worker local)
Para arrancar el agente sin consumir APIs de pago:
1. Corre el worker local:
   ```bash
   python agents/core/worker.py
   ```
2. Cuando el worker detecte una tarea pendiente, la escribirá en `agents/io/pending_task.json` y se quedará esperando.
3. Pídele a **Antigravity** (en este chat) que resuelva la tarea en ese archivo. Una vez que la resuelva, el worker la marcará como completada de forma automática.

---

## 📖 Documentación del Proyecto
*   **[vision_and_features.md](file:///Users/pedro/Documents/UC/agenteP/docs/context/vision_and_features.md)**: Visión, features clave y plan de ruta del proyecto.
*   **[technical_stack.md](file:///Users/pedro/Documents/UC/agenteP/docs/context/technical_stack.md)**: Contexto del proyecto y stack técnico detallado.
*   **[options.md](file:///Users/pedro/Documents/UC/agenteP/docs/architecture/options.md)**: Opciones de diseño, pros, contras y justificación del stack tecnológico.
