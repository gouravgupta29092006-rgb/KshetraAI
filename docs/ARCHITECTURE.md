# Architecture — KshetraAI

**Version**: 1.0  
**Date**: 2026-09-07

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORGANIZATION BOUNDARY                         │
│                                                                  │
│  ┌────────────────┐     ┌──────────────────────────────────┐    │
│  │   BROWSER      │────▶│      FRONTEND (React/Vite)       │    │
│  │  (Intranet)    │     │     localhost:5173               │    │
│  └────────────────┘     └──────────────────┬───────────────┘    │
│                                            │ HTTPS REST         │
│                          ┌─────────────────▼───────────────┐    │
│                          │    BACKEND (FastAPI/Python)      │    │
│                          │        localhost:8000            │    │
│                          │                                  │    │
│                          │  ┌────────┐  ┌────────────────┐ │    │
│                          │  │ Auth/  │  │  Task Analyzer  │ │    │
│                          │  │ RBAC   │  │  Model Router   │ │    │
│                          │  └────────┘  └────────┬───────┘ │    │
│                          │                       │         │    │
│                          │  ┌────────────────────▼───────┐ │    │
│                          │  │   Agent Engine (LangGraph)  │ │    │
│                          │  │   Plan→Execute→Validate     │ │    │
│                          │  └──┬──────────┬──────────┬───┘ │    │
│                          │     │          │          │     │    │
│                          │  ┌──▼──┐  ┌───▼──┐  ┌───▼──┐  │    │
│                          │  │Tools│  │ RAG  │  │Deliv.│  │    │
│                          │  └──┬──┘  └───┬──┘  └───────┘  │    │
│                          └─────┼─────────┼────────────────┘    │
│                                │         │                      │
│    ┌──────────────────┐        │   ┌─────▼──────────────────┐  │
│    │  Ollama Server   │◀───────┘   │  ChromaDB Vector DB    │  │
│    │  localhost:11434 │            │  (Local embedded)      │  │
│    │  ┌────────────┐  │            └────────────────────────┘  │
│    │  │qwen2.5:7b  │  │                                        │
│    │  │qwen2.5-    │  │   ┌──────────────────────────────────┐ │
│    │  │coder:7b   │  │   │  SQLite/PostgreSQL Database      │ │
│    │  │llava:7b   │  │   │  (Users, Tasks, Audit, Docs)    │ │
│    │  │nomic-embed│  │   └──────────────────────────────────┘ │
│    │  └────────────┘  │                                        │
│    └──────────────────┘   ┌──────────────────────────────────┐ │
│                           │  File Storage (Local Disk)       │ │
│                           │  /uploads  /deliverables         │ │
│                           └──────────────────────────────────┘ │
│                                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  INTERNET ACCESS: BLOCKED for all AI/data processing paths      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Backend Modules

```
backend/app/
├── main.py                    # FastAPI app entry point
├── api/                       # HTTP layer only
│   ├── auth.py                # Login, refresh, logout
│   ├── users.py               # User management
│   ├── documents.py           # Upload, list, retrieve
│   ├── tasks.py               # Create, list, status
│   ├── models.py              # Model registry API
│   ├── approvals.py           # Review workflow
│   ├── deliverables.py        # Download work products
│   ├── audit.py               # Audit log API
│   └── sovereignty.py         # System status API
├── core/
│   ├── config.py              # Settings (Pydantic BaseSettings)
│   ├── database.py            # SQLAlchemy session
│   ├── security.py            # JWT, password hashing
│   └── logging.py             # Structured logging
├── models/                    # SQLAlchemy ORM models
│   ├── user.py
│   ├── document.py
│   ├── task.py
│   ├── agent_step.py
│   ├── tool_invocation.py
│   ├── approval.py
│   ├── deliverable.py
│   └── audit_event.py
├── schemas/                   # Pydantic request/response schemas
├── services/                  # Business logic
│   ├── user_service.py
│   ├── document_service.py
│   └── task_service.py
├── inference/                 # AI model gateway (abstraction layer)
│   ├── base.py                # InferenceProvider protocol
│   ├── ollama_provider.py     # OllamaProvider implementation
│   └── registry.py            # Model registry
├── router/                    # Task analysis and model routing
│   ├── task_analyzer.py
│   └── model_router.py
├── agents/                    # LangGraph agent
│   ├── industrial_agent.py    # Main agent graph
│   └── state.py               # Agent state definition
├── tools/                     # Tool framework
│   ├── base.py                # BaseTool protocol
│   ├── file_tools.py
│   ├── knowledge_tools.py
│   ├── calculation_tools.py
│   ├── spreadsheet_tools.py
│   ├── document_tools.py
│   └── code_tools.py
├── rag/                       # Knowledge fabric
│   ├── chunker.py
│   ├── embedder.py
│   ├── vector_store.py        # ChromaDB wrapper
│   └── retriever.py           # Permission-aware retrieval
├── documents/                 # Document intelligence
│   ├── ingestion.py           # Upload pipeline
│   ├── ocr.py                 # PaddleOCR wrapper
│   ├── parser.py              # PyMuPDF, docx, xlsx parsers
│   └── classifier.py
├── deliverables/              # Work product generation
│   ├── docx_generator.py
│   ├── xlsx_generator.py
│   └── code_generator.py
├── validation/                # Output validation
│   └── validator.py
├── security/                  # Security utilities
│   ├── rbac.py
│   └── input_validator.py
├── audit/                     # Audit logging
│   └── audit_logger.py
└── demo/                      # Demo seed data
    └── seed.py
```

---

## 3. Data Flow

### Document Ingestion Flow
```
Upload Request
      ↓
Input Validation (type, size, malware structure)
      ↓
Secure Storage (hash-named, path-traversal-safe)
      ↓
Format Detection (PDF/DOCX/XLSX/image)
      ↓
OCR (if scanned/image) → PaddleOCR
      ↓
Text Extraction → PyMuPDF / python-docx / openpyxl
      ↓
Metadata Extraction (pages, author, date)
      ↓
Document Classification
      ↓
Chunking (recursive, with overlap)
      ↓
Embedding (nomic-embed-text via Ollama)
      ↓
Vector Storage (ChromaDB with permission metadata)
      ↓
Metadata Storage (SQLite)
      ↓
DONE
```

### Agent Execution Flow
```
Task Request (user_id, task_description, document_id)
      ↓
Task Analyzer (classify type, modality, complexity)
      ↓
Model Router (select model, explain reason)
      ↓
Agent START (LangGraph graph entry)
      ↓
PLAN (LLM generates step plan)
      ↓
[For each step]:
  Tool Selection
  Permission Check
  Tool Execution (logged to DB)
  Observation
  RAG Retrieval if needed
  ↓
Reasoning (LLM synthesizes findings)
      ↓
Validation Engine
  → FAIL: Retry/Correct (max 3 iterations)
  → PASS: Continue
      ↓
Work Product Generation (DOCX/XLSX/code)
      ↓
Approval Request (if configured)
      ↓
Audit Record
      ↓
Task COMPLETE
```

---

## 4. Security Boundaries

```
Trust Level 0 (Untrusted):
  - Uploaded documents (may contain prompt injection)
  - User input (validated but treated as untrusted)

Trust Level 1 (Authenticated user):
  - API requests with valid JWT
  - Subject to RBAC

Trust Level 2 (System):
  - Internal service calls
  - Database operations
  - File system (within upload directory)

Trust Level 3 (Admin):
  - Model registry management
  - User management
  - Audit log access

NEVER promoted:
  - Document content → System instructions
  - User input → Shell execution
  - AI output → Direct file system access (must go through tool framework)
```

---

## 5. Network Isolation

The system is designed for air-gapped deployment:

```
Outbound network calls from application code:
  - Ollama: 127.0.0.1:11434 (localhost ONLY)
  - ChromaDB: embedded (no network)
  - PostgreSQL/SQLite: localhost ONLY
  - Frontend→Backend: localhost:8000 ONLY

External AI API calls: DISABLED (no API keys, no external endpoints)
Telemetry: DISABLED
External model downloads: Only at initial setup (then air-gapped)
```

---

## 6. Failure Handling

| Failure | Response |
|---|---|
| Model unavailable | Router selects fallback or returns clear error |
| OCR fails | Retry with alternate parser; flag for human review |
| RAG unavailable | Report knowledge retrieval failure; continue without |
| Sandbox fails | Terminate safely; return sandboxed failure result |
| Validation fails | Retry (max 3x); then request human review |
| DB unavailable | Return 503; no silent failures |
| Upload malformed | Reject with specific reason; no processing |
