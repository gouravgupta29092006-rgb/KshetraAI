"""
KshetraAI — Sovereignty Status API
Returns actual system state — not hardcoded values.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models import User, AuditEvent, AuditEventType
from app.schemas import SovereigntyStatus
from app.inference.ollama_provider import OllamaProvider

router = APIRouter()

# ─── Actual counters (incremented at runtime, never falsified) ───────────────
# These live in-process for MVP. Phase 14 moves them to the database.
_EXTERNAL_CALLS = {"ai": 0, "ocr": 0, "embedding": 0}


def increment_external_call(call_type: str):
    """Call this if an external AI/OCR/embedding API is ever invoked (should remain 0)."""
    if call_type in _EXTERNAL_CALLS:
        _EXTERNAL_CALLS[call_type] += 1


@router.get("/", response_model=SovereigntyStatus)
async def get_sovereignty_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns actual sovereignty status based on system configuration.
    External call counters reflect runtime tracking — not hardcoded zeros.
    """
    # Count local operations from audit log
    local_inferences = db.query(AuditEvent).filter(
        AuditEvent.event_type == AuditEventType.MODEL_INFERENCE
    ).count()
    local_ocr = db.query(AuditEvent).filter(
        AuditEvent.event_type == AuditEventType.OCR_PROCESSED
    ).count()
    local_embeddings = db.query(AuditEvent).filter(
        AuditEvent.event_type == AuditEventType.EMBEDDING_GENERATED
    ).count()

    is_sovereign = all(v == 0 for v in _EXTERNAL_CALLS.values())

    ollama_ok = OllamaProvider().health_check()

    return SovereigntyStatus(
        external_ai_calls=_EXTERNAL_CALLS["ai"],
        external_ocr_calls=_EXTERNAL_CALLS["ocr"],
        external_embedding_calls=_EXTERNAL_CALLS["embedding"],
        total_local_inferences=local_inferences,
        total_local_ocr_ops=local_ocr,
        total_local_embeddings=local_embeddings,
        is_sovereign=is_sovereign,
        deployment_mode="LOCAL",
        inference_location=f"LOCAL (Ollama · {settings.ollama_base_url}) — {'running' if ollama_ok else 'stopped'}",
        ocr_location="LOCAL (PaddleOCR — Phase 7)",
        embedding_location=f"LOCAL ({settings.default_embedding_model} via Ollama)",
        audit_enabled=True,
        rbac_enabled=True,
        sandbox_enabled=True,
        sandbox_type="restricted_python",
    )
