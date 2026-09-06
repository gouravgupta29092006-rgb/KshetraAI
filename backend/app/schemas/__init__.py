"""
KshetraAI — Pydantic Schemas (request/response contracts)
"""
from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field, field_validator
import re


# ─── Auth ────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: "UserResponse"


class RefreshRequest(BaseModel):
    refresh_token: str


# ─── Users ───────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=64, pattern=r"^[a-zA-Z0-9_-]+$")
    email: EmailStr
    password: str = Field(..., min_length=12)
    full_name: str = Field(..., min_length=1, max_length=255)
    role: str = "viewer"
    department: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[!@#$%^&*()_+\-=\[\]{}|;':\",./<>?]", v):
            raise ValueError("Password must contain at least one special character")
        return v


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str
    department: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Documents ───────────────────────────────────────────────────────────────

class DocumentResponse(BaseModel):
    id: str
    filename: str
    original_filename: str
    file_size_bytes: int
    mime_type: Optional[str]
    title: Optional[str]
    description: Optional[str]
    document_type: Optional[str]
    classification: str
    department: Optional[str]
    is_ocr_processed: bool
    is_embedded: bool
    page_count: Optional[int]
    processing_error: Optional[str]
    uploaded_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentList(BaseModel):
    total: int
    items: List[DocumentResponse]


# ─── Tasks ───────────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=512)
    description: str = Field(..., min_length=1)
    document_id: Optional[str] = None


class AgentStepResponse(BaseModel):
    id: str
    step_index: int
    step_type: str
    step_name: str
    status: str
    input_summary: Optional[str]
    output_summary: Optional[str]
    error: Optional[str]
    duration_ms: Optional[int]
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    task_type: Optional[str]
    status: str
    routing_reason: Optional[str]
    result_summary: Optional[str]
    error_message: Optional[str]
    created_by: str
    document_id: Optional[str]
    selected_model_id: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    agent_steps: List[AgentStepResponse] = []

    class Config:
        from_attributes = True


class TaskList(BaseModel):
    total: int
    items: List[TaskResponse]


# ─── Models ──────────────────────────────────────────────────────────────────

class ModelRegistryResponse(BaseModel):
    id: str
    name: str
    display_name: str
    provider: str
    capabilities: List[str]
    context_length: Optional[int]
    modality: str
    vram_required_gb: Optional[float]
    is_active: bool
    is_available: bool
    priority: int
    notes: Optional[str]

    class Config:
        from_attributes = True


# ─── Approvals ───────────────────────────────────────────────────────────────

class ApprovalAction(BaseModel):
    action: str  # approved | rejected | changes_requested
    notes: Optional[str] = None

    @field_validator("action")
    @classmethod
    def valid_action(cls, v):
        if v not in ("approved", "rejected", "changes_requested"):
            raise ValueError("action must be: approved, rejected, or changes_requested")
        return v


class ApprovalResponse(BaseModel):
    id: str
    task_id: str
    status: str
    requested_at: datetime
    reviewed_by: Optional[str]
    reviewed_at: Optional[datetime]
    reviewer_notes: Optional[str]

    class Config:
        from_attributes = True


# ─── Deliverables ────────────────────────────────────────────────────────────

class DeliverableResponse(BaseModel):
    id: str
    task_id: str
    deliverable_type: str
    filename: str
    file_size_bytes: Optional[int]
    is_ai_generated: bool
    is_human_approved: bool
    validation_status: str
    validation_notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Audit ───────────────────────────────────────────────────────────────────

class AuditEventResponse(BaseModel):
    id: str
    event_type: str
    user_id: Optional[str]
    task_id: Optional[str]
    resource_type: Optional[str]
    resource_id: Optional[str]
    description: str
    created_at: datetime

    class Config:
        from_attributes = True


class AuditList(BaseModel):
    total: int
    items: List[AuditEventResponse]


# ─── Sovereignty ─────────────────────────────────────────────────────────────

class SovereigntyStatus(BaseModel):
    external_ai_calls: int
    external_ocr_calls: int
    external_embedding_calls: int
    total_local_inferences: int
    total_local_ocr_ops: int
    total_local_embeddings: int
    is_sovereign: bool  # True if all external counts = 0
    deployment_mode: str  # LOCAL | HYBRID | CLOUD
    inference_location: str
    ocr_location: str
    embedding_location: str
    audit_enabled: bool
    rbac_enabled: bool
    sandbox_enabled: bool
    sandbox_type: str


# ─── Common ──────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    detail: Optional[Any] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    ollama: str
    vector_db: str
    sovereignty: str
