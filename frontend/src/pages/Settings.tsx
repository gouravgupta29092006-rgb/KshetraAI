import { useState } from 'react';
import { User, Bell, Lock, Cpu, Settings as SettingsIcon, Palette } from 'lucide-react';
import { cn } from '../utils';

const TABS = [
  { id: 'profile', label: 'Profile', icon: <User size={14} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
  { id: 'security', label: 'Security', icon: <Lock size={14} /> },
  { id: 'models', label: 'Model Preferences', icon: <Cpu size={14} /> },
  { id: 'system', label: 'System', icon: <SettingsIcon size={14} /> },
];

export default function Settings() {
  const [tab, setTab] = useState('profile');

  return (
    <div className="flex gap-6 animate-slide-in">
      {/* Settings nav */}
      <div className="w-48 flex-shrink-0">
        <div className="card-sm space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn('nav-item w-full', tab === t.id && 'active')}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings content */}
      <div className="flex-1 space-y-4">
        {tab === 'profile' && (
          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Profile Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Full Name</label><input className="input" defaultValue="Engineer User" /></div>
              <div><label className="label">Username</label><input className="input" defaultValue="engineer" /></div>
              <div><label className="label">Email</label><input className="input" defaultValue="engineer@mrpl.co.in" /></div>
              <div><label className="label">Department</label><input className="input" defaultValue="Inspection" /></div>
            </div>
            <div><label className="label">Role</label><input className="input" defaultValue="Engineer (read-only)" disabled /></div>
            <p className="text-xs text-slate-500">Role assignment is managed by the Administrator.</p>
            <button className="btn btn-primary">Save Profile</button>
          </div>
        )}

        {tab === 'security' && (
          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Security</h3>
            <div>
              <label className="label">Current Password</label>
              <input type="password" className="input" placeholder="••••••••••••" />
            </div>
            <div>
              <label className="label">New Password</label>
              <input type="password" className="input" placeholder="Min 12 characters, mixed case, special" />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" className="input" />
            </div>
            <button className="btn btn-primary">Update Password</button>
            <div className="pt-4 border-t border-surface-300">
              <p className="text-xs font-medium text-slate-300 mb-2">Session</p>
              <p className="text-xs text-slate-500 mb-3">JWT-based session. Tokens expire after 8 hours.</p>
              <button className="btn btn-danger text-xs">Sign Out All Sessions</button>
            </div>
          </div>
        )}

        {tab === 'models' && (
          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Model Preferences</h3>
            <p className="text-xs text-slate-500">
              Model selection is performed automatically by the Model Router based on task analysis.
              The following settings allow administrators to set default preferences.
            </p>
            <div>
              <label className="label">Default Reasoning Model</label>
              <select className="input"><option>qwen2.5:7b-instruct (recommended)</option></select>
            </div>
            <div>
              <label className="label">Default Coding Model</label>
              <select className="input"><option>qwen2.5-coder:7b-instruct (recommended)</option></select>
            </div>
            <div>
              <label className="label">Ollama Endpoint</label>
              <input className="input" defaultValue="http://127.0.0.1:11434" />
            </div>
            <p className="text-xs text-accent-amber">⚠ Changing the Ollama endpoint to an external address would violate sovereignty controls.</p>
            <button className="btn btn-primary">Save Preferences</button>
          </div>
        )}

        {tab === 'system' && (
          <div className="card space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">System Configuration</h3>
            <p className="text-xs text-slate-500">Administrator access required for system configuration changes.</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ['Version', '0.1.0-alpha'],
                ['Environment', 'Development'],
                ['Database', 'SQLite (dev) → PostgreSQL (prod)'],
                ['Vector DB', 'ChromaDB (embedded)'],
                ['Inference', 'Ollama (local)'],
                ['Sandbox', 'RestrictedPython v1'],
              ].map(([k, v]) => (
                <div key={k} className="card-sm">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wide">{k}</p>
                  <p className="text-slate-200 font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tab === 'appearance' || tab === 'notifications') && (
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 capitalize">{tab} Settings</h3>
            <p className="text-xs text-slate-500">Configuration UI coming in a later release.</p>
          </div>
        )}
      </div>
    </div>
  );
}
