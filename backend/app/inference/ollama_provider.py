"""
KshetraAI — Ollama Inference Provider
Connects ONLY to local Ollama at 127.0.0.1:11434.
NO external AI API calls.
"""
import time
import base64
from typing import List, Optional
import httpx
from app.inference.base import InferenceProvider, InferenceRequest, InferenceResponse, Message, MessageRole
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("ollama_provider")

# Sovereignty enforcement: only localhost connections allowed
_ALLOWED_HOSTS = {"127.0.0.1", "localhost", "::1"}


def _enforce_sovereignty(url: str):
    """Raise if the URL points outside localhost — prevents accidental external calls."""
    from urllib.parse import urlparse
    parsed = urlparse(url)
    host = parsed.hostname or ""
    if host not in _ALLOWED_HOSTS:
        raise RuntimeError(
            f"SOVEREIGNTY VIOLATION: Attempted connection to external host '{host}'. "
            f"All AI inference must remain local. Configured URL: {url}"
        )


class OllamaProvider(InferenceProvider):
    """
    Local inference via Ollama REST API.
    Ollama runs on localhost and serves open-weight models.
    This provider NEVER makes external AI API calls.
    """

    def __init__(self, base_url: Optional[str] = None, timeout: Optional[int] = None):
        self.base_url = (base_url or settings.ollama_base_url).rstrip("/")
        self.timeout = timeout or settings.ollama_timeout_seconds
        _enforce_sovereignty(self.base_url)  # Fail fast if misconfigured
        self._client = httpx.Client(timeout=self.timeout, base_url=self.base_url)
        logger.info("ollama_provider_initialized", base_url=self.base_url)

    def generate(self, request: InferenceRequest) -> InferenceResponse:
        """Send chat completion to local Ollama."""
        start = time.monotonic()

        messages = []
        for msg in request.messages:
            m: dict = {"role": msg.role.value, "content": msg.content}
            if msg.images:
                m["images"] = msg.images
            messages.append(m)

        payload = {
            "model": request.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": request.temperature,
                "num_predict": request.max_tokens,
            },
        }
        if request.format:
            payload["format"] = request.format

        try:
            resp = self._client.post("/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
            duration_ms = int((time.monotonic() - start) * 1000)

            return InferenceResponse(
                content=data.get("message", {}).get("content", ""),
                model=data.get("model", request.model),
                prompt_tokens=data.get("prompt_eval_count", 0),
                completion_tokens=data.get("eval_count", 0),
                duration_ms=duration_ms,
                finish_reason=data.get("done_reason", "stop"),
            )
        except httpx.ConnectError:
            raise RuntimeError(
                "Cannot connect to Ollama. Is Ollama running? Start with: ollama serve"
            )
        except httpx.HTTPStatusError as e:
            raise RuntimeError(f"Ollama API error: {e.response.status_code} — {e.response.text}")

    def embed(self, texts: List[str], model: Optional[str] = None) -> List[List[float]]:
        """Generate local embeddings via Ollama."""
        model = model or settings.default_embedding_model
        embeddings = []
        for text in texts:
            payload = {"model": model, "prompt": text}
            try:
                resp = self._client.post("/api/embeddings", json=payload)
                resp.raise_for_status()
                embeddings.append(resp.json()["embedding"])
            except httpx.ConnectError:
                raise RuntimeError("Cannot connect to Ollama for embeddings. Is Ollama running?")
        return embeddings

    def list_models(self) -> List[str]:
        """List models currently available in Ollama."""
        try:
            resp = self._client.get("/api/tags")
            resp.raise_for_status()
            models = resp.json().get("models", [])
            return [m["name"] for m in models]
        except Exception as e:
            logger.warning("ollama_list_models_failed", error=str(e))
            return []

    def health_check(self) -> bool:
        """Return True if Ollama is reachable."""
        try:
            resp = self._client.get("/api/tags", timeout=5)
            return resp.status_code == 200
        except Exception:
            return False

    def image_to_base64(self, image_path: str) -> str:
        """Convert an image file to base64 for vision model input."""
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
