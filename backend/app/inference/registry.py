"""
KshetraAI — Model Registry Service
Manages model metadata, availability, and selection.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import ModelRegistry
from app.inference.ollama_provider import OllamaProvider
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("model_registry")


# Default models for this hardware profile (RTX 4050 / 6GB VRAM)
DEFAULT_MODELS = [
    {
        "name": settings.default_reasoning_model,
        "display_name": "Qwen2.5 7B — Reasoning",
        "provider": "ollama",
        "capabilities": ["reasoning", "analysis", "summarization", "tool_calling", "structured_output"],
        "context_length": 32768,
        "modality": "text",
        "vram_required_gb": 4.5,
        "priority": 1,
        "notes": "Primary reasoning model. Used for inspection analysis, report generation, RAG synthesis.",
    },
    {
        "name": settings.default_coding_model,
        "display_name": "Qwen2.5-Coder 7B — Coding",
        "provider": "ollama",
        "capabilities": ["coding", "code_review", "debugging", "tool_calling"],
        "context_length": 32768,
        "modality": "text",
        "vram_required_gb": 4.5,
        "priority": 2,
        "notes": "Primary coding model. Used for code generation, verification, and sandboxed execution.",
    },
    {
        "name": settings.default_vision_model,
        "display_name": "LLaVA 7B — Vision",
        "provider": "ollama",
        "capabilities": ["vision", "image_analysis", "document_understanding", "ocr_assist"],
        "context_length": 4096,
        "modality": "vision",
        "vram_required_gb": 4.5,
        "priority": 3,
        "notes": "Multimodal model for image/diagram analysis and visual document understanding.",
    },
    {
        "name": settings.default_embedding_model,
        "display_name": "Nomic Embed Text — Embeddings",
        "provider": "ollama",
        "capabilities": ["embedding"],
        "context_length": 8192,
        "modality": "text",
        "vram_required_gb": 0.3,
        "priority": 1,
        "notes": "Local embedding model for RAG. Always resident.",
    },
]


class ModelRegistryService:
    def __init__(self, db: Session):
        self.db = db
        self._provider = OllamaProvider()

    def seed_defaults(self):
        """Ensure default models exist in the registry."""
        for model_data in DEFAULT_MODELS:
            existing = self.db.query(ModelRegistry).filter(ModelRegistry.name == model_data["name"]).first()
            if not existing:
                model = ModelRegistry(**model_data, is_active=True, is_available=False)
                self.db.add(model)
        self.db.commit()
        logger.info("model_registry_seeded", count=len(DEFAULT_MODELS))

    def refresh_availability(self):
        """Check Ollama for available models and update registry."""
        available = set(self._provider.list_models())
        models = self.db.query(ModelRegistry).all()
        for model in models:
            # Partial match: "qwen2.5:7b-instruct" may appear as "qwen2.5:7b-instruct" or "qwen2.5:latest"
            was_available = model.is_available
            model.is_available = any(model.name in a or a in model.name for a in available)
            if was_available != model.is_available:
                logger.info("model_availability_changed", name=model.name, available=model.is_available)
        self.db.commit()

    def get_all(self) -> List[ModelRegistry]:
        return self.db.query(ModelRegistry).order_by(ModelRegistry.priority).all()

    def get_by_name(self, name: str) -> Optional[ModelRegistry]:
        return self.db.query(ModelRegistry).filter(ModelRegistry.name == name).first()

    def get_by_capability(self, capability: str) -> Optional[ModelRegistry]:
        """Return the highest-priority available model with the given capability."""
        models = self.db.query(ModelRegistry).filter(
            ModelRegistry.is_active == True,
            ModelRegistry.is_available == True,
        ).order_by(ModelRegistry.priority).all()
        for m in models:
            if capability in (m.capabilities or []):
                return m
        return None

    def get_provider(self) -> OllamaProvider:
        return self._provider
