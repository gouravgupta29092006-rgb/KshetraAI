import { Link } from 'react-router-dom';
import {
  Activity, Clock, CheckCircle2, FileText, Database, Cpu,
  Shield, AlertTriangle, ArrowRight, TrendingUp, Zap, Bot
} from 'lucide-react';
import {
  demoDashboardStats, demoTasks, demoApprovals,
  demoModels, demoSystemHealth, demoSovereigntyStatus
} from '../data/demo';
import { cn, formatRelativeTime, taskTypeLabel, statusColor } from '../utils';
import WorkflowTimeline from '../components/workflow/WorkflowTimeline';

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, icon, sub, color = 'text-slate-100' }: {
  label: string; value: string | number; icon: React.ReactNode;
  sub?: string; color?: string;
}) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <span className="metric-label">{label}</span>
        <span className="text-slate-500">{icon}</span>
      </div>
      <span className={cn('metric-value', color)}>{value}</span>
      {sub && <span className="text-[11px] text-slate-500">{sub}</span>}
    </div>
  );
}

// ─── Active Task Card ─────────────────────────────────────────────────────────
function ActiveTaskCard({ task }: { task: typeof demoTasks[0] }) {
  const completedSteps = task.agentSteps.filter(s => s.status === 'completed').length;
  const totalSteps = task.agentSteps.length;
  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Link to={`/runs`} className="card hover:border-brand-600/50 transition-all block group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('badge', statusColor(task.status))}>
              {task.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-500">{taskTypeLabel(task.taskType)}</span>
          </div>
          <p className="text-sm font-medium text-slate-200 truncate group-hover:text-brand-300 transition-colors">
            {task.title}
          </p>
        </div>
        <ArrowRight size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors flex-shrink-0 mt-1" />
      </div>

      {totalSteps > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>{completedSteps}/{totalSteps} steps</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1 bg-surface-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-[11px] text-slate-500">
        {task.selectedModel && <span>Model: {task.selectedModel.split(':')[0]}</span>}
        {task.documentName && <span className="truncate">Doc: {task.documentName}</span>}
      </div>
    </Link>
  );
}

// ─── System Status Bar ────────────────────────────────────────────────────────
function SystemStatusBar() {
  const h = demoSystemHealth;
  const s = demoSovereigntyStatus;
  const items = [
    { label: 'Database', value: h.database, ok: h.database === 'connected' },
    { label: 'Ollama', value: h.ollama, ok: h.ollama === 'running' },
    { label: 'Vector DB', value: h.vectorDb, ok: h.vectorDb === 'ready' },
    { label: 'External AI', value: `${s.externalAiCalls} calls`, ok: s.externalAiCalls === 0 },
  ];
  return (
    <div className="flex items-center gap-6 flex-wrap">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={cn('w-1.5 h-1.5 rounded-full', item.ok ? 'bg-accent-green' : 'bg-danger')} />
          <span className="text-xs text-slate-400">{item.label}</span>
          <span className={cn('text-xs font-medium', item.ok ? 'text-accent-green' : 'text-danger')}>
            {item.value.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const stats = demoDashboardStats;
  const activeTasks = demoTasks.filter(t => t.status === 'running' || t.status === 'awaiting_approval');
  const pendingApprovals = demoApprovals.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Industrial AI Execution Platform</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Sovereign · Local · Auditable
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 rounded-lg">
            <span className="sovereign-dot" />
            <span className="text-xs font-semibold text-accent-green">LOCAL / ON-PREMISE</span>
          </div>
          <div className="px-3 py-1.5 bg-surface-200 border border-surface-300 rounded-lg text-center">
            <span className="text-xs text-slate-500 block">Ext. AI Calls</span>
            <span className="text-lg font-bold text-accent-green leading-none">0</span>
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="card-sm flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
        <span className="text-xs font-medium text-accent-green">SYSTEM HEALTHY</span>
        <div className="h-4 w-px bg-surface-300" />
        <SystemStatusBar />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Active Tasks" value={stats.activeTasks}
          icon={<Activity size={16} />} color="text-accent-blue"
          sub="running now"
        />
        <MetricCard
          label="Completed Today" value={stats.completedToday}
          icon={<CheckCircle2 size={16} />} color="text-accent-green"
        />
        <MetricCard
          label="Pending Approvals" value={stats.pendingApprovals}
          icon={<AlertTriangle size={16} />} color="text-accent-amber"
          sub="awaiting review"
        />
        <MetricCard
          label="Documents Indexed" value={stats.documentsIndexed}
          icon={<Database size={16} />} color="text-brand-400"
        />
        <MetricCard
          label="Models Available" value={stats.modelsAvailable}
          icon={<Cpu size={16} />} color="text-accent-purple"
        />
        <MetricCard
          label="External AI Calls" value={stats.externalAiCalls}
          icon={<Shield size={16} />} color="text-accent-green"
          sub="sovereignty ✓"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Work — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity size={14} className="text-accent-blue" />
              Active Work
            </h3>
            <Link to="/runs" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {activeTasks.length > 0 ? (
            <div className="space-y-3">
              {activeTasks.map(task => <ActiveTaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="card text-center py-8 text-slate-500 text-sm">
              No active tasks. <Link to="/work/new" className="text-brand-400">Start new work</Link>
            </div>
          )}

          {/* Featured task timeline */}
          {activeTasks[0]?.agentSteps?.length > 0 && (
            <div className="card">
              <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">
                Live Execution — {activeTasks[0].title}
              </p>
              <WorkflowTimeline steps={activeTasks[0].agentSteps.slice(0, 5)} />
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Pending Approvals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <AlertTriangle size={14} className="text-accent-amber" />
                Pending Approvals
              </h3>
              <Link to="/approvals" className="text-xs text-brand-400 hover:text-brand-300">
                <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {pendingApprovals.slice(0, 3).map(ap => (
                <Link key={ap.id} to="/approvals" className="card-sm block hover:border-accent-amber/40 transition-all">
                  <p className="text-xs font-medium text-slate-200 truncate mb-1">{ap.taskTitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="badge badge-green text-[10px]">Validation {ap.validationStatus.toUpperCase()}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(ap.requestedAt).toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Model Fabric */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Cpu size={14} className="text-accent-purple" />
              Model Fabric
            </h3>
            <div className="space-y-2">
              {demoModels.filter(m => m.name !== 'nomic-embed-text').map(model => (
                <div key={model.id} className="card-sm flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', model.isAvailable ? 'bg-accent-green' : 'bg-surface-400')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{model.displayName}</p>
                    <p className="text-[10px] text-slate-500">{model.capabilities.slice(0, 2).join(' · ')}</p>
                  </div>
                  <span className={cn('badge text-[10px]', model.isAvailable ? 'badge-green' : 'badge-neutral')}>
                    {model.isAvailable ? 'UP' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Zap size={14} className="text-accent-amber" />
              Quick Start
            </h3>
            <div className="space-y-2">
              <Link to="/work/new" className="btn btn-primary w-full justify-center">
                <Bot size={14} /> New AI Task
              </Link>
              <Link to="/documents" className="btn btn-secondary w-full justify-center">
                <FileText size={14} /> Upload Document
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
