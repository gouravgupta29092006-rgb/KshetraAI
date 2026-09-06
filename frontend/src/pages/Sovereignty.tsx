import { Shield, Wifi, WifiOff, Server, Lock, Eye, Database, Cpu, Code2, CheckCircle2 } from 'lucide-react';
import { demoSovereigntyStatus, demoSystemHealth } from '../data/demo';
import { cn } from '../utils';

function SovereigntyIndicator({ label, value, ok, detail }: { label: string; value: string; ok: boolean; detail?: string }) {
  return (
    <div className={cn('card border-l-4', ok ? 'border-l-accent-green' : 'border-l-danger')}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-300">{label}</span>
        <span className={cn('badge', ok ? 'badge-green' : 'badge-red')}>{value}</span>
      </div>
      {detail && <p className="text-[11px] text-slate-500">{detail}</p>}
    </div>
  );
}

function CounterCard({ label, value, isZero }: { label: string; value: number; isZero?: boolean }) {
  const good = isZero ? value === 0 : value > 0;
  return (
    <div className="card-sm text-center">
      <p className={cn('text-3xl font-bold font-mono', good ? (isZero ? 'text-accent-green' : 'text-brand-400') : 'text-danger')}>
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] text-slate-500 mt-1">{label}</p>
      {isZero && value === 0 && <span className="badge badge-green text-[9px] mt-1">SOVEREIGN</span>}
    </div>
  );
}

export default function Sovereignty() {
  const s = demoSovereigntyStatus;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className={cn(
        'card border-2 flex items-center gap-4',
        s.isSovereign ? 'border-accent-green/40 bg-accent-green/5' : 'border-danger/40 bg-danger/5'
      )}>
        <Shield size={36} className={s.isSovereign ? 'text-accent-green' : 'text-danger'} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-lg font-bold', s.isSovereign ? 'text-accent-green' : 'text-danger')}>
              {s.isSovereign ? 'SOVEREIGN DEPLOYMENT ACTIVE' : 'SOVEREIGNTY VIOLATION DETECTED'}
            </span>
            {s.isSovereign && <span className="sovereign-dot" />}
          </div>
          <p className="text-sm text-slate-400">
            Deployment: <strong className="text-slate-200">{s.deploymentMode}</strong> · All AI processing is {s.deploymentMode === 'LOCAL' ? 'local and on-premise' : 'partially external'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            ⚠ Note: This panel shows application-level controls. Network-layer isolation requires organizational firewall configuration.
          </p>
        </div>
      </div>

      {/* External call counters — must all be zero */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">External AI Call Counters (must remain 0)</h3>
        <div className="grid grid-cols-3 gap-4">
          <CounterCard label="External AI Inference Calls" value={s.externalAiCalls} isZero />
          <CounterCard label="External OCR API Calls" value={s.externalOcrCalls} isZero />
          <CounterCard label="External Embedding Calls" value={s.externalEmbeddingCalls} isZero />
        </div>
      </div>

      {/* Local processing counters */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Local Processing Counters</h3>
        <div className="grid grid-cols-3 gap-4">
          <CounterCard label="Local Inferences" value={s.totalLocalInferences} />
          <CounterCard label="Local OCR Operations" value={s.totalLocalOcrOps} />
          <CounterCard label="Local Embeddings Generated" value={s.totalLocalEmbeddings} />
        </div>
      </div>

      {/* Sovereignty controls */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Processing Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SovereigntyIndicator label="AI Inference" value="LOCAL" ok detail={s.inferenceLocation} />
          <SovereigntyIndicator label="OCR Processing" value="LOCAL" ok detail={s.ocrLocation} />
          <SovereigntyIndicator label="Embeddings" value="LOCAL" ok detail={s.embeddingLocation} />
        </div>
      </div>

      {/* Security controls */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Security Controls</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'RBAC', value: s.rbacEnabled ? 'ENABLED' : 'DISABLED', ok: s.rbacEnabled, icon: <Lock size={14} />, detail: 'Role-based access control enforced server-side' },
            { label: 'Audit Trail', value: s.auditEnabled ? 'ENABLED' : 'DISABLED', ok: s.auditEnabled, icon: <Eye size={14} />, detail: 'Append-only audit log for all actions' },
            { label: 'Code Sandbox', value: s.sandboxEnabled ? 'ENABLED' : 'DISABLED', ok: s.sandboxEnabled, icon: <Code2 size={14} />, detail: `Type: ${s.sandboxType}` },
            { label: 'Cloud AI', value: 'DISABLED', ok: true, icon: <WifiOff size={14} />, detail: 'No external AI API keys configured' },
          ].map(c => (
            <div key={c.label} className={cn('card border-l-4', c.ok ? 'border-l-accent-green' : 'border-l-danger')}>
              <div className="flex items-center gap-2 mb-1">
                <span className={c.ok ? 'text-accent-green' : 'text-danger'}>{c.icon}</span>
                <span className="text-xs font-semibold text-slate-300">{c.label}</span>
              </div>
              <span className={cn('badge text-[10px]', c.ok ? 'badge-green' : 'badge-red')}>{c.value}</span>
              <p className="text-[10px] text-slate-500 mt-1.5">{c.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture note */}
      <div className="card-sm border-surface-400 bg-surface-200">
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Architecture Note</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          KshetraAI is designed for on-premise deployment with complete data locality.
          All AI inference runs via <strong className="text-slate-400">Ollama (localhost:11434)</strong>.
          All embeddings use <strong className="text-slate-400">nomic-embed-text (local)</strong>.
          All OCR uses <strong className="text-slate-400">PaddleOCR (local)</strong>.
          Vector storage uses <strong className="text-slate-400">ChromaDB (embedded)</strong>.
          The system requires no internet connectivity during operation after initial model download.
          Data sovereignty requires organizational network-layer controls in addition to this application.
        </p>
      </div>
    </div>
  );
}
