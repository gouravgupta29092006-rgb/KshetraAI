# KshetraAI
## Sovereign Industrial AI Execution Platform

> **"Confidential Data → Verified Work"**  
> *Intelligence Within Your Boundary.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![SIH 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://www.sih.gov.in/)
[![Problem: SIH26117](https://img.shields.io/badge/Problem-SIH26117-orange.svg)]()
[![Status: MVP](https://img.shields.io/badge/Status-MVP-green.svg)]()

---

## What is KshetraAI?

KshetraAI is a **sovereign industrial AI control and execution platform** built for Smart India Hackathon 2026 (Problem Statement: SIH26117, Organization: MRPL).

It enables confidential industrial organizations to perform complex knowledge work — such as analyzing scanned inspection reports, generating approval notes, verifying engineering calculations, and executing and testing code — using open-weight AI models that run **entirely within the organization's security boundary**.

**No data leaves the organization. No cloud AI APIs are used. External AI calls = 0.**

---

## The Core Problem

Industrial organizations like Mangalore Refinery and Petrochemicals Limited (MRPL) handle:
- Confidential engineering documents
- Internal inspection reports and approval notes
- Scanned drawings and technical manuals
- Proprietary financial and vendor data
- Internal code and automation scripts

Cloud AI assistants (ChatGPT, Gemini, Claude, etc.) are unsuitable because they require sending this confidential data to external servers.

---

## KshetraAI's Solution

```
SCANNED INSPECTION REPORT
         ↓
  LOCAL OCR / VISION
         ↓
   TASK ANALYSIS
         ↓
INTELLIGENT MODEL ROUTING
         ↓
  AGENTIC EXECUTION
         ↓
LOCAL KNOWLEDGE RETRIEVAL
         ↓
  TOOL / CALCULATION
         ↓
     VALIDATION
         ↓
  HUMAN APPROVAL
         ↓
  APPROVAL NOTE (.DOCX)
         ↓
    AUDIT TRAIL
━━━━━━━━━━━━━━━━━━
LOCAL / ON-PREMISE
EXTERNAL AI CALLS = 0
```

---

## System Components

| Component | Description |
|---|---|
| **Sovereign Model Fabric** | Local open-weight model registry, serving, and lifecycle |
| **Intelligent Model Router** | Task analyzer + rule-based/ML router → selects best local model |
| **Industrial Agent Engine** | LangGraph stateful agent: plan → execute → validate → deliver |
| **Industrial Knowledge Fabric** | Local document ingestion, OCR, chunking, ChromaDB vector RAG |
| **Work-Product Engine** | DOCX / XLSX / code deliverable generators |
| **Sovereignty Governance Layer** | Permission-aware RAG, audit, RBAC, network isolation status |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11, FastAPI, SQLAlchemy, Alembic |
| Database | SQLite (dev) / PostgreSQL (production) |
| Vector DB | ChromaDB (embedded, local) |
| AI Runtime | Ollama (local, CUDA-accelerated) |
| Agent | LangGraph |
| OCR | PaddleOCR |
| Document | PyMuPDF, python-docx, openpyxl |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Auth | JWT + bcrypt, RBAC |

---

## Hardware Requirements

| Tier | CPU | RAM | GPU | VRAM |
|---|---|---|---|---|
| Minimum | 4 core | 8 GB | Any CUDA GPU | 4 GB |
| **Demo (this machine)** | **i5-13420H** | **16 GB** | **RTX 4050** | **6 GB** |
| Recommended | 8+ core | 32 GB | RTX 3080+ | 12 GB |
| Production-style | 16+ core | 64 GB | A100/H100 | 40-80 GB |

---

## Quick Start (Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.ai) installed
- Git

### 1. Clone and set up backend

```bash
git clone https://github.com/gouravgupta29092006-rgb/KshetraAI.git
cd KshetraAI/backend

python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Linux/Mac

pip install -r requirements.txt
cp .env.example .env
# Edit .env if needed

# Run database migrations
alembic upgrade head

# Seed demo data
python scripts/seed_demo.py

# Start backend
uvicorn app.main:app --reload --port 8000
```

### 2. Pull required AI models (first time)

```bash
ollama pull qwen2.5:7b-instruct
ollama pull qwen2.5-coder:7b-instruct
ollama pull nomic-embed-text
ollama pull llava:7b
```

### 3. Set up and start frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### 4. Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Default credentials (demo only)

| Role | Username | Password |
|---|---|---|
| Admin | admin | Admin@KshetraAI2026! |
| Engineer | engineer | Engineer@2026! |
| Analyst | analyst | Analyst@2026! |
| Reviewer | reviewer | Reviewer@2026! |

---

## Flagship Demo Workflow

1. Login as `engineer`
2. Go to **New Work**
3. Upload `demo-data/inspection_report_sample.pdf`
4. Observe the execution timeline:
   - ✓ File validated and stored
   - ✓ OCR extraction completed
   - ✓ Vision analysis completed
   - ✓ Task classified: Inspection Analysis
   - ✓ Model selected: qwen2.5:7b-instruct (Reasoning)
   - ✓ Knowledge retrieved: 4 relevant SOP sections
   - ✓ Analysis generated
   - ✓ Validation: PASS
   - ⏳ Approval requested
5. Login as `reviewer` → Approvals → Approve
6. Download `Approval_Note_[ID].docx`
7. Check Audit Trail
8. Check Sovereignty Status → External AI Calls: 0

---

## Sovereignty Guarantee

KshetraAI is designed so that:
- **All AI inference** runs via Ollama on local GPU/CPU
- **All OCR** runs via PaddleOCR locally
- **All embeddings** are generated by nomic-embed-text locally
- **All vector search** runs via ChromaDB locally
- **No telemetry** is sent externally
- The system can run **air-gapped** (no internet required after initial model download)

*Note: "Sovereign" refers to deployment architecture and data locality, not absolute security guarantees. Organizational network controls are also required.*

---

## Documentation

| Document | Description |
|---|---|
| [PRD](docs/PRD.md) | Product Requirements Document |
| [Architecture](docs/ARCHITECTURE.md) | System and component architecture |
| [AI Architecture](docs/AI_ARCHITECTURE.md) | AI layer: models, routing, agents |
| [Security](docs/SECURITY.md) | Threat model and security controls |
| [API](docs/API.md) | API contracts |
| [Database Schema](docs/DATABASE_SCHEMA.md) | Entity relationships |
| [Deployment](docs/DEPLOYMENT.md) | Setup and deployment guide |
| [Demo](docs/DEMO.md) | Demo script and workflow |
| [Current Status](docs/CURRENT_STATUS.md) | What is built and working |
| [Tracker](docs/TRACKER.md) | Task and milestone tracker |
| [Known Limitations](docs/KNOWN_LIMITATIONS.md) | Honest limitations |
| [Hardware Requirements](docs/HARDWARE_REQUIREMENTS.md) | Hardware guide |
| [Tech Stack](docs/TECH_STACK.md) | Full technology stack |

---

## License

MIT License — see [LICENSE](LICENSE)

---

## Disclaimer

This is an academic/hackathon prototype built for SIH 2026.  
It uses **synthetic/public sample data only** — no MRPL confidential data is included.  
It is not a production system.  
Do not deploy without organizational security review.

---

*Built for SIH 2026 · Problem SIH26117 · MRPL*
