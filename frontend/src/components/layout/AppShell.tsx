import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useLocation } from 'react-router-dom';

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Industrial AI Execution Platform' },
  '/work/new': { title: 'New Work', subtitle: 'Start a new AI-assisted task' },
  '/runs': { title: 'Agent Runs', subtitle: 'Active and recent executions' },
  '/deliverables': { title: 'Deliverables', subtitle: 'Generated work products' },
  '/documents': { title: 'Documents', subtitle: 'Document management and ingestion' },
  '/knowledge': { title: 'Knowledge Base', subtitle: 'Indexed local knowledge fabric' },
  '/models': { title: 'Model Registry', subtitle: 'Local AI model fabric' },
  '/router': { title: 'Model Router', subtitle: 'Task analysis and intelligent routing' },
  '/approvals': { title: 'Approvals', subtitle: 'Human-in-the-loop review queue' },
  '/audit': { title: 'Audit Trail', subtitle: 'Complete execution audit log' },
  '/sovereignty': { title: 'Sovereignty Center', subtitle: 'Data sovereignty and security controls' },
  '/settings': { title: 'Settings', subtitle: 'System configuration and preferences' },
};

export default function AppShell() {
  const location = useLocation();
  const basePath = '/' + location.pathname.split('/').filter(Boolean)[0] || '/';
  const meta = pageMeta[location.pathname] || pageMeta[basePath] || { title: 'KshetraAI' };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
