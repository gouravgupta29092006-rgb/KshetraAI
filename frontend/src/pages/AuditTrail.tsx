import { demoAuditEvents } from '../data/demo';
import { cn, formatDateTime } from '../utils';
import { useState } from 'react';
import { Search, Shield, Bot, User, FileText, Cpu } from 'lucide-react';

const eventColors: Record<string, string> = {
  user_login: 'text-accent-blue', user_logout: 'text-slate-400',
  document_upload: 'text-brand-400', document_access: 'text-slate-400',
  task_created: 'text-accent-blue', task_completed: 'text-accent-green', task_failed: 'text-danger',
  agent_step: 'text-brand-400', tool_invoked: 'text-accent-purple',
  model_selected: 'text-accent-purple', rag_query: 'text-brand-400',
  approval_requested: 'text-accent-amber', approval_granted: 'text-accent-green',
  approval_rejected: 'text-danger', deliverable_generated: 'text-accent-green',
  deliverable_downloaded: 'text-slate-400', security_violation: 'text-danger',
};

const eventIcon: Record<string, React.ReactNode> = {
  user_login: <User size={12} />, user_logout: <User size={12} />,
  document_upload: <FileText size={12} />, agent_step: <Bot size={12} />,
  model_selected: <Cpu size={12} />, security_violation: <Shield size={12} />,
};

export default function AuditTrail() {
  const [search, setSearch] = useState('');
  const filtered = demoAuditEvents.filter(e =>
    !search || e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.eventType.includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-slide-in">
      <div className="flex items-center gap-3">
        <p className="text-sm text-slate-400 flex-1">
          Append-only audit log — all significant system actions are recorded automatically.
        </p>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" className="input pl-8 py-1.5 w-52 text-xs" />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-28">Time</th>
              <th>User / System</th>
              <th>Event</th>
              <th>Description</th>
              <th className="w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ev => (
              <tr key={ev.id} className="border-b border-surface-200 hover:bg-surface-200/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                  {formatDateTime(ev.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-xs', ev.userName ? 'text-slate-300' : 'text-slate-500')}>
                      {ev.userName || 'System'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(eventColors[ev.eventType] || 'text-slate-400')}>
                      {eventIcon[ev.eventType] || <Bot size={12} />}
                    </span>
                    <span className="text-xs text-slate-400">{ev.eventType.replace(/_/g, ' ')}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-300 max-w-sm">{ev.description}</td>
                <td className="px-4 py-3">
                  <span className={cn('badge text-[10px]',
                    ev.status === 'success' ? 'badge-green' : ev.status === 'failure' ? 'badge-red' : 'badge-amber'
                  )}>
                    {ev.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-10 text-center text-slate-500 text-sm">No matching events</div>
        )}
      </div>
      <p className="text-[11px] text-slate-600 text-center">
        Showing {filtered.length} of {demoAuditEvents.length} audit events ·
        [DEMO DATA — Backend API will provide real audit events]
      </p>
    </div>
  );
}
