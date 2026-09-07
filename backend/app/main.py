"""
KshetraAI — FastAPI Application Entry Point
Sovereign Industrial AI Execution Platform
"""
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.database import Base, engine, get_db
from app.inference.registry import ModelRegistryService

setup_logging()
logger = get_logger("main")


# ─── Lifespan ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown logic."""
    logger.info("kshetraai_starting", version=settings.app_version, env=settings.environment)

    # Create all tables (dev only; Alembic migrations used in production)
    Base.metadata.create_all(bind=engine)
    logger.info("database_tables_ready")

    # Seed model registry and refresh availability from Ollama
    from sqlalchemy.orm import Session
    with Session(engine) as db:
        registry = ModelRegistryService(db)
        registry.seed_defaults()
        registry.refresh_availability()
        logger.info("model_registry_ready")

    yield

    logger.info("kshetraai_shutdown")


# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="KshetraAI",
    description=(
        "Sovereign Industrial AI Execution Platform. "
        "Confidential Data → Verified Work. "
        "Intelligence Within Your Boundary."
    ),
    version=settings.app_version,
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
    lifespan=lifespan,
)

# ─── CORS ────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request logging middleware ───────────────────────────────────────────────

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.monotonic()
    response = await call_next(request)
    duration_ms = int((time.monotonic() - start) * 1000)
    logger.info(
        "http_request",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration_ms=duration_ms,
    )
    return response

# ─── Routers ─────────────────────────────────────────────────────────────────

from app.api import auth, tasks, documents, models_api, audit_api, sovereignty_api

app.include_router(auth.router,        prefix="/api/auth",        tags=["Authentication"])
app.include_router(tasks.router,       prefix="/api/tasks",       tags=["Tasks"])
app.include_router(documents.router,   prefix="/api/documents",   tags=["Documents"])
app.include_router(models_api.router,  prefix="/api/models",      tags=["Models"])
app.include_router(audit_api.router,   prefix="/api/audit",       tags=["Audit"])
app.include_router(sovereignty_api.router, prefix="/api/sovereignty", tags=["Sovereignty"])

# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/api/health", tags=["System"])
async def health_check():
    """System health check — also serves as sovereignty heartbeat."""
    from app.inference.ollama_provider import OllamaProvider
    from app.schemas import HealthResponse

    ollama = OllamaProvider()
    return {
        "status": "healthy",
        "version": settings.app_version,
        "database": "connected",
        "ollama": "running" if ollama.health_check() else "stopped",
        "vector_db": "ready",
        "sovereignty": "LOCAL",
    }

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "KshetraAI API — Sovereign Industrial AI Platform", "version": settings.app_version}
