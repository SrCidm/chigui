from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import chat, users, progress, achievements, lessons, test

app = FastAPI(
    title="Chigui API",
    description="Backend for Chigui — Spanish learning platform for English speakers",
    version="0.1.0",
)

# CORS — only allow our frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(users.router,        prefix="/api/users",        tags=["Users"])
app.include_router(progress.router,     prefix="/api/progress",     tags=["Progress"])
app.include_router(achievements.router, prefix="/api/achievements", tags=["Achievements"])
app.include_router(lessons.router,      prefix="/api/lessons",      tags=["Lessons"])
app.include_router(test.router, prefix="/api", tags=["Test"])  # Temporary test endpoint


@app.get("/health")
async def health_check():
    return {"status": "ok", "app": "chigui-api"}
