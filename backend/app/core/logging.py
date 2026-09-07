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

    # Configure stdlib logging first (structlog will delegate to it)
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=level,
    )

    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        _redact_sensitive,
        structlog.processors.StackInfoRenderer(),
    ]

    structlog.configure(
        processors=shared_processors + [
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.make_filtering_bound_logger(level),
        cache_logger_on_first_use=True,
    )

    # Add console/json renderer via stdlib formatter
    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=shared_processors,
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            structlog.dev.ConsoleRenderer() if settings.debug else structlog.processors.JSONRenderer(),
        ],
    )
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(level)


def get_logger(name: str = "kshetraai"):
    return structlog.get_logger(name)
