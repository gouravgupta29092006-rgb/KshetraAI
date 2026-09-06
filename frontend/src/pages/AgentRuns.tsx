import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, CheckCircle2, XCircle, ChevronRight, Bot } from 'lucide-react';
import { demoTasks } from '../data/demo';
import { cn, taskTypeLabel, statusColor, formatRelativeTime } from '../utils';
import WorkflowTimeline from '../components/workflow/WorkflowTimeline';
import EvidenceCard from '../components/workflow/EvidenceCard';

export default function AgentRuns() {
  const [selected, setSelected] = useState(demoTasks[0]);

  return (
    <div className="flex gap-6 h-full animate-slide-in">
      {/* Task list */}
      <div className="w-72 flex-shrink-0 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-200">Agent Runs</h2>
          <Link to="/work/new" className="btn btn-primary py-1 px-2 text-xs">+ New</Link>
        </div>
        {demoTasks.map(task => (
          <button
            key={task.id}
            onClick={() => setSelected(task)}
            className={cn(
              'w-full card-sm text-left hover:border-brand-600/40 transition-all',
              selected.id === task.id && 'border-brand-600/70 bg-brand-600/5'
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={cn('badge text-[10px]', statusColor(task.status))}>
                {task.status.toUpperCase().replace('_', ' ')}
              </span>
              <span className="text-[10px] text-slate-500 truncate">{task.id}</span>
            </div>
            <p className="text-xs font-medium text-slate-200 mb-1 line-clamp-2">{task.title}</p>
            <p className="text-[10px] text-slate-500">{formatRelativeTime(task.createdAt)}</p>
          </button>
        ))}
      </div>

      {/* Task detail */}
      <div className="flex-1 overflow-y-auto space-y-4 min-w-0">
        {/* Header */}
        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('badge', statusColor(selected.status))}>
                  {selected.status.toUpperCase().replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">#{selected.id}</span>
                <span className="badge badge-neutral text-[10px]">{taskTypeLabel(selected.taskType)}</span>
              </div>
              <h2 className="text-base font-semibold text-slate-100 mb-1">{selected.title}</h2>
              <p className="text-sm text-slate-400">{selected.description}</p>
            </div>
            <Bot size={32} className="text-brand-600/40 flex-shrink-0" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-surface-300">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Model</p>
              <p className="text-xs font-medium text-slate-200">{selected.selectedModel || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Document</p>
              <p className="text-xs font-medium text-slate-200 truncate">{selected.documentName || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Created</p>
              <p className="text-xs text-slate-300">{new Date(selected.createdAt).toLocaleTimeString()}</p>
            </div>
            {selected.completedAt && (
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">Completed</p>
                <p className="text-xs text-slate-300">{new Date(selected.completedAt).toLocaleTimeString()}</p>
              </div>
            )}
          </div>

          {selected.routingReason && (
            <div className="mt-3 pt-3 border-t border-surface-300">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Routing Decision</p>
              <p className="text-xs text-slate-400 leading-relaxed">{selected.routingReason}</p>
            </div>
          )}
        </div>

        {/* Result */}
        {selected.resultSummary && (
          <div className="card border-accent-green/30 bg-accent-green/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Result Summary</p>
            <p className="text-sm text-slate-200">{selected.resultSummary}</p>
          </div>
        )}

        {/* Two cols: Timeline + Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Execution Timeline */}
          {selected.agentSteps.length > 0 && (
            <div className="card">
              <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Activity size={12} /> Execution Timeline
              </p>
              <WorkflowTimeline steps={selected.agentSteps} />
            </div>
          )}

          {/* Evidence */}
          {selected.evidenceSources && selected.evidenceSources.length > 0 && (
            <div className="card">
              <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wide">
                Evidence Sources ({selected.evidenceSources.length})
              </p>
              <EvidenceCard sources={selected.evidenceSources} />
            </div>
          )}
        </div>

        {/* Actions */}
        {selected.status === 'awaiting_approval' && (
          <div className="card border-accent-amber/30 bg-accent-amber/5">
            <p className="text-sm font-medium text-accent-amber mb-1">⏳ Awaiting Human Approval</p>
            <p className="text-xs text-slate-400 mb-3">
              AI analysis complete. Validation passed. A reviewer must approve before the deliverable is finalized.
            </p>
            <Link to="/approvals" className="btn btn-secondary text-xs">
              Go to Approvals <ChevronRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
