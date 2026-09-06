import { useState } from 'react';
import { GitBranch, ArrowDown, Bot, Cpu, Eye, BookOpen, Calculator } from 'lucide-react';
import { demoModels, demoTasks } from '../data/demo';
import { cn } from '../utils';

// Demo routing scenarios for the Router Visualizer
const SCENARIOS = [
  {
    label: 'Inspection Report (Scanned PDF)',
    input: 'Analyze scanned inspection report for CDU-2 heat exchanger',
    detected: ['Document', 'Scanned/OCR', 'Vision', 'Reasoning'],
    path: ['Vision Model (LLaVA)', 'Reasoning Model (Qwen2.5)'],
    task_type: 'inspection_analysis',
    complexity: 'high',
    confidence: 0.72,
    routing: 'Task requires vision for scanned content + reasoning for analysis. Vision model processes image, reasoning model synthesizes findings.',
  },
  {
    label: 'Python Code Generation',
    input: 'Write a Python function to calculate pump NPSH available',
    detected: ['Code Generation', 'Tool Execution'],
    path: ['Coding Model (Qwen2.5-Coder)'],
    task_type: 'code_verification',
    complexity: 'medium',
    confidence: 0.71,
    routing: 'Code generation task → Coding model selected. Output will be executed in restricted sandbox.',
  },
  {
    label: 'SOP Knowledge Search',
    input: 'What are the inspection criteria for heat exchangers per SOP?',
    detected: ['Knowledge Retrieval', 'Reasoning', 'RAG'],
    path: ['Reasoning Model (Qwen2.5) + RAG'],
    task_type: 'knowledge_search',
    complexity: 'low',
    confidence: 0.68,
    routing: 'Knowledge search task → RAG retrieval from local vector store + reasoning model for synthesis.',
  },
];

export default function ModelRouter() {
  const [active, setActive] = useState(0);
  const sc = SCENARIOS[active];

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Explanation */}
      <div className="card-sm border-brand-600/30 bg-brand-600/5">
        <p className="text-xs font-semibold text-brand-300 mb-1">Task Analyzer → Model Router (Rule-Based v1)</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          The Task Analyzer classifies task type, modality, and complexity using a <strong className="text-slate-300">rule-based keyword classifier</strong> (not an LLM).
          This is explicitly labeled as Rule-Based v1. A trained classifier can replace this via the same interface.
          The Model Router selects the optimal available local model based on required capabilities.
        </p>
      </div>

      {/* Scenario selector */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Routing Scenarios</p>
        <div className="flex gap-2 flex-wrap">
          {SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn('btn text-xs py-1.5', active === i ? 'btn-primary' : 'btn-secondary')}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Router visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input */}
        <div className="card">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Task Input</p>
          <p className="text-sm text-slate-300 italic">"{sc.input}"</p>
          <div className="mt-3 pt-3 border-t border-surface-300">
            <p className="text-[10px] text-slate-500 mb-1">Detected Signals</p>
            <div className="flex flex-wrap gap-1.5">
              {sc.detected.map(d => <span key={d} className="badge badge-blue text-[10px]">{d}</span>)}
            </div>
          </div>
        </div>

        {/* Task Analyzer */}
        <div className="card border-brand-600/40">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Task Analyzer Output</p>
          <div className="space-y-2">
            <div>
              <p className="text-[10px] text-slate-500">Task Type</p>
              <p className="text-xs font-medium text-slate-200">{sc.task_type.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Complexity</p>
              <span className={cn('badge text-[10px]', sc.complexity === 'high' ? 'badge-red' : sc.complexity === 'medium' ? 'badge-amber' : 'badge-green')}>
                {sc.complexity.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-500">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-300 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${sc.confidence * 100}%` }} />
                </div>
                <span className="text-[10px] text-slate-400">{Math.round(sc.confidence * 100)}%</span>
              </div>
              <p className="text-[9px] text-slate-600 mt-0.5">Rule-based → max 0.75</p>
            </div>
          </div>
        </div>

        {/* Selected model */}
        <div className="card border-accent-green/40">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Routing Decision</p>
          <div className="space-y-2">
            {sc.path.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <p className="text-[10px] text-slate-600">then</p>}
                <span className="badge badge-purple text-[10px]">{p}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-surface-300">
              <p className="text-[10px] text-slate-500 mb-1">Reason</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{sc.routing}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real routing history */}
      <div className="card">
        <p className="text-sm font-semibold text-slate-200 mb-3">Recent Routing Decisions</p>
        <div className="space-y-2">
          {demoTasks.filter(t => t.routingReason).map(t => (
            <div key={t.id} className="flex items-start gap-3 py-2 border-b border-surface-200 last:border-0">
              <GitBranch size={12} className="text-brand-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-200">{t.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.routingReason}</p>
                <p className="text-[10px] text-brand-400 mt-0.5">→ {t.selectedModel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
