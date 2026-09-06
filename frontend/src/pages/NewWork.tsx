import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSearch, Code2, Calculator, FileText, Table2,
  ClipboardCheck, BookOpen, Upload, ChevronRight, ChevronLeft,
  Bot, AlertCircle, Loader2
} from 'lucide-react';
import { cn } from '../utils';

const TASK_TYPES = [
  {
    id: 'inspection_analysis',
    icon: <FileSearch size={22} />,
    label: 'Inspection Analysis',
    desc: 'Analyze scanned inspection reports, extract findings, generate approval notes',
    requiredDoc: true,
    model: 'Reasoning Model',
    example: 'Analyze CDU-2 heat exchanger inspection report and generate approval note',
  },
  {
    id: 'sop_compliance',
    icon: <ClipboardCheck size={22} />,
    label: 'SOP Compliance',
    desc: 'Verify procedures against internal SOPs and regulatory guidelines',
    requiredDoc: false,
    model: 'Reasoning Model',
    example: 'Check if P-101 maintenance procedure follows the updated SOP',
  },
  {
    id: 'engineering_calculation',
    icon: <Calculator size={22} />,
    label: 'Engineering Calculation',
    desc: 'Perform and verify engineering calculations with tool execution',
    requiredDoc: false,
    model: 'Reasoning Model',
    example: 'Calculate NPSH available for centrifugal pump P-101',
  },
  {
    id: 'code_verification',
    icon: <Code2 size={22} />,
    label: 'Code Verification',
    desc: 'Generate, execute, and verify Python code in isolated sandbox',
    requiredDoc: false,
    model: 'Coding Model',
    example: 'Write a Python function to calculate heat exchanger efficiency',
  },
  {
    id: 'spreadsheet_analysis',
    icon: <Table2 size={22} />,
    label: 'Spreadsheet Analysis',
    desc: 'Analyze equipment history data, identify trends and anomalies',
    requiredDoc: true,
    model: 'Reasoning Model',
    example: 'Analyze pump P-101 vibration history from last 12 months',
  },
  {
    id: 'technical_reporting',
    icon: <FileText size={22} />,
    label: 'Technical Reporting',
    desc: 'Generate structured technical reports from findings and data',
    requiredDoc: false,
    model: 'Reasoning Model',
    example: 'Generate a corrosion assessment report for Unit 3',
  },
  {
    id: 'knowledge_search',
    icon: <BookOpen size={22} />,
    label: 'Knowledge Search',
    desc: 'Search the internal knowledge base with source citations',
    requiredDoc: false,
    model: 'Reasoning + RAG',
    example: 'What are the inspection criteria for pressure vessels per ASME?',
  },
];

type Step = 'select_type' | 'configure' | 'review';

export default function NewWork() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select_type');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [starting, setStarting] = useState(false);

  const taskType = TASK_TYPES.find(t => t.id === selectedType);

  const handleStart = async () => {
    setStarting(true);
    // Simulate task creation (API call will replace this)
    await new Promise(r => setTimeout(r, 1200));
    navigate('/runs');
  };

  return (
    <div className="max-w-3xl mx-auto animate-slide-in">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {(['select_type', 'configure', 'review'] as Step[]).map((s, i) => {
          const done = step === 'configure' && i === 0 || step === 'review' && i < 2;
          const active = step === s;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                active ? 'bg-brand-600 text-white' : done ? 'bg-accent-green/20 text-accent-green' : 'bg-surface-300 text-slate-500'
              )}>
                {done ? '✓' : i + 1}
              </div>
              <span className={cn('text-xs font-medium', active ? 'text-slate-200' : 'text-slate-500')}>
                {s === 'select_type' ? 'Select Task Type' : s === 'configure' ? 'Configure' : 'Review & Start'}
              </span>
              {i < 2 && <ChevronRight size={14} className="text-slate-600 mx-1" />}
            </div>
          );
        })}
      </div>

      {/* STEP 1 — Select Type */}
      {step === 'select_type' && (
        <div className="animate-slide-in">
          <h2 className="text-lg font-semibold text-slate-100 mb-1">What do you need to do?</h2>
          <p className="text-sm text-slate-500 mb-6">
            KshetraAI will route your task to the optimal local model and execute it securely on-premise.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TASK_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); setDescription(type.example); setStep('configure'); }}
                className={cn(
                  'card text-left hover:border-brand-600/60 transition-all group',
                  selectedType === type.id && 'border-brand-600'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="text-brand-400 group-hover:text-brand-300 transition-colors mt-0.5">
                    {type.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-slate-100">
                        {type.label}
                      </p>
                      {type.requiredDoc && (
                        <span className="badge badge-blue text-[9px]">NEEDS DOC</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{type.desc}</p>
                    <p className="text-[10px] text-slate-600 mt-2">Model: {type.model}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 — Configure */}
      {step === 'configure' && taskType && (
        <div className="animate-slide-in space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setStep('select_type')} className="btn-ghost p-1">
              <ChevronLeft size={16} />
            </button>
            <div className="text-brand-400">{taskType.icon}</div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">{taskType.label}</h2>
              <p className="text-xs text-slate-500">Model: {taskType.model}</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="label">Task Title</label>
            <input
              type="text"
              className="input"
              placeholder={`e.g. ${taskType.example.substring(0, 50)}…`}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Task Description / Instructions</label>
            <textarea
              className="input h-28 resize-none"
              placeholder={taskType.example}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* File upload */}
          {taskType.requiredDoc && (
            <div>
              <label className="label">Document {taskType.requiredDoc ? '(required)' : '(optional)'}</label>
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer',
                  file ? 'border-accent-green/40 bg-accent-green/5' : 'border-surface-400 hover:border-brand-600/40 hover:bg-surface-200'
                )}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.txt"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText size={20} className="text-accent-green" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-200">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload size={24} className="text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Drop file or click to upload</p>
                    <p className="text-xs text-slate-600 mt-1">PDF, DOCX, XLSX, PPTX, PNG, JPG — max 50 MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="card-sm border-brand-600/30 bg-brand-600/5">
            <div className="flex items-start gap-2">
              <Bot size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-brand-300 mb-0.5">Routing Preview</p>
                <p className="text-xs text-slate-400">
                  This task will be classified by the Task Analyzer and routed to the <strong className="text-slate-300">{taskType.model}</strong>.
                  Knowledge retrieval from indexed documents will be performed locally.
                  All processing is on-premise.
                </p>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary w-full justify-center"
            onClick={() => setStep('review')}
            disabled={!description.trim()}
          >
            Continue to Review <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* STEP 3 — Review & Start */}
      {step === 'review' && taskType && (
        <div className="animate-slide-in space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setStep('configure')} className="btn-ghost p-1">
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-base font-semibold text-slate-100">Review & Start</h2>
          </div>

          <div className="card space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="label">Task Type</p>
                <p className="text-sm text-slate-200">{taskType.label}</p>
              </div>
              <div>
                <p className="label">AI Model</p>
                <p className="text-sm text-slate-200">{taskType.model}</p>
              </div>
            </div>
            <div>
              <p className="label">Description</p>
              <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
            </div>
            {file && (
              <div>
                <p className="label">Document</p>
                <p className="text-sm text-slate-200">{file.name}</p>
              </div>
            )}
          </div>

          <div className="card-sm border-accent-green/30 bg-accent-green/5">
            <p className="text-xs font-semibold text-accent-green mb-2">Sovereignty Confirmation</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Inference: LOCAL', 'OCR: LOCAL', 'Embeddings: LOCAL', 'External AI: DISABLED'].map(s => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  <span className="text-slate-400">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary w-full justify-center text-base py-3"
            onClick={handleStart}
            disabled={starting}
          >
            {starting ? (
              <><Loader2 size={16} className="animate-spin" /> Starting Agent…</>
            ) : (
              <><Bot size={16} /> Start AI Execution</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
