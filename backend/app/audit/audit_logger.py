"""
KshetraAI — Audit Logger
Append-only audit trail for all significant system actions.
"""
from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy.orm import Session
from app.models import AuditEvent, AuditEventType
from app.core.logging import get_logger

logger = get_logger("audit")


class AuditLogger:
    def __init__(self, db: Session):
        self.db = db

    def log(
        self,
        event_type: AuditEventType,
        description: str,
        user_id: Optional[str] = None,
        task_id: Optional[str] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        metadata: Optional[dict] = None,
        ip_address: Optional[str] = None,
    ) -> AuditEvent:
        event = AuditEvent(
            event_type=event_type,
            user_id=user_id,
            task_id=task_id,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
            metadata=metadata,
            ip_address=ip_address,
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)

        # Also write to structured log
        logger.info(
            "audit_event",
            event_type=event_type.value,
            description=description,
            user_id=user_id,
            task_id=task_id,
            resource_type=resource_type,
            resource_id=resource_id,
        )
        return event
