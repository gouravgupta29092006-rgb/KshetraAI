import { useState, useRef } from 'react';
import { Upload, FileText, Search, Filter, Eye, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { demoDocuments } from '../data/demo';
import { cn, formatBytes, formatRelativeTime } from '../utils';
import type { Document } from '../types';

const classificationColor: Record<string, string> = {
  public: 'badge-blue', internal: 'badge-neutral',
  confidential: 'badge-amber', restricted: 'badge-red',
};

function DocumentRow({ doc }: { doc: Document }) {
  return (
    <tr className="border-b border-surface-200 hover:bg-surface-200/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-brand-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-200">{doc.originalFilename}</p>
            {doc.title && <p className="text-[11px] text-slate-500">{doc.title}</p>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-400 capitalize">{doc.documentType?.replace('_', ' ')}</span>
      </td>
      <td className="px-4 py-3">
        <span className={cn('badge', classificationColor[doc.classification])}>
          {doc.classification.toUpperCase()}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {doc.isOcrProcessed
            ? <CheckCircle2 size={12} className="text-accent-green" />
            : <Clock size={12} className="text-slate-500" />}
          <span className="text-xs text-slate-400">{doc.isOcrProcessed ? 'OCR Done' : 'Pending'}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {doc.isEmbedded
            ? <CheckCircle2 size={12} className="text-accent-green" />
            : <Clock size={12} className="text-slate-500" />}
          <span className="text-xs text-slate-400">{doc.isEmbedded ? 'Indexed' : 'Pending'}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-500">{formatBytes(doc.fileSizeBytes)}</td>
      <td className="px-4 py-3 text-xs text-slate-500">{formatRelativeTime(doc.createdAt)}</td>
      <td className="px-4 py-3">
        <button className="btn-ghost p-1"><Eye size={14} /></button>
      </td>
    </tr>
  );
}

function UploadZone({ onFile }: { onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
        dragging ? 'border-brand-500 bg-brand-600/10' : 'border-surface-400 hover:border-brand-600/40'
      )}
      onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
    >
      <input ref={ref} type="file" className="hidden" accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.txt" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <Upload size={28} className="text-slate-500 mx-auto mb-2" />
      <p className="text-sm font-medium text-slate-300">Drop file here or click to browse</p>
      <p className="text-xs text-slate-500 mt-1">PDF · DOCX · XLSX · PPTX · PNG · JPG · TXT — max 50 MB</p>
      <p className="text-xs text-accent-green mt-2">✓ Processed locally — no cloud upload</p>
    </div>
  );
}

export default function Documents() {
  const [search, setSearch] = useState('');
  const [uploaded, setUploaded] = useState<{ file: File; status: 'uploading' | 'processing' | 'done' } | null>(null);

  const filtered = demoDocuments.filter(d =>
    !search || d.originalFilename.toLowerCase().includes(search.toLowerCase()) ||
    d.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (file: File) => {
    setUploaded({ file, status: 'uploading' });
    setTimeout(() => setUploaded(u => u ? { ...u, status: 'processing' } : null), 1000);
    setTimeout(() => setUploaded(u => u ? { ...u, status: 'done' } : null), 3500);
  };

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: demoDocuments.length, color: 'text-slate-100' },
          { label: 'OCR Processed', value: demoDocuments.filter(d => d.isOcrProcessed).length, color: 'text-accent-green' },
          { label: 'Indexed (RAG)', value: demoDocuments.filter(d => d.isEmbedded).length, color: 'text-brand-400' },
          { label: 'Pending', value: demoDocuments.filter(d => !d.isEmbedded).length, color: 'text-accent-amber' },
        ].map(s => (
          <div key={s.label} className="card-sm text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div className="card">
        <p className="text-sm font-semibold text-slate-200 mb-3">Upload Document</p>
        {!uploaded ? (
          <UploadZone onFile={handleUpload} />
        ) : (
          <div className={cn(
            'rounded-xl p-4 flex items-center gap-4 transition-all',
            uploaded.status === 'done' ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-surface-200 border border-surface-400'
          )}>
            <FileText size={24} className={uploaded.status === 'done' ? 'text-accent-green' : 'text-brand-400'} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">{uploaded.file.name}</p>
              <p className="text-xs text-slate-500">{formatBytes(uploaded.file.size)}</p>
              <div className="mt-2 h-1.5 bg-surface-300 rounded-full overflow-hidden">
                <div className={cn(
                  'h-full rounded-full transition-all duration-1000',
                  uploaded.status === 'done' ? 'bg-accent-green w-full' : uploaded.status === 'processing' ? 'bg-accent-blue w-3/4' : 'bg-brand-500 w-1/4'
                )} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {uploaded.status === 'uploading' ? 'Uploading…' : uploaded.status === 'processing' ? 'OCR & Indexing (local)…' : '✓ Processed and indexed locally'}
              </p>
            </div>
            {uploaded.status === 'done' && (
              <button onClick={() => setUploaded(null)} className="btn-ghost p-1"><Trash2 size={14} /></button>
            )}
          </div>
        )}
      </div>

      {/* Documents table */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm font-semibold text-slate-200 flex-1">Knowledge Base Documents</p>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="input pl-8 py-1.5 w-48 text-xs" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {['Document', 'Type', 'Classification', 'OCR', 'Indexed', 'Size', 'Uploaded', ''].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">No documents found</div>
          )}
        </div>
      </div>
    </div>
  );
}
