"""
KshetraAI — Task Analyzer + Model Router
Rule-based v1 (documented as such). Architecture ready for classifier-based v2.
"""
from dataclasses import dataclass, field
from typing import List, Optional, Tuple
import re
from app.core.logging import get_logger

logger = get_logger("task_router")


@dataclass
class TaskAnalysis:
    task_type: str                    # e.g. "inspection_analysis", "coding", "rag_query"
    modality: str                     # "text" | "vision" | "code" | "spreadsheet"
    required_capabilities: List[str] # e.g. ["reasoning", "vision"]
    complexity: str                   # "low" | "medium" | "high"
    requires_vision: bool
    requires_coding: bool
    requires_calculation: bool
    requires_rag: bool
    requires_file_generation: bool
    confidence: float                 # 0.0–1.0 (honest: rule-based = ~0.75 max)
    explanation: str


@dataclass
class RoutingDecision:
    primary_model: str                # model name
    fallback_model: Optional[str]
    task_analysis: TaskAnalysis
    reason: str
    is_rule_based: bool = True        # Honest labeling: this v1 is rule-based


# ─── Task Type Rules ─────────────────────────────────────────────────────────

TASK_PATTERNS = [
    # Inspection / document analysis
    ("inspection_analysis", ["inspection", "report", "finding", "equipment", "corrosion", "leak", "defect", "survey", "condition", "anomaly"], "reasoning"),
    # SOP / compliance
    ("sop_compliance", ["sop", "procedure", "compliance", "standard", "regulation", "guideline", "protocol"], "reasoning"),
    # Engineering calculation
    ("engineering_calculation", ["calculate", "compute", "formula", "pressure", "flow rate", "temperature", "stress", "load", "efficiency"], "reasoning"),
    # Coding
    ("coding", ["code", "python", "script", "function", "program", "algorithm", "debug", "test", "class", "def ", "import "], "coding"),
    # Spreadsheet analysis
    ("spreadsheet_analysis", ["spreadsheet", "excel", "xlsx", "table", "data analysis", "statistics", "chart", "graph", "trend"], "reasoning"),
    # Image / diagram
    ("image_analysis", ["image", "photo", "diagram", "drawing", "p&id", "schematic", "photograph", "visual", "picture"], "vision"),
    # Report generation
    ("report_generation", ["generate report", "write report", "approval note", "approval memo", "summary report", "technical report"], "reasoning"),
    # RAG / knowledge search
    ("knowledge_search", ["find", "search", "lookup", "what is", "where is", "how to", "explain", "according to", "reference"], "reasoning"),
]


class TaskAnalyzer:
    """
    Analyzes task descriptions to classify type, required capabilities, and modality.
    
    VERSION: Rule-based v1
    This is a rule-based classifier using keyword matching and heuristics.
    It is NOT powered by an LLM or trained classifier.
    Documented as such per spec requirement (Section 4).
    A classifier-based v2 can replace this via the same interface.
    """

    def analyze(self, description: str, has_document: bool = False, document_type: Optional[str] = None) -> TaskAnalysis:
        desc_lower = description.lower()

        # Detect modality signals
        has_image_signal = any(kw in desc_lower for kw in ["image", "photo", "scan", "scanned", "drawing", "diagram", "picture", "visual"])
        has_code_signal = any(kw in desc_lower for kw in ["code", "python", "script", "function", "program", "def ", "class ", "import "])
        has_calc_signal = any(kw in desc_lower for kw in ["calculat", "comput", "formula", "pressure", "flow", "temperature", "stress", "numerical"])
        has_rag_signal = any(kw in desc_lower for kw in ["search", "find", "lookup", "according to", "reference", "sop", "manual", "procedure"])
        has_doc_signal = has_document or any(kw in desc_lower for kw in ["report", "document", "pdf", "upload", "attached", "file"])
        has_gen_signal = any(kw in desc_lower for kw in ["generate", "write", "create", "draft", "produce", "approval note", "report"])

        # If document is a scanned/image type, force vision consideration
        if document_type in ("inspection_report", "scanned_document", "image"):
            has_image_signal = True

        # Classify task type via patterns
        task_type = "general_query"
        best_score = 0
        primary_capability = "reasoning"

        for t_type, keywords, capability in TASK_PATTERNS:
            score = sum(1 for kw in keywords if kw in desc_lower)
            if score > best_score:
                best_score = score
                task_type = t_type
                primary_capability = capability

        # Determine required capabilities
        capabilities = [primary_capability]
        if has_image_signal and "vision" not in capabilities:
            capabilities.insert(0, "vision")
        if has_rag_signal and "reasoning" not in capabilities:
            capabilities.append("reasoning")

        # Determine modality
        if "vision" in capabilities:
            modality = "vision"
        elif primary_capability == "coding":
            modality = "code"
        elif "spreadsheet" in desc_lower or "xlsx" in desc_lower:
            modality = "spreadsheet"
        else:
            modality = "text"

        # Complexity heuristic
        word_count = len(desc_lower.split())
        if word_count < 10 and not has_doc_signal:
            complexity = "low"
        elif word_count > 50 or (has_doc_signal and has_image_signal):
            complexity = "high"
        else:
            complexity = "medium"

        # Build explanation
        signals = []
        if has_image_signal: signals.append("image/scanned content detected")
        if has_code_signal: signals.append("code generation requested")
        if has_calc_signal: signals.append("calculation required")
        if has_rag_signal: signals.append("knowledge retrieval needed")
        if has_doc_signal: signals.append("document provided")
        if has_gen_signal: signals.append("output generation required")

        explanation = f"Task classified as '{task_type}' with {complexity} complexity. " \
                      f"Signals: {', '.join(signals) if signals else 'none detected'}. " \
                      f"Required capabilities: {', '.join(capabilities)}. " \
                      f"[Rule-based classifier v1 — confidence limited to 0.75]"

        return TaskAnalysis(
            task_type=task_type,
            modality=modality,
            required_capabilities=capabilities,
            complexity=complexity,
            requires_vision=has_image_signal,
            requires_coding=has_code_signal,
            requires_calculation=has_calc_signal,
            requires_rag=has_rag_signal,
            requires_file_generation=has_gen_signal,
            confidence=min(0.75, 0.4 + best_score * 0.1),
            explanation=explanation,
        )


class ModelRouter:
    """
    Selects the optimal local model based on TaskAnalysis and model availability.
    Falls back gracefully if primary model unavailable.
    Produces explainable routing decisions.
    """

    def __init__(self, available_models: List[dict]):
        """
        available_models: list of dicts with 'name', 'capabilities', 'is_available', 'priority'
        """
        self.models = sorted(available_models, key=lambda m: m.get("priority", 99))
        self.analyzer = TaskAnalyzer()

    def route(self, description: str, has_document: bool = False, document_type: Optional[str] = None) -> RoutingDecision:
        analysis = self.analyzer.analyze(description, has_document, document_type)

        primary_model = None
        fallback_model = None
        route_reason_parts = []

        # Select primary model matching required capabilities
        for capability in analysis.required_capabilities:
            for model in self.models:
                if capability in model.get("capabilities", []) and model.get("is_available", False):
                    primary_model = model["name"]
                    route_reason_parts.append(
                        f"Selected '{primary_model}' for capability '{capability}'"
                    )
                    break
            if primary_model:
                break

        # Fallback: select any available reasoning model
        if not primary_model:
            for model in self.models:
                if model.get("is_available", False) and "embedding" not in model.get("capabilities", []):
                    primary_model = model["name"]
                    route_reason_parts.append(
                        f"No exact-match model available; falling back to '{primary_model}'"
                    )
                    break

        # Select a fallback (different from primary)
        for model in self.models:
            if model.get("is_available", False) and model["name"] != primary_model and "embedding" not in model.get("capabilities", []):
                fallback_model = model["name"]
                break

        if not primary_model:
            primary_model = "qwen2.5:7b-instruct"  # Last resort default name
            route_reason_parts.append("No models available in Ollama — using configured default name")

        reason = (
            f"Task: '{analysis.task_type}' | "
            f"Modality: {analysis.modality} | "
            f"Complexity: {analysis.complexity} | "
            f"Required: {', '.join(analysis.required_capabilities)} | "
            + " | ".join(route_reason_parts)
        )

        logger.info(
            "routing_decision",
            task_type=analysis.task_type,
            primary_model=primary_model,
            fallback=fallback_model,
            reason=reason,
        )

        return RoutingDecision(
            primary_model=primary_model,
            fallback_model=fallback_model,
            task_analysis=analysis,
            reason=reason,
            is_rule_based=True,
        )
