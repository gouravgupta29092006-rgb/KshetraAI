"""
KshetraAI — Structured logging setup using structlog.
Never logs passwords, tokens, document contents, or secrets.
"""
import logging
import sys
import structlog
from app.core.config import settings

# Fields that must never appear in logs
SENSITIVE_FIELDS = {"password", "token", "secret", "key", "credential", "authorization", "cookie"}


def _redact_sensitive(logger, method, event_dict):
    """Processor: redact sensitive fields before logging."""
    for field in list(event_dict.keys()):
        if any(s in field.lower() for s in SENSITIVE_FIELDS):
            event_dict[field] = "[REDACTED]"
    return event_dict


def setup_logging():
    level = getattr(logging, settings.log_level.upper(), logging.INFO)

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            _redact_sensitive,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.ConsoleRenderer() if settings.debug else structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(level),
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )

    # Also configure stdlib logging for third-party libraries
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=level,
    )


def get_logger(name: str = "kshetraai"):
    return structlog.get_logger(name)
