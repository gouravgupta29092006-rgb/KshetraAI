"""
KshetraAI — Documents API
Handles local file ingestion. No cloud storage.
"""
import os
import uuid
import hashlib
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models import Document, DocumentClassification, AuditEventType, User
from app.schemas import DocumentResponse, DocumentList
from app.audit.audit_logger import AuditLogger
from app.core.logging import get_logger

logger = get_logger("documents_api")
router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain", "image/png", "image/jpeg", "image/jpg",
}


def _doc_to_response(doc: Document) -> DocumentResponse:
    return DocumentResponse(
        id=doc.id,
        filename=doc.filename,
        original_filename=doc.original_filename,
        file_size_bytes=doc.file_size_bytes,
        mime_type=doc.mime_type,
        title=doc.title,
        description=doc.description,
        document_type=doc.document_type,
        classification=doc.classification.value,
        department=doc.department,
        is_ocr_processed=doc.is_ocr_processed,
        is_embedded=doc.is_embedded,
        page_count=doc.page_count,
        processing_error=doc.processing_error,
        uploaded_by=doc.uploaded_by,
        created_at=doc.created_at,
    )


@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    classification: str = Form("internal"),
    department: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload a document to local storage. File never sent to external services."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail=f"File type not allowed: {file.content_type}")

    # Validate file size
    content = await file.read()
    if len(content) > settings.max_file_size_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File exceeds {settings.max_file_size_mb} MB limit")

    # Validate classification
    try:
        doc_class = DocumentClassification(classification)
    except ValueError:
        doc_class = DocumentClassification.INTERNAL

    # Generate safe filename and save locally
    safe_name = f"{uuid.uuid4().hex}_{Path(file.filename or 'upload').stem[:50]}"
    ext = Path(file.filename or "file").suffix.lower()
    stored_filename = f"{safe_name}{ext}"
    dest = Path(settings.upload_dir) / stored_filename
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(content)

    doc = Document(
        filename=stored_filename,
        original_filename=file.filename or stored_filename,
        file_size_bytes=len(content),
        mime_type=file.content_type,
        title=title or file.filename,
        description=description,
        classification=doc_class,
        department=department,
        uploaded_by=current_user.id,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    audit = AuditLogger(db)
    audit.log(
        AuditEventType.DOCUMENT_UPLOAD,
        f"Document uploaded: {file.filename} ({len(content)} bytes, {classification})",
        user_id=current_user.id,
        resource_type="document",
        resource_id=doc.id,
    )

    logger.info("document_uploaded", doc_id=doc.id, filename=file.filename, size=len(content))
    return _doc_to_response(doc)


@router.get("/", response_model=DocumentList)
async def list_documents(
    skip: int = 0,
    limit: int = 50,
    department: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Document)
    if department:
        query = query.filter(Document.department == department)
    total = query.count()
    docs = query.order_by(Document.created_at.desc()).offset(skip).limit(limit).all()
    return DocumentList(total=total, items=[_doc_to_response(d) for d in docs])


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return _doc_to_response(doc)
