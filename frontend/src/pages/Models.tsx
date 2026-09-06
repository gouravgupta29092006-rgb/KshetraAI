import { Cpu, CheckCircle2, XCircle, Zap, Eye } from 'lucide-react';
import { demoModels } from '../data/demo';
import { cn } from '../utils';
import type { Model } from '../types';

const capabilityColors: Record<string, string> = {
  reasoning: 'badge-blue', coding: 'badge-purple', vision: 'badge-amber',
  embedding: 'badge-neutral', tool_calling: 'badge-green', summarization: 'badge-blue',
  analysis: 'badge-blue', structured_output: 'badge-green',
};

function ModelCard({ model }: { model: Model }) {
  return (
    <div className={cn('card transition-all', model.isAvailable ? 'border-surface-300' : 'opacity-60')}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-2.5 h-2.5 rounded-full', model.isAvailable ? 'bg-accent-green' : 'bg-surface-400')} />
          <div>
            <p className="text-sm font-semibold text-slate-200">{model.displayName}</p>
            <p className="text-[11px] text-slate-500 font-mono">{model.name}</p>
          </div>
        </div>
        <span className={cn('badge', model.isAvailable ? 'badge-green' : 'badge-neutral')}>
          {model.isAvailable ? 'AVAILABLE' : 'OFFLINE'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {model.capabilities.map(cap => (
          <span key={cap} className={cn('badge text-[10px]', capabilityColors[cap] || 'badge-neutral')}>
            {cap.replace('_', ' ')}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center border-t border-surface-300 pt-3">
        <div>
          <p className="text-xs font-bold text-slate-200">{model.contextLength?.toLocaleString() || '—'}</p>
          <p className="text-[10px] text-slate-500">Context</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-200">{model.vramRequiredGb ? `${model.vramRequiredGb} GB` : '—'}</p>
          <p className="text-[10px] text-slate-500">VRAM</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-200 capitalize">{model.modality}</p>
          <p className="text-[10px] text-slate-500">Modality</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-300">
        <span className="text-[10px] text-slate-500">Provider:</span>
        <span className="text-[10px] font-medium text-slate-300">{model.provider}</span>
        <span className="mx-1 text-slate-700">·</span>
        <span className="text-[10px] text-slate-500">Priority:</span>
        <span className="text-[10px] font-medium text-slate-300">P{model.priority}</span>
      </div>
      {model.notes && (
        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">{model.notes}</p>
      )}
    </div>
  );
}

export default function Models() {
  const available = demoModels.filter(m => m.isAvailable).length;
  return (
    <div className="space-y-5 animate-slide-in">
      {/* Header stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Models', value: demoModels.length, color: 'text-slate-100' },
          { label: 'Available', value: available, color: 'text-accent-green' },
          { label: 'Offline', value: demoModels.length - available, color: 'text-slate-500' },
          { label: 'Provider', value: 'Ollama', color: 'text-brand-400' },
        ].map(s => (
          <div key={s.label} className="card-sm text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sovereignty note */}
      <div className="card-sm border-accent-green/30 bg-accent-green/5 flex items-start gap-2">
        <Zap size={13} className="text-accent-green mt-0.5" />
        <p className="text-xs text-slate-400">
          All models run via <strong className="text-slate-300">Ollama (localhost:11434)</strong> on local GPU.
          No model weights or inference requests are sent to external servers.
          Only one 7B model can be resident in VRAM at a time on this hardware (RTX 4050 / 6 GB).
        </p>
      </div>

      {/* Hardware */}
      <div className="card-sm">
        <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Hardware Profile</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {[
            { label: 'GPU', value: 'RTX 4050 Laptop' },
            { label: 'VRAM', value: '6 GB' },
            { label: 'RAM', value: '16 GB' },
            { label: 'Inference', value: 'CUDA' },
          ].map(h => (
            <div key={h.label}>
              <p className="text-sm font-bold text-slate-200">{h.value}</p>
              <p className="text-[10px] text-slate-500">{h.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Model cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Registered Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoModels.map(model => <ModelCard key={model.id} model={model} />)}
        </div>
      </div>
    </div>
  );
}
