import { Bell, Search, User, ChevronDown } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-14 flex-shrink-0 bg-surface-100 border-b border-surface-300 flex items-center px-6 gap-4">
      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-sm font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search tasks, documents…"
          className="input pl-8 py-1.5 w-56 text-xs"
        />
      </div>

      {/* Notifications */}
      <button className="btn-ghost p-2 relative">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-amber" />
      </button>

      {/* User */}
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-200 transition-colors">
        <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center">
          <User size={12} className="text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-medium text-slate-200">Engineer</p>
          <p className="text-[10px] text-slate-500">MRPL</p>
        </div>
        <ChevronDown size={12} className="text-slate-500" />
      </button>
    </header>
  );
}
