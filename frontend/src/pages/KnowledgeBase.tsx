import { Database, Search, FileText, Hash, CheckCircle2, Clock } from 'lucide-react';
import { demoDocuments } from '../data/demo';
import { cn, formatRelativeTime } from '../utils';

export default function KnowledgeBase() {
  const indexed = demoDocuments.filter(d => d.isEmbedded);
  const total_chunks = indexed.reduce((a, d) => a + (d.pageCount || 1) * 12, 0);

  return (
    <div className="space-y-5 animate-slide-in">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: demoDocuments.length, color: 'text-slate-100' },
          { label: 'Indexed', value: indexed.length, color: 'text-accent-green' },
          { label: 'Pending', value: demoDocuments.filter(d => !d.isEmbedded).length, color: 'text-accent-amber' },
          { label: 'Est. Chunks', value: total_chunks, color: 'text-brand-400' },
        ].map(s => (
          <div key={s.label} className="card-sm text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card-sm border-brand-600/30 bg-brand-600/5">
        <p className="text-xs font-semibold text-brand-300 mb-1">Local Embedding Model</p>
        <p className="text-xs text-slate-400">
          All embeddings generated locally using <strong className="text-slate-300">nomic-embed-text (Ollama)</strong>.
          Vectors stored in <strong className="text-slate-300">ChromaDB (embedded, local disk)</strong>.
          Retrieval uses cosine similarity with permission-aware filtering.
        </p>
      </div>

      {/* Knowledge search (frontend only) */}
      <div className="card">
        <p className="text-sm font-semibold text-slate-200 mb-3">Knowledge Search (RAG)</p>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input placeholder="Search your knowledge base…" className="input pl-9" disabled />
        </div>
        <p className="text-xs text-slate-600 text-center py-4">
          [Knowledge search requires backend API — connect in Phase 3]
        </p>
      </div>

      {/* Document index status */}
      <div className="card">
        <p className="text-sm font-semibold text-slate-200 mb-3">Document Index Status</p>
        <div className="space-y-2">
          {demoDocuments.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 py-2 border-b border-surface-200 last:border-0">
              <FileText size={14} className={doc.isEmbedded ? 'text-accent-green' : 'text-slate-500'} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{doc.originalFilename}</p>
                <p className="text-[10px] text-slate-500">{doc.pageCount || '?'} pages · {doc.department}</p>
              </div>
              <div className="flex items-center gap-2">
                {doc.isEmbedded ? (
                  <span className="badge badge-green text-[10px]">Indexed</span>
                ) : (
                  <span className="badge badge-neutral text-[10px]">Pending</span>
                )}
                <span className="text-[10px] text-slate-600">{formatRelativeTime(doc.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
