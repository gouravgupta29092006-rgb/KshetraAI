"""
KshetraAI Backend — Application Configuration
Uses Pydantic Settings for type-safe, environment-driven configuration.
"""
from functools import lru_cache
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator
import secrets


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ────────────────────────────────────────────
    app_name: str = "KshetraAI"
    app_env: Literal["development", "demo", "production"] = "development"
    debug: bool = False
    secret_key: str = secrets.token_urlsafe(64)
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    # ── JWT ────────────────────────────────────────────────────
    jwt_secret_key: str = secrets.token_urlsafe(64)
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60
    jwt_refresh_token_expire_days: int = 7

    # ── Database ───────────────────────────────────────────────
    database_url: str = "sqlite:///./kshetraai.db"

    # ── Vector Database ────────────────────────────────────────
    chroma_data_dir: str = "./chroma_data"
    chroma_collection_name: str = "kshetraai_knowledge"

    # ── File Storage ───────────────────────────────────────────
    upload_dir: str = "./uploads"
    deliverables_dir: str = "./deliverables"
    max_upload_size_mb: int = 50
    allowed_upload_types: str = "pdf,docx,xlsx,pptx,png,jpg,jpeg,txt"

    @property
    def allowed_upload_extensions(self) -> set[str]:
        return {f".{t.strip()}" for t in self.allowed_upload_types.split(",")}

    # ── Ollama ─────────────────────────────────────────────────
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_timeout_seconds: int = 300

    # ── Models ─────────────────────────────────────────────────
    default_reasoning_model: str = "qwen2.5:7b-instruct"
    default_coding_model: str = "qwen2.5-coder:7b-instruct"
    default_vision_model: str = "llava:7b"
    default_embedding_model: str = "nomic-embed-text"

    # ── Agent ──────────────────────────────────────────────────
    agent_max_iterations: int = 10
    agent_max_retries: int = 3
    agent_timeout_seconds: int = 600

    # ── Sandbox ────────────────────────────────────────────────
    sandbox_type: Literal["restricted_python", "docker"] = "restricted_python"
    sandbox_timeout_seconds: int = 30
    sandbox_max_memory_mb: int = 256

    # ── Sovereignty ────────────────────────────────────────────
    external_ai_disabled: bool = True
    telemetry_disabled: bool = True

    # ── Security ───────────────────────────────────────────────
    bcrypt_rounds: int = 12
    rate_limit_per_minute: int = 60

    # ── Logging ────────────────────────────────────────────────
    log_level: str = "INFO"
    log_file: str = "./logs/kshetraai.log"


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()


settings = get_settings()
