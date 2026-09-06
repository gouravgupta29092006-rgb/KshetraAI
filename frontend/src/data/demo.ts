/**
 * KshetraAI — Demo Data
 * CLEARLY LABELED: All data here is synthetic/demo only.
 * No real MRPL data. No real AI results.
 * Replaced by real API calls when backend is integrated.
 */

import type {
  Task, Document, Model, Approval, Deliverable,
  AuditEvent, SovereigntyStatus, DashboardStats, SystemHealth, AgentStep
} from '../types';

// ─── [DEMO] Dashboard Stats ──────────────────────────────────────────────────
export const demoDashboardStats: DashboardStats = {
  activeTasks: 2,
  completedToday: 7,
  pendingApprovals: 3,
  documentsIndexed: 24,
  modelsAvailable: 3,
  externalAiCalls: 0,  // UI state only — backed by real counter when API connected
};

// ─── [DEMO] System Health ────────────────────────────────────────────────────
export const demoSystemHealth: SystemHealth = {
  status: 'healthy',
  database: 'connected',
  ollama: 'running',
  vectorDb: 'ready',
  uptime: 18240,
};

// ─── [DEMO] Sovereignty Status ───────────────────────────────────────────────
export const demoSovereigntyStatus: SovereigntyStatus = {
  externalAiCalls: 0,
  externalOcrCalls: 0,
  externalEmbeddingCalls: 0,
  totalLocalInferences: 47,
  totalLocalOcrOps: 12,
  totalLocalEmbeddings: 94,
  isSovereign: true,
  deploymentMode: 'LOCAL',
  inferenceLocation: 'LOCAL (Ollama · RTX 4050)',
  ocrLocation: 'LOCAL (PaddleOCR)',
  embeddingLocation: 'LOCAL (nomic-embed-text)',
  auditEnabled: true,
  rbacEnabled: true,
  sandboxEnabled: true,
  sandboxType: 'restricted_python',
};

// ─── [DEMO] Models ───────────────────────────────────────────────────────────
export const demoModels: Model[] = [
  {
    id: 'm1',
    name: 'qwen2.5:7b-instruct',
    displayName: 'Qwen2.5 7B — Reasoning',
    provider: 'Ollama',
    capabilities: ['reasoning', 'analysis', 'summarization', 'tool_calling', 'structured_output'],
    contextLength: 32768,
    modality: 'text',
    vramRequiredGb: 4.5,
    isActive: true,
    isAvailable: true,
    priority: 1,
    notes: 'Primary reasoning model. Used for inspection analysis, report generation.',
  },
  {
    id: 'm2',
    name: 'qwen2.5-coder:7b-instruct',
    displayName: 'Qwen2.5-Coder 7B — Coding',
    provider: 'Ollama',
    capabilities: ['coding', 'tool_calling', 'structured_output'],
    contextLength: 32768,
    modality: 'code',
    vramRequiredGb: 4.5,
    isActive: true,
    isAvailable: true,
    priority: 2,
    notes: 'Primary coding model for code generation and verification.',
  },
  {
    id: 'm3',
    name: 'llava:7b',
    displayName: 'LLaVA 7B — Vision',
    provider: 'Ollama',
    capabilities: ['vision', 'analysis'],
    contextLength: 4096,
    modality: 'vision',
    vramRequiredGb: 4.5,
    isActive: true,
    isAvailable: false,
    priority: 3,
    notes: 'Multimodal model for image and diagram analysis.',
  },
  {
    id: 'm4',
    name: 'nomic-embed-text',
    displayName: 'Nomic Embed — Embeddings',
    provider: 'Ollama',
    capabilities: ['embedding'],
    contextLength: 8192,
    modality: 'text',
    vramRequiredGb: 0.3,
    isActive: true,
    isAvailable: true,
    priority: 1,
    notes: 'Local embedding model for RAG knowledge retrieval.',
  },
];

// ─── [DEMO] Agent Steps ──────────────────────────────────────────────────────
export const demoAgentSteps: AgentStep[] = [
  { id: 's1', stepIndex: 0, stepType: 'ingestion', stepName: 'Document received & validated', status: 'completed', outputSummary: 'PDF validated: 12 pages, 2.4 MB', durationMs: 120, createdAt: '2026-09-07T00:41:02Z', completedAt: '2026-09-07T00:41:02Z' },
  { id: 's2', stepIndex: 1, stepType: 'ocr', stepName: 'OCR extraction', status: 'completed', outputSummary: '2,847 tokens extracted across 12 pages', durationMs: 4200, createdAt: '2026-09-07T00:41:02Z', completedAt: '2026-09-07T00:41:06Z' },
  { id: 's3', stepIndex: 2, stepType: 'task_analysis', stepName: 'Task classification', status: 'completed', outputSummary: 'Type: inspection_analysis | Complexity: high | Confidence: 0.72', durationMs: 80, createdAt: '2026-09-07T00:41:06Z', completedAt: '2026-09-07T00:41:06Z' },
  { id: 's4', stepIndex: 3, stepType: 'model_routing', stepName: 'Model routing', status: 'completed', outputSummary: 'Selected: qwen2.5:7b-instruct (Reasoning) — vision + analysis required', durationMs: 45, createdAt: '2026-09-07T00:41:06Z', completedAt: '2026-09-07T00:41:06Z' },
  { id: 's5', stepIndex: 4, stepType: 'rag', stepName: 'Knowledge retrieval', status: 'completed', outputSummary: '4 relevant SOP sections retrieved (confidence > 0.78)', durationMs: 890, createdAt: '2026-09-07T00:41:06Z', completedAt: '2026-09-07T00:41:07Z' },
  { id: 's6', stepIndex: 5, stepType: 'tool_call', stepName: 'Calculation tool executed', status: 'completed', outputSummary: 'Corrosion rate: 0.23 mm/yr | Remaining life: 14.2 years', durationMs: 2100, createdAt: '2026-09-07T00:41:07Z', completedAt: '2026-09-07T00:41:09Z' },
  { id: 's7', stepIndex: 6, stepType: 'reasoning', stepName: 'Findings synthesized', status: 'completed', outputSummary: '3 findings identified, 2 recommendations generated', durationMs: 18400, createdAt: '2026-09-07T00:41:09Z', completedAt: '2026-09-07T00:41:27Z' },
  { id: 's8', stepIndex: 7, stepType: 'validation', stepName: 'Output validation', status: 'completed', outputSummary: 'Schema PASS | Evidence PASS | Required fields PASS', durationMs: 340, createdAt: '2026-09-07T00:41:27Z', completedAt: '2026-09-07T00:41:28Z' },
  { id: 's9', stepIndex: 8, stepType: 'approval', stepName: 'Human approval requested', status: 'running', inputSummary: 'Awaiting Reviewer', createdAt: '2026-09-07T00:41:28Z' },
  { id: 's10', stepIndex: 9, stepType: 'deliverable', stepName: 'Approval note generation', status: 'pending', createdAt: '2026-09-07T00:41:28Z' },
];

// ─── [DEMO] Tasks ────────────────────────────────────────────────────────────
export const demoTasks: Task[] = [
  {
    id: 'T-1024',
    title: 'Inspection Report — CDU-2 Heat Exchanger',
    description: 'Analyze scanned inspection report for CDU-2 heat exchanger E-201A and generate approval note',
    taskType: 'inspection_analysis',
    status: 'awaiting_approval',
    createdBy: 'engineer',
    documentId: 'd1',
    documentName: 'CDU2_HX_Inspection_2026.pdf',
    selectedModel: 'qwen2.5:7b-instruct',
    routingReason: 'Document contains scanned content requiring OCR + reasoning analysis',
    resultSummary: 'Analysis complete. 3 findings. 2 recommendations. Corrosion rate within acceptable limits.',
    startedAt: '2026-09-07T00:41:02Z',
    createdAt: '2026-09-07T00:41:00Z',
    agentSteps: demoAgentSteps,
    evidenceSources: [
      { documentId: 'd2', documentName: 'Maintenance_SOP_HX.pdf', pageNumber: 4, section: '3.2 Inspection Criteria', excerpt: 'Corrosion rate exceeding 0.5 mm/yr requires immediate action...', relevanceScore: 0.91 },
      { documentId: 'd3', documentName: 'Equipment_Standards.pdf', pageNumber: 12, section: 'Appendix B', excerpt: 'API 570 guidelines specify minimum wall thickness...', relevanceScore: 0.87 },
      { documentId: 'd4', documentName: 'MRPL_Inspection_Guidelines.pdf', pageNumber: 2, section: '1.1 Scope', excerpt: 'All heat exchangers in CDU service shall undergo annual inspection...', relevanceScore: 0.84 },
      { documentId: 'd5', documentName: 'Corrosion_Reference_Guide.pdf', pageNumber: 8, section: '4.3 Calculation Methods', excerpt: 'Remaining life = (actual thickness - min thickness) / corrosion rate...', relevanceScore: 0.79 },
    ],
    deliverableId: 'del1',
  },
  {
    id: 'T-1023',
    title: 'Python Calculation — Pump NPSH Verification',
    description: 'Write and verify Python function to calculate NPSH available for centrifugal pump P-101',
    taskType: 'code_verification',
    status: 'completed',
    createdBy: 'engineer',
    selectedModel: 'qwen2.5-coder:7b-instruct',
    routingReason: 'Code generation task → Coding model selected',
    resultSummary: 'NPSH calculation verified. Code executed successfully in sandbox. Tests passed.',
    startedAt: '2026-09-06T23:15:00Z',
    completedAt: '2026-09-06T23:16:30Z',
    createdAt: '2026-09-06T23:14:55Z',
    agentSteps: [],
    deliverableId: 'del2',
  },
  {
    id: 'T-1022',
    title: 'SOP Compliance Check — P-101 Pump',
    description: 'Verify that maintenance procedure for P-101 follows the updated SOP',
    taskType: 'sop_compliance',
    status: 'completed',
    createdBy: 'analyst',
    selectedModel: 'qwen2.5:7b-instruct',
    resultSummary: 'Compliance: 8/10 items passed. 2 items require attention.',
    startedAt: '2026-09-06T22:00:00Z',
    completedAt: '2026-09-06T22:08:00Z',
    createdAt: '2026-09-06T21:59:00Z',
    agentSteps: [],
  },
];

// ─── [DEMO] Documents ────────────────────────────────────────────────────────
export const demoDocuments: Document[] = [
  {
    id: 'd1',
    filename: 'CDU2_HX_Inspection_2026.pdf',
    originalFilename: 'CDU2_HX_Inspection_2026.pdf',
    fileSizeBytes: 2457600,
    mimeType: 'application/pdf',
    title: 'CDU-2 Heat Exchanger Inspection Report 2026',
    documentType: 'inspection_report',
    classification: 'internal',
    department: 'Inspection',
    isOcrProcessed: true,
    isEmbedded: true,
    pageCount: 12,
    uploadedBy: 'engineer',
    createdAt: '2026-09-07T00:41:00Z',
  },
  {
    id: 'd2',
    filename: 'maintenance_sop_hx.pdf',
    originalFilename: 'Maintenance_SOP_HX.pdf',
    fileSizeBytes: 891000,
    mimeType: 'application/pdf',
    title: 'Heat Exchanger Maintenance SOP',
    documentType: 'sop',
    classification: 'internal',
    department: 'Maintenance',
    isOcrProcessed: true,
    isEmbedded: true,
    pageCount: 28,
    uploadedBy: 'admin',
    createdAt: '2026-09-05T10:00:00Z',
  },
  {
    id: 'd3',
    filename: 'equipment_standards.pdf',
    originalFilename: 'Equipment_Standards.pdf',
    fileSizeBytes: 1230000,
    mimeType: 'application/pdf',
    title: 'Equipment Design and Inspection Standards',
    documentType: 'manual',
    classification: 'internal',
    department: 'Engineering',
    isOcrProcessed: false,
    isEmbedded: false,
    pageCount: 94,
    uploadedBy: 'admin',
    createdAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'd4',
    filename: 'inspection_guidelines.pdf',
    originalFilename: 'MRPL_Inspection_Guidelines.pdf',
    fileSizeBytes: 654000,
    mimeType: 'application/pdf',
    title: 'Inspection Guidelines and Procedures',
    documentType: 'guideline',
    classification: 'internal',
    department: 'Inspection',
    isOcrProcessed: true,
    isEmbedded: true,
    pageCount: 36,
    uploadedBy: 'admin',
    createdAt: '2026-08-28T14:00:00Z',
  },
];

// ─── [DEMO] Approvals ────────────────────────────────────────────────────────
export const demoApprovals: Approval[] = [
  {
    id: 'ap1',
    taskId: 'T-1024',
    taskTitle: 'CDU-2 Heat Exchanger Inspection Analysis',
    requestedAt: '2026-09-07T00:41:28Z',
    status: 'pending',
    deliverableId: 'del1',
    documentName: 'Approval_Note_T1024.docx',
    evidenceCount: 4,
    validationStatus: 'pass',
  },
  {
    id: 'ap2',
    taskId: 'T-1020',
    taskTitle: 'Crude Distillation Unit — Column Tray Inspection',
    requestedAt: '2026-09-06T18:30:00Z',
    status: 'pending',
    evidenceCount: 6,
    validationStatus: 'pass',
  },
  {
    id: 'ap3',
    taskId: 'T-1018',
    taskTitle: 'Pipeline Corrosion Risk Assessment — Section 4B',
    requestedAt: '2026-09-06T15:00:00Z',
    reviewedBy: 'reviewer',
    reviewedAt: '2026-09-06T16:45:00Z',
    status: 'approved',
    reviewerNotes: 'Analysis is accurate. Recommendations align with SOP. Approved.',
    evidenceCount: 3,
    validationStatus: 'pass',
  },
];

// ─── [DEMO] Deliverables ─────────────────────────────────────────────────────
export const demoDeliverables: Deliverable[] = [
  {
    id: 'del1',
    taskId: 'T-1024',
    taskTitle: 'CDU-2 Heat Exchanger Inspection Analysis',
    deliverableType: 'docx',
    filename: 'Approval_Note_T1024_HX_CDU2.docx',
    fileSizeBytes: 48200,
    isAiGenerated: true,
    isHumanApproved: false,
    validationStatus: 'pass',
    validationNotes: 'All required sections present. Evidence citations verified.',
    createdAt: '2026-09-07T00:41:28Z',
  },
  {
    id: 'del2',
    taskId: 'T-1023',
    taskTitle: 'NPSH Calculation Verification',
    deliverableType: 'code',
    filename: 'npsh_calculator_verified.py',
    fileSizeBytes: 3200,
    isAiGenerated: true,
    isHumanApproved: true,
    validationStatus: 'pass',
    validationNotes: 'Code executed in sandbox. All 3 tests passed.',
    createdAt: '2026-09-06T23:16:30Z',
  },
];

// ─── [DEMO] Audit Events ─────────────────────────────────────────────────────
export const demoAuditEvents: AuditEvent[] = [
  { id: 'ae1', eventType: 'document_upload', userId: 'u1', userName: 'engineer', taskId: 'T-1024', resourceType: 'document', description: 'Uploaded CDU2_HX_Inspection_2026.pdf (12 pages, 2.4 MB)', status: 'success', createdAt: '2026-09-07T00:41:00Z' },
  { id: 'ae2', eventType: 'agent_step', taskId: 'T-1024', description: 'OCR extraction completed — 2,847 tokens extracted', status: 'success', createdAt: '2026-09-07T00:41:06Z' },
  { id: 'ae3', eventType: 'model_selected', taskId: 'T-1024', description: 'Model selected: qwen2.5:7b-instruct (Reasoning) — rule-based router v1', status: 'success', createdAt: '2026-09-07T00:41:06Z' },
  { id: 'ae4', eventType: 'rag_query', taskId: 'T-1024', description: 'Knowledge retrieval: 4 sources retrieved (top relevance: 0.91)', status: 'success', createdAt: '2026-09-07T00:41:07Z' },
  { id: 'ae5', eventType: 'tool_invoked', taskId: 'T-1024', description: 'Calculation tool: corrosion rate analysis — result: 0.23 mm/yr', status: 'success', createdAt: '2026-09-07T00:41:09Z' },
  { id: 'ae6', eventType: 'agent_step', taskId: 'T-1024', description: 'Validation PASS: schema, evidence, and required fields verified', status: 'success', createdAt: '2026-09-07T00:41:28Z' },
  { id: 'ae7', eventType: 'approval_requested', taskId: 'T-1024', description: 'Human approval requested for Approval_Note_T1024_HX_CDU2.docx', status: 'success', createdAt: '2026-09-07T00:41:28Z' },
  { id: 'ae8', eventType: 'deliverable_generated', taskId: 'T-1024', description: 'Deliverable generated: Approval_Note_T1024_HX_CDU2.docx (AI Generated, pending human approval)', status: 'success', createdAt: '2026-09-07T00:41:29Z' },
  { id: 'ae9', eventType: 'user_login', userId: 'u2', userName: 'reviewer', description: 'User login: reviewer', status: 'success', createdAt: '2026-09-07T00:39:00Z' },
  { id: 'ae10', eventType: 'task_completed', taskId: 'T-1023', description: 'Task T-1023 completed: NPSH calculation code verified in sandbox', status: 'success', createdAt: '2026-09-06T23:16:30Z' },
];
