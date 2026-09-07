"""
KshetraAI — Audit API
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models import User, UserRole, AuditEvent
from app.schemas import AuditList, AuditEventResponse

router = APIRouter()


@router.get("/", response_model=AuditList)
async def list_audit_events(
    skip: int = 0,
    limit: int = 100,
    task_id: Optional[str] = None,
    event_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN)),
):
    """List audit events (admin only)."""
    query = db.query(AuditEvent)
    if task_id:
        query = query.filter(AuditEvent.task_id == task_id)
    if event_type:
        query = query.filter(AuditEvent.event_type == event_type)

    total = query.count()
    events = query.order_by(AuditEvent.created_at.desc()).offset(skip).limit(limit).all()

    return AuditList(
        total=total,
        items=[
            AuditEventResponse(
                id=e.id,
                event_type=e.event_type.value,
                user_id=e.user_id,
                task_id=e.task_id,
                resource_type=e.resource_type,
                resource_id=e.resource_id,
                description=e.description,
                created_at=e.created_at,
            )
            for e in events
        ],
    )
