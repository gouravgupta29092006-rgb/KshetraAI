import { CheckCircle2, XCircle, Clock, ChevronRight, FileText, Bot, User, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { demoApprovals } from '../data/demo';
import { cn, formatRelativeTime } from '../utils';
import type { Approval } from '../types';

const tabs = ['pending', 'approved', 'rejected', 'changes_requested'] as const;

function ApprovalCard({ approval, onAction }: { approval: Approval; onAction?: (id: string, action: string) => void }) {
  const isPending = approval.status === 'pending';
  return (
    <div className={cn(
      'card border-l-4 transition-all',
      approval.status === 'pending' ? 'border-l-accent-amber' : approval.status === 'approved' ? 'border-l-accent-green' : 'border-l-danger'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-300">{approval.taskTitle}</span>
            <span className="badge badge-neutral text-[10px]">#{approval.taskId}</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500">
            <span className="flex items-center gap-1"><Bot size={11} /> AI Generated</span>
            <span className="flex items-center gap-1">
              <span className={cn('badge text-[10px]', approval.validationStatus === 'pass' ? 'badge-green' : 'badge-red')}>
                Validation {approval.validationStatus?.toUpperCase()}
              </span>
            </span>
            <span>{approval.evidenceCount} sources</span>
            <span>Requested {formatRelativeTime(approval.requestedAt)}</span>
          </div>

          {approval.reviewerNotes && (
            <div className="mt-3 pt-3 border-t border-surface-300">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Reviewer Notes</p>
              <p className="text-xs text-slate-300">{approval.reviewerNotes}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {approval.status === 'pending' ? (
            <span className="badge badge-amber">PENDING REVIEW</span>
          ) : approval.status === 'approved' ? (
            <span className="badge badge-green">APPROVED</span>
          ) : (
            <span className="badge badge-red">{approval.status.replace('_', ' ').toUpperCase()}</span>
          )}
          {approval.reviewedAt && (
            <span className="text-[10px] text-slate-500">
              {formatRelativeTime(approval.reviewedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {isPending && onAction && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-300">
          <Link to="/runs" className="btn btn-secondary text-xs py-1.5">
            <FileText size={12} /> Review Draft
          </Link>
          <button
            onClick={() => onAction(approval.id, 'approved')}
            className="btn btn-success text-xs py-1.5"
          >
            <CheckCircle2 size={12} /> Approve
          </button>
          <button
            onClick={() => onAction(approval.id, 'changes_requested')}
            className="btn btn-ghost text-xs py-1.5 text-accent-amber"
          >
            <AlertTriangle size={12} /> Request Changes
          </button>
          <button
            onClick={() => onAction(approval.id, 'rejected')}
            className="btn btn-danger text-xs py-1.5"
          >
            <XCircle size={12} /> Reject
          </button>
        </div>
      )}

      {/* Labels */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-200">
        <span className="flex items-center gap-1 text-[10px] text-slate-600">
          <Bot size={10} /> AI Generated
        </span>
        {approval.status !== 'pending' && (
          <span className="flex items-center gap-1 text-[10px] text-slate-600">
            <User size={10} /> Human {approval.status === 'approved' ? 'Approved' : 'Reviewed'}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Approvals() {
  const [tab, setTab] = useState<typeof tabs[number]>('pending');
  const [localApprovals, setLocalApprovals] = useState(demoApprovals);

  const handleAction = (id: string, action: string) => {
    setLocalApprovals(prev => prev.map(a =>
      a.id === id ? { ...a, status: action as any, reviewedAt: new Date().toISOString(), reviewedBy: 'reviewer' } : a
    ));
  };

  const shown = localApprovals.filter(a => a.status === tab);

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: localApprovals.filter(a => a.status === 'pending').length, color: 'text-accent-amber' },
          { label: 'Approved', value: localApprovals.filter(a => a.status === 'approved').length, color: 'text-accent-green' },
          { label: 'Rejected', value: localApprovals.filter(a => a.status === 'rejected').length, color: 'text-danger' },
          { label: 'Changes Requested', value: localApprovals.filter(a => a.status === 'changes_requested').length, color: 'text-slate-400' },
        ].map(s => (
          <div key={s.label} className="card-sm text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="card-sm border-brand-600/30 bg-brand-600/5 flex items-start gap-2">
        <Bot size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400">
          All items marked <strong className="text-slate-300">AI Generated</strong> are produced by local AI models.
          They must be reviewed and explicitly <strong className="text-slate-300">Approved</strong> by a human reviewer before
          the deliverable is finalized. Approval is recorded in the audit trail.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 rounded-lg p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              tab === t ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {t.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            {' '}({localApprovals.filter(a => a.status === t).length})
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {shown.length === 0 ? (
          <div className="card text-center py-10 text-slate-500 text-sm">
            No {tab.replace('_', ' ')} approvals
          </div>
        ) : (
          shown.map(ap => <ApprovalCard key={ap.id} approval={ap} onAction={handleAction} />)
        )}
      </div>
    </div>
  );
}
