from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AgenteP"
    DATABASE_URL: str = "sqlite:///./database.db"
    
    # University Platform Settings
    CANVAS_API_URL: str = "https://canvas.uc.cl"
    CANVAS_API_TOKEN: str | None = None
    
    # LLM Settings
    GEMINI_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
