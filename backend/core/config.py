import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Nexus AI")
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    PPLX_API_KEY: str = os.getenv("PPLX_API_KEY")

    # We will add others as we need them
    class Config:
        case_sensitive = True

settings = Settings()