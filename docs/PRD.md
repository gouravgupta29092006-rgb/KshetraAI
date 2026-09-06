# Product Requirements Document — KshetraAI

**Version**: 1.0  
**Date**: 2026-09-07  
**Status**: ACTIVE  
**Problem Statement**: SIH26117  
**Organization**: MRPL (Mangalore Refinery and Petrochemicals Limited)

---

## 1. Problem Statement

Industrial organizations handle highly sensitive documents: approval notes, engineering calculations, inspection reports, scanned drawings, SOPs, manuals, financial data, and vendor correspondence. Existing cloud AI assistants (ChatGPT, Gemini, Claude) are unsuitable for this content because they require transmitting confidential data to external servers outside the organization's security boundary.

There is no commercially available, open-weight, sovereign AI workbench that:
- runs entirely on-premise
- supports multi-model orchestration
- handles multimodal industrial documents
- performs agentic multi-step workflows
- generates real work products
- maintains full audit trails
- operates in air-gapped environments

---

## 2. Target Users

| Persona | Role | Primary Use |
|---|---|---|
| Industrial Engineer | Creates and reviews technical content | Analyze inspection reports, generate approval notes |
| Process Analyst | Analyzes data and compliance | RAG over SOPs, compliance checking |
| Technical Reviewer | Approves AI-generated work products | Review and approve/reject AI drafts |
| IT/System Admin | Manages the platform | Model management, user admin, audit |
| Executive Viewer | Reviews summaries | View dashboards, approved deliverables |

---

## 3. User Personas

### Ramesh Kumar — Senior Process Engineer, MRPL
- Receives 5-10 inspection reports weekly
- Spends 4-6 hours manually analyzing and writing approval notes
- Needs: Fast, accurate, sourced analysis with easy approval workflow
- Pain: Cannot use cloud AI due to confidentiality

### Priya Sharma — Compliance Analyst
- Responsible for SOP compliance verification
- Searches across hundreds of procedure documents
- Needs: Natural language search over internal knowledge base
- Pain: Manual keyword search is slow and incomplete

### Vijay Nair — IT Security Manager
- Responsible for organizational data controls
- Needs: Verifiable proof that no data leaves the network
- Pain: Cloud AI tools cannot provide this guarantee

---

## 4. Use Cases

### UC-1: Inspection Report Analysis (Flagship)
1. Engineer uploads scanned inspection report (PDF/image)
2. System performs OCR and vision analysis locally
3. Task is classified and routed to appropriate local model
4. Agent retrieves relevant SOPs and reference documents
5. Agent generates structured findings and analysis
6. Validation engine checks output quality and completeness
7. Draft approval note is generated as DOCX
8. Reviewer approves/rejects/requests changes
9. Final document is stored with audit trail

### UC-2: SOP/Manual Search
1. Engineer asks natural language question
2. System searches local knowledge base (RAG)
3. Returns relevant sections with source citations
4. No document content sent to external services

### UC-3: Code Verification
1. Engineer requests a calculation script
2. Coding model generates Python code locally
3. Code runs in isolated sandbox
4. Tests execute and results captured
5. Verified, tested code returned to user

### UC-4: Spreadsheet Analysis
1. Analyst uploads equipment history XLSX
2. Agent reads and analyzes data locally
3. Statistical analysis performed
4. Summary report with charts generated

---

## 5. Goals

### Primary Goals
- G1: Demonstrate that confidential industrial work can be performed with local AI
- G2: Achieve complete data sovereignty (external AI calls = 0)
- G3: Produce actual work products (not chatbot outputs)
- G4: Provide human-in-the-loop approval workflow
- G5: Maintain auditable execution trail

### Secondary Goals
- G6: Support multiple simultaneous local models
- G7: Intelligent routing to optimal model per task
- G8: Production-quality security posture
- G9: Extensible architecture for future capabilities

---

## 6. Non-Goals

- Not a general-purpose chatbot
- Not a cloud AI wrapper
- Not a training platform (uses pre-trained open-weight models)
- Not a production MRPL deployment (prototype/MVP)
- Not a replacement for full engineering judgment
- Not claiming zero hallucinations or 100% accuracy

---

## 7. Functional Requirements

### FR-1: Authentication and Authorization
- FR-1.1: Users authenticate via username/password (JWT)
- FR-1.2: RBAC with roles: Admin, Engineer, Analyst, Reviewer, Viewer
- FR-1.3: All API endpoints enforce authorization
- FR-1.4: Document access controlled by role-based policies

### FR-2: Document Management
- FR-2.1: Upload PDF, DOCX, XLSX, PPTX, PNG, JPG, TXT
- FR-2.2: File validation (type, size, virus-free structure check)
- FR-2.3: Secure storage with path traversal protection
- FR-2.4: Document metadata: owner, department, classification, access roles
- FR-2.5: Document versioning

### FR-3: OCR and Vision
- FR-3.1: Local OCR for scanned PDFs and images (PaddleOCR)
- FR-3.2: Multi-page document processing
- FR-3.3: Image extraction from PDFs
- FR-3.4: Vision model analysis for diagrams and drawings

### FR-4: Knowledge Base (RAG)
- FR-4.1: Document chunking with overlap
- FR-4.2: Local embedding generation (nomic-embed-text)
- FR-4.3: Vector storage in ChromaDB
- FR-4.4: Semantic retrieval with permission filtering
- FR-4.5: Hybrid retrieval (semantic + keyword)
- FR-4.6: Source citation with page/section references
- FR-4.7: No fabricated citations

### FR-5: Model Management
- FR-5.1: Model registry with metadata (name, capabilities, VRAM, status)
- FR-5.2: Model health monitoring
- FR-5.3: Model add/replace without code changes
- FR-5.4: Support reasoning, coding, vision models

### FR-6: Task Routing
- FR-6.1: Classify task by type, modality, complexity
- FR-6.2: Select optimal model based on task + availability
- FR-6.3: Produce explainable routing decision
- FR-6.4: Fall back gracefully if selected model unavailable

### FR-7: Agent Execution
- FR-7.1: Multi-step plan: understand → plan → execute → validate → deliver
- FR-7.2: Tool calling (file, knowledge, calculation, code, document)
- FR-7.3: Execution timeline visible in UI
- FR-7.4: Retry/correction on validation failure
- FR-7.5: Human approval request for high-impact outputs

### FR-8: Tool Framework
- FR-8.1: File tools (read, write, list)
- FR-8.2: Knowledge tools (search, retrieve)
- FR-8.3: Calculation tools (Python executor)
- FR-8.4: Spreadsheet tools (read/analyze XLSX)
- FR-8.5: Document generation tools (DOCX, XLSX)
- FR-8.6: Code execution (sandboxed)
- FR-8.7: All tools: logged, permission-checked, traceable

### FR-9: Validation
- FR-9.1: Schema validation on structured outputs
- FR-9.2: Required field checks
- FR-9.3: Source/evidence verification
- FR-9.4: Automatic retry on validation failure
- FR-9.5: Human approval for configured workflows

### FR-10: Work Product Generation
- FR-10.1: Professional DOCX approval notes
- FR-10.2: XLSX reports with real data
- FR-10.3: Source code deliverables
- FR-10.4: All deliverables stored and downloadable

### FR-11: Approval Workflow
- FR-11.1: AI-generated draft submitted for review
- FR-11.2: Reviewer can: Approve / Reject / Request Changes
- FR-11.3: Clear labeling: AI Generated vs Human Approved
- FR-11.4: Approval recorded in audit

### FR-12: Audit Trail
- FR-12.1: Every significant action logged (user, action, timestamp, result)
- FR-12.2: Audit logs immutable (append-only)
- FR-12.3: Audit log viewable in UI
- FR-12.4: Audit log exportable

### FR-13: Sovereignty Monitoring
- FR-13.1: Real-time display of external AI call count (must be 0)
- FR-13.2: Display of all AI processing locations (LOCAL)
- FR-13.3: Backed by actual application state

---

## 8. Non-Functional Requirements

- NFR-1: Response time < 30s for routing decision
- NFR-2: Full workflow < 5 minutes on demo hardware
- NFR-3: Support 5 concurrent users (MVP)
- NFR-4: VRAM usage ≤ 6 GB (one model at a time)
- NFR-5: Air-gap capable after initial model download
- NFR-6: No external network calls during inference
- NFR-7: All secrets in environment variables, never in code

---

## 9. Security Requirements

- SR-1: Passwords hashed with bcrypt (cost ≥ 12)
- SR-2: JWT tokens with short expiry (60 min)
- SR-3: RBAC enforced server-side
- SR-4: File upload: type/size/structure validation
- SR-5: Path traversal protection on all file operations
- SR-6: Document content treated as untrusted (prompt injection awareness)
- SR-7: Code execution sandboxed
- SR-8: Audit logging for all sensitive operations
- SR-9: No secrets in logs

---

## 10. AI Requirements

- AI-1: All inference via local open-weight models
- AI-2: No external AI API calls in default configuration
- AI-3: Models: at minimum reasoning + coding + vision
- AI-4: Model registry with capability metadata
- AI-5: Explainable routing decisions
- AI-6: Evidence-backed outputs (citations)
- AI-7: Validation before delivery
- AI-8: Human approval for high-impact workflows
- AI-9: No hallucinated citations

---

## 11. Sovereignty Requirements

- SOV-1: All AI inference runs locally
- SOV-2: All OCR runs locally
- SOV-3: All embeddings generated locally
- SOV-4: All vector search runs locally
- SOV-5: No telemetry to external AI services
- SOV-6: Air-gap deployment supported
- SOV-7: Sovereignty status visible in UI

---

## 12. MVP Scope

**In scope:**
- Full flagship workflow: inspection report → DOCX approval note
- Secondary: coding task → sandbox → verified code
- Authentication + RBAC
- Local RAG with 3-5 seeded documents
- 3 local models (reasoning, coding, vision)
- Audit trail
- Sovereignty status display
- Document management
- Approval workflow

**Out of scope for MVP:**
- SAP integration
- LDAP/Active Directory
- Plant data systems
- Email integration
- Multi-server inference
- Automated backup system
- Kubernetes deployment
- Full enterprise SSO

---

## 13. Success Criteria

The MVP is successful when:
1. ✅ Flagship workflow runs end-to-end without manual intervention
2. ✅ External AI calls = 0 verified
3. ✅ Generated DOCX is professional and content-accurate
4. ✅ Human approval workflow functional
5. ✅ Audit trail complete and accurate
6. ✅ All acceptance criteria in spec met or documented as environment limitations

---

## 14. Acceptance Criteria

See `docs/TRACKER.md` for detailed acceptance criteria tracking.
