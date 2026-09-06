// KshetraAI — Core TypeScript interfaces
// These define the data contracts for all UI components.
// Backend API integration will implement these same shapes.

export type UserRole = 'admin' | 'engineer' | 'analyst' | 'reviewer' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
}

export type TaskType =
  | 'inspection_analysis'
  | 'sop_compliance'
  | 'engineering_calculation'
  | 'technical_reporting'
  | 'spreadsheet_analysis'
  | 'approval_note_generation'
  | 'code_verification'
  | 'knowledge_search'
  | 'general_query';

export type TaskStatus =
  | 'pending'
  | 'running'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  taskType: TaskType;
  status: TaskStatus;
  createdBy: string;
  documentId?: string;
  documentName?: string;
  selectedModel?: string;
  routingReason?: string;
  resultSummary?: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  agentSteps: AgentStep[];
  evidenceSources?: EvidenceSource[];
  deliverableId?: string;
}

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface AgentStep {
  id: string;
  stepIndex: number;
  stepType: string;
  stepName: string;
  status: StepStatus;
  inputSummary?: string;
  outputSummary?: string;
  error?: string;
  durationMs?: number;
  createdAt: string;
  completedAt?: string;
}

export type DocumentClassification = 'public' | 'internal' | 'confidential' | 'restricted';

export interface Document {
  id: string;
  filename: string;
  originalFilename: string;
  fileSizeBytes: number;
  mimeType?: string;
  title?: string;
  description?: string;
  documentType?: string;
  classification: DocumentClassification;
  department?: string;
  isOcrProcessed: boolean;
  isEmbedded: boolean;
  pageCount?: number;
  processingError?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface EvidenceSource {
  documentId: string;
  documentName: string;
  pageNumber?: number;
  section?: string;
  excerpt: string;
  relevanceScore: number;
}

export type ModelCapability =
  | 'reasoning'
  | 'coding'
  | 'vision'
  | 'embedding'
  | 'tool_calling'
  | 'summarization'
  | 'analysis'
  | 'structured_output';

export interface Model {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  capabilities: ModelCapability[];
  contextLength?: number;
  modality: 'text' | 'vision' | 'code';
  vramRequiredGb?: number;
  isActive: boolean;
  isAvailable: boolean;
  priority: number;
  notes?: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export interface Approval {
  id: string;
  taskId: string;
  taskTitle: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  status: ApprovalStatus;
  reviewerNotes?: string;
  deliverableId?: string;
  documentName?: string;
  evidenceCount: number;
  validationStatus: 'pending' | 'pass' | 'fail';
}

export type DeliverableType = 'docx' | 'xlsx' | 'pptx' | 'code' | 'report';

export interface Deliverable {
  id: string;
  taskId: string;
  taskTitle: string;
  deliverableType: DeliverableType;
  filename: string;
  fileSizeBytes?: number;
  isAiGenerated: boolean;
  isHumanApproved: boolean;
  validationStatus: 'pending' | 'pass' | 'fail';
  validationNotes?: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  eventType: string;
  userId?: string;
  userName?: string;
  taskId?: string;
  resourceType?: string;
  resourceId?: string;
  description: string;
  status: 'success' | 'failure' | 'warning';
  createdAt: string;
}

export interface SovereigntyStatus {
  externalAiCalls: number;
  externalOcrCalls: number;
  externalEmbeddingCalls: number;
  totalLocalInferences: number;
  totalLocalOcrOps: number;
  totalLocalEmbeddings: number;
  isSovereign: boolean;
  deploymentMode: 'LOCAL' | 'HYBRID' | 'CLOUD';
  inferenceLocation: string;
  ocrLocation: string;
  embeddingLocation: string;
  auditEnabled: boolean;
  rbacEnabled: boolean;
  sandboxEnabled: boolean;
  sandboxType: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  database: 'connected' | 'disconnected';
  ollama: 'running' | 'stopped';
  vectorDb: 'ready' | 'empty' | 'error';
  uptime: number; // seconds
}

export interface DashboardStats {
  activeTasks: number;
  completedToday: number;
  pendingApprovals: number;
  documentsIndexed: number;
  modelsAvailable: number;
  externalAiCalls: number; // must be 0
}

// ─── Routing Decision ─────────────────────────────────────────────────────

export interface RoutingDecision {
  taskType: string;
  modality: string;
  requiredCapabilities: string[];
  complexity: 'low' | 'medium' | 'high';
  primaryModel: string;
  fallbackModel?: string;
  reason: string;
  confidence: number;
  isRuleBased: boolean;
}
