import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Plus, Activity, CheckSquare, FileText,
  Database, Cpu, GitBranch, Shield, ClipboardList, Settings,
  Zap, Package
} from 'lucide-react';
import { cn } from '../../utils';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

interface NavSection {
  section?: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={16} />, to: '/' },
    ],
  },
  {
    section: 'Work',
    items: [
      { label: 'New Work', icon: <Plus size={16} />, to: '/work/new' },
      { label: 'Active Runs', icon: <Activity size={16} />, to: '/runs' },
      { label: 'Deliverables', icon: <Package size={16} />, to: '/deliverables' },
    ],
  },
  {
    section: 'Knowledge',
    items: [
      { label: 'Documents', icon: <FileText size={16} />, to: '/documents' },
      { label: 'Knowledge Base', icon: <Database size={16} />, to: '/knowledge' },
    ],
  },
  {
    section: 'AI Fabric',
    items: [
      { label: 'Models', icon: <Cpu size={16} />, to: '/models' },
      { label: 'Model Router', icon: <GitBranch size={16} />, to: '/router' },
    ],
  },
  {
    section: 'Governance',
    items: [
      { label: 'Approvals', icon: <CheckSquare size={16} />, to: '/approvals' },
      { label: 'Audit Trail', icon: <ClipboardList size={16} />, to: '/audit' },
      { label: 'Sovereignty', icon: <Shield size={16} />, to: '/sovereignty' },
    ],
  },
  {
    section: 'Administration',
    items: [
      { label: 'Settings', icon: <Settings size={16} />, to: '/settings' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 bg-surface-50 border-r border-surface-300 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-surface-300">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-100 text-[15px] tracking-tight">KshetraAI</span>
        </div>
        <p className="text-[10px] text-slate-500 pl-9 leading-none">Sovereign AI Platform</p>
      </div>

      {/* Sovereignty indicator */}
      <div className="px-4 py-2.5 border-b border-surface-300">
        <div className="flex items-center gap-2 bg-accent-green/10 border border-accent-green/20 rounded-lg px-2.5 py-1.5">
          <span className="sovereign-dot" />
          <span className="text-[10px] font-semibold text-accent-green tracking-wide">LOCAL / ON-PREMISE</span>
        </div>
        <div className="flex justify-between mt-1.5 px-0.5">
          <span className="text-[10px] text-slate-500">Ext. AI Calls</span>
          <span className="text-[10px] font-bold text-accent-green">0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navigation.map((group, gi) => (
          <div key={gi}>
            {group.section && (
              <p className="nav-section">{group.section}</p>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => cn('nav-item', isActive && 'active')}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-surface-300">
        <p className="text-[9px] text-slate-600 text-center">
          SIH 2026 · SIH26117 · MRPL
        </p>
      </div>
    </aside>
  );
}
