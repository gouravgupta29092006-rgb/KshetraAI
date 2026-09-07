"""
KshetraAI — Models API
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models import User, UserRole
from app.schemas import ModelRegistryResponse
from app.inference.registry import ModelRegistryService

router = APIRouter()


@router.get("/", response_model=List[ModelRegistryResponse])
async def list_models(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all registered models and their availability."""
    registry = ModelRegistryService(db)
    registry.refresh_availability()
    return [
        ModelRegistryResponse(
            id=m.id, name=m.name, display_name=m.display_name, provider=m.provider,
            capabilities=m.capabilities or [], context_length=m.context_length,
            modality=m.modality, vram_required_gb=m.vram_required_gb,
            is_active=m.is_active, is_available=m.is_available,
            priority=m.priority, notes=m.notes,
        )
        for m in registry.get_all()
    ]


@router.post("/{model_name}/refresh")
async def refresh_model(
    model_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
):
    """Force-refresh model availability from Ollama (admin only)."""
    registry = ModelRegistryService(db)
    registry.refresh_availability()
    model = registry.get_by_name(model_name)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found in registry")
    return {"name": model.name, "is_available": model.is_available}
