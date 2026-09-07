"""
KshetraAI — Tasks API
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Task, TaskStatus, User, AuditEventType
from app.schemas import TaskCreate, TaskResponse, TaskList, MessageResponse
from app.audit.audit_logger import AuditLogger
from app.inference.registry import ModelRegistryService
from app.router.model_router import ModelRouter
from app.core.logging import get_logger

logger = get_logger("tasks_api")
router = APIRouter()


def _task_to_response(task: Task) -> TaskResponse:
    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        task_type=task.task_type,
        status=task.status.value,
        routing_reason=task.routing_reason,
        result_summary=task.result_summary,
        error_message=task.error_message,
        created_by=task.created_by,
        document_id=task.document_id,
        selected_model_id=task.selected_model_id,
        started_at=task.started_at,
        completed_at=task.completed_at,
        created_at=task.created_at,
        agent_steps=[],  # Populated separately when needed
    )


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    payload: TaskCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new task and route it to the appropriate model."""
    # Run model routing
    registry = ModelRegistryService(db)
    models = [
        {"name": m.name, "capabilities": m.capabilities or [], "is_available": m.is_available, "priority": m.priority}
        for m in registry.get_all()
    ]
    router_svc = ModelRouter(models)
    decision = router_svc.route(payload.description, has_document=bool(payload.document_id))

    task = Task(
        title=payload.title,
        description=payload.description,
        task_type=decision.task_analysis.task_type,
        status=TaskStatus.PENDING,
        created_by=current_user.id,
        document_id=payload.document_id,
        selected_model_id=decision.primary_model,
        routing_reason=decision.reason,
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    audit = AuditLogger(db)
    audit.log(
        AuditEventType.TASK_CREATED,
        f"Task created: {task.title} | Type: {decision.task_analysis.task_type} | Model: {decision.primary_model}",
        user_id=current_user.id,
        task_id=task.id,
    )

    logger.info("task_created", task_id=task.id, task_type=decision.task_analysis.task_type, model=decision.primary_model)
    return _task_to_response(task)


@router.get("/", response_model=TaskList)
async def list_tasks(
    skip: int = 0,
    limit: int = 50,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List tasks. Non-admins see only their own tasks."""
    from app.models import UserRole
    query = db.query(Task)
    if current_user.role != UserRole.ADMIN:
        query = query.filter(Task.created_by == current_user.id)
    if status_filter:
        try:
            query = query.filter(Task.status == TaskStatus(status_filter))
        except ValueError:
            pass

    total = query.count()
    tasks = query.order_by(Task.created_at.desc()).offset(skip).limit(limit).all()
    return TaskList(total=total, items=[_task_to_response(t) for t in tasks])


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return _task_to_response(task)


@router.delete("/{task_id}", response_model=MessageResponse)
async def cancel_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.status not in (TaskStatus.PENDING, TaskStatus.RUNNING):
        raise HTTPException(status_code=400, detail=f"Cannot cancel task in status: {task.status.value}")

    task.status = TaskStatus.CANCELLED
    db.commit()
    return MessageResponse(message=f"Task {task_id} cancelled")
