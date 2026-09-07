"""
KshetraAI — Auth API
JWT-based authentication. No OAuth to external providers.
"""
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from app.models import User, AuditEventType
from app.schemas import LoginRequest, TokenResponse, UserResponse, RefreshRequest, UserCreate, MessageResponse
from app.audit.audit_logger import AuditLogger
from app.core.logging import get_logger

logger = get_logger("auth_api")
router = APIRouter()


def _get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username, User.is_active == True).first()


@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    """Authenticate and return JWT tokens."""
    user = _get_user_by_username(db, form_data.username)
    audit = AuditLogger(db)

    if not user or not verify_password(form_data.password, user.hashed_password):
        audit.log(
            AuditEventType.USER_LOGIN,
            f"Failed login attempt for username: {form_data.username}",
            ip_address=request.client.host if request.client else None,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token({"sub": user.id, "username": user.username, "role": user.role.value})
    refresh_token = create_refresh_token({"sub": user.id})

    audit.log(
        AuditEventType.USER_LOGIN,
        f"Successful login: {user.username}",
        user_id=user.id,
        ip_address=request.client.host if request.client else None,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.jwt_expire_minutes * 60,
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            role=user.role.value,
            department=user.department,
            is_active=user.is_active,
            created_at=user.created_at,
        ),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    """Refresh access token using a valid refresh token."""
    try:
        data = decode_token(payload.refresh_token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user = db.query(User).filter(User.id == data.get("sub")).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    access_token = create_access_token({"sub": user.id, "username": user.username, "role": user.role.value})
    new_refresh = create_refresh_token({"sub": user.id})

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh,
        expires_in=settings.jwt_expire_minutes * 60,
        user=UserResponse(
            id=user.id, username=user.username, email=user.email,
            full_name=user.full_name, role=user.role.value,
            department=user.department, is_active=user.is_active, created_at=user.created_at,
        ),
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Register a new user. In production, restrict to admins only."""
    from app.core.security import hash_password
    from app.models import UserRole

    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=UserRole(payload.role),
        department=payload.department,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info("user_registered", username=user.username, role=user.role.value)

    return UserResponse(
        id=user.id, username=user.username, email=user.email,
        full_name=user.full_name, role=user.role.value,
        department=user.department, is_active=user.is_active, created_at=user.created_at,
    )
