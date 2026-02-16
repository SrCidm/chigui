from pydantic_settings import BaseSettings
from typing import List
import json
import os


class Settings(BaseSettings):
    # App
    APP_ENV: str = "development"
    SECRET_KEY: str                         # Required — used for JWT signing

    # Gemini — NEVER exposed to frontend
    GEMINI_API_KEY: str                     # Required
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Firebase Admin SDK — server-side only
    FIREBASE_PROJECT_ID: str               # Required
    FIREBASE_PRIVATE_KEY: str              # Required
    FIREBASE_CLIENT_EMAIL: str             # Required

    # CORS - Parse from env or use defaults
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        origins_env = os.getenv("ALLOWED_ORIGINS", "")
        if origins_env:
            try:
                # Try JSON format: ["url1", "url2"]
                return json.loads(origins_env)
            except json.JSONDecodeError:
                # Try comma-separated: url1,url2
                return [origin.strip() for origin in origins_env.split(",")]
        return [
            "http://localhost:3000",            # Next.js dev
            "https://chigui.app",              # Production
        ]

    # Misc
    MAX_TOKENS: int = 2048
    RATE_LIMIT_PER_MINUTE: int = 20        # Per authenticated user

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
