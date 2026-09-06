import type { EvidenceSource } from '../../types';
import { BookOpen, ExternalLink } from 'lucide-react';

interface EvidenceCardProps {
  sources: EvidenceSource[];
}

export default function EvidenceCard({ sources }: EvidenceCardProps) {
  return (
    <div className="space-y-2">
      {sources.map((src, i) => (
        <div key={i} className="card-sm border-l-2 border-brand-600/50">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen size={12} className="text-brand-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{src.documentName}</p>
                <p className="text-[10px] text-slate-500">
                  {src.pageNumber ? `Page ${src.pageNumber}` : ''}
                  {src.section ? ` · ${src.section}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="w-12 h-1.5 bg-surface-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${Math.round(src.relevanceScore * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 w-8 text-right">
                {Math.round(src.relevanceScore * 100)}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 italic">
            "{src.excerpt}"
          </p>
        </div>
      ))}
    </div>
  );
}
