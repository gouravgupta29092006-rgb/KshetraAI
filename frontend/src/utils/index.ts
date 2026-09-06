import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}m ${s}s`;
}

export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function taskTypeLabel(type: string): string {
  const map: Record<string, string> = {
    inspection_analysis: 'Inspection Analysis',
    sop_compliance: 'SOP Compliance',
    engineering_calculation: 'Engineering Calculation',
    technical_reporting: 'Technical Reporting',
    spreadsheet_analysis: 'Spreadsheet Analysis',
    approval_note_generation: 'Approval Note',
    code_verification: 'Code Verification',
    knowledge_search: 'Knowledge Search',
    general_query: 'General Query',
  };
  return map[type] || type;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    completed: 'badge-green',
    running: 'badge-blue',
    awaiting_approval: 'badge-amber',
    pending: 'badge-neutral',
    failed: 'badge-red',
    cancelled: 'badge-neutral',
    approved: 'badge-green',
    rejected: 'badge-red',
    changes_requested: 'badge-amber',
    pass: 'badge-green',
    fail: 'badge-red',
  };
  return map[status] || 'badge-neutral';
}
