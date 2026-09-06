import { cn, formatDuration } from '../../utils';
import type { AgentStep } from '../../types';
import { Check, Loader2, Clock, AlertCircle } from 'lucide-react';

interface WorkflowTimelineProps {
  steps: AgentStep[];
}

const stepIcon = (status: string) => {
  if (status === 'completed') return <Check size={12} className="text-accent-green" />;
  if (status === 'running')   return <Loader2 size={12} className="text-accent-blue animate-spin" />;
  if (status === 'failed')    return <AlertCircle size={12} className="text-danger" />;
  return <Clock size={12} className="text-slate-600" />;
};

const dotClass = (status: string) => {
  if (status === 'completed') return 'timeline-dot-done';
  if (status === 'running')   return 'timeline-dot-running';
  if (status === 'failed')    return 'timeline-dot-error';
  return 'timeline-dot-pending';
};

const stepTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    ingestion: 'Document Ingestion', ocr: 'OCR Extraction', task_analysis: 'Task Classification',
    model_routing: 'Model Routing', rag: 'Knowledge Retrieval', tool_call: 'Tool Execution',
    reasoning: 'Reasoning & Analysis', validation: 'Validation', approval: 'Human Approval',
    deliverable: 'Deliverable Generation', plan: 'Planning',
  };
  return map[type] || type;
};

export default function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  return (
    <div className="space-y-0.5">
      {steps.map((step, i) => (
        <div key={step.id} className="flex gap-3 group">
          {/* Connector line */}
          <div className="flex flex-col items-center">
            <div className={cn('timeline-dot', dotClass(step.status))}>
              {stepIcon(step.status)}
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'w-px flex-1 mt-1',
                step.status === 'completed' ? 'bg-accent-green/30' : 'bg-surface-300'
              )} />
            )}
          </div>

          {/* Content */}
          <div className="pb-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn('text-xs font-medium', {
                'text-slate-300': step.status === 'completed',
                'text-accent-blue': step.status === 'running',
                'text-slate-500': step.status === 'pending',
                'text-danger': step.status === 'failed',
              })}>
                {step.stepName}
              </span>
              {step.durationMs !== undefined && (
                <span className="text-[10px] text-slate-600 font-mono">
                  {formatDuration(step.durationMs)}
                </span>
              )}
              {step.status === 'running' && (
                <span className="badge badge-blue text-[10px]">RUNNING</span>
              )}
            </div>
            {step.outputSummary && step.status === 'completed' && (
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                {step.outputSummary}
              </p>
            )}
            {step.status === 'running' && step.inputSummary && (
              <p className="text-[11px] text-accent-blue/70 mt-0.5">{step.inputSummary}</p>
            )}
            {step.error && (
              <p className="text-[11px] text-danger/80 mt-0.5">{step.error}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
