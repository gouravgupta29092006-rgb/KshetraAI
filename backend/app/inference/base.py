"""
KshetraAI — Inference Provider Abstraction Layer
All AI inference must go through this interface.
Never calls external AI APIs.
"""
from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field
from enum import Enum


class MessageRole(str, Enum):
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


@dataclass
class Message:
    role: MessageRole
    content: str
    images: List[str] = field(default_factory=list)  # base64-encoded for vision


@dataclass
class InferenceRequest:
    messages: List[Message]
    model: str
    temperature: float = 0.1
    max_tokens: int = 4096
    stream: bool = False
    tools: Optional[List[Dict]] = None
    format: Optional[str] = None  # "json" for structured output


@dataclass
class InferenceResponse:
    content: str
    model: str
    prompt_tokens: int = 0
    completion_tokens: int = 0
    duration_ms: int = 0
    finish_reason: str = "stop"


class InferenceProvider(ABC):
    """Protocol for local inference backends. Never implement external AI APIs."""

    @abstractmethod
    def generate(self, request: InferenceRequest) -> InferenceResponse:
        """Generate a response synchronously."""
        ...

    @abstractmethod
    def embed(self, texts: List[str], model: str) -> List[List[float]]:
        """Generate embeddings locally."""
        ...

    @abstractmethod
    def list_models(self) -> List[str]:
        """List available models on this provider."""
        ...

    @abstractmethod
    def health_check(self) -> bool:
        """Return True if provider is reachable and operational."""
        ...
