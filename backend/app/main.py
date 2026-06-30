from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.models.course import Course
from app.models.task import Task
from app.models.agent_log import AgentLog

# Initialize database tables
Base.metadata.create_all(bind=engine)


from app.api.endpoints import router as api_router

app = FastAPI(
    title="AgenteP API",
    description="Backend server and Agent portal for UC academic management.",
    version="0.1.0"
)

# Set up CORS so the React frontend can talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # React Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": "AgenteP",
        "description": "Welcome to your Autonomous UC Agent Portal API"
    }

