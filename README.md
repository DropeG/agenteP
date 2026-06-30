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
    *   Librerías necesarias: **[requirements.txt](file:///Users/pedro/Documents/UC/agenteP/agents/requirements.txt)**

---

## 🚀 Instrucciones de Inicialización

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en la plantilla:
```bash
cp .env.example .env
```
Y edítalo con tus claves de Canvas UC y Gemini/OpenAI:
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

---

## 📖 Documentación del Proyecto
*   **[PROJECT_CONTEXT.md](file:///Users/pedro/Documents/UC/agenteP/PROJECT_CONTEXT.md)**: Visión, features clave y plan de ruta del proyecto (en inglés).
*   **[ARCHITECTURE_OPTIONS.md](file:///Users/pedro/Documents/UC/agenteP/ARCHITECTURE_OPTIONS.md)**: Opciones de diseño, pros, contras y justificación del stack tecnológico.
