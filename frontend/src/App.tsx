import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import NewWork from './pages/NewWork';
import AgentRuns from './pages/AgentRuns';
import Documents from './pages/Documents';
import KnowledgeBase from './pages/KnowledgeBase';
import Models from './pages/Models';
import ModelRouter from './pages/ModelRouter';
import Approvals from './pages/Approvals';
import Deliverables from './pages/Deliverables';
import AuditTrail from './pages/AuditTrail';
import Sovereignty from './pages/Sovereignty';
import Settings from './pages/Settings';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="text-6xl font-bold text-surface-300 mb-4">404</p>
      <p className="text-slate-400 mb-6">This page doesn't exist.</p>
      <a href="/" className="btn btn-primary">Go to Dashboard</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="work/new" element={<NewWork />} />
          <Route path="work/:id" element={<Navigate to="/runs" replace />} />
          <Route path="runs" element={<AgentRuns />} />
          <Route path="runs/:id" element={<AgentRuns />} />
          <Route path="documents" element={<Documents />} />
          <Route path="documents/:id" element={<Documents />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="models" element={<Models />} />
          <Route path="router" element={<ModelRouter />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="deliverables" element={<Deliverables />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="sovereignty" element={<Sovereignty />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
