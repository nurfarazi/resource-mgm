import React, { useRef } from 'react';
import type { Project, User } from '../types';
import html2canvas from 'html2canvas';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  users: User[];
  onImport: (projects: Project[], users: User[]) => void;
  onReset: () => void;
  dashboardRef: React.RefObject<HTMLDivElement | null>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, 
    onClose, 
    projects, 
    users, 
    onImport, 
    onReset,
    dashboardRef 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const data = {
        projects,
        users,
        version: 1,
        exportedAt: Date.now()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resource-mgm-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              if (Array.isArray(json.projects) && Array.isArray(json.users)) {
                  onImport(json.projects, json.users);
                  alert('Data imported successfully!');
                  onClose();
              } else {
                  alert('Invalid JSON structure.');
              }
          } catch (err) {
              console.error(err);
              alert('Failed to parse JSON.');
          }
      };
      reader.readAsText(file);
      // Reset input
      e.target.value = '';
  };

  const handleExportPng = async () => {
      if (!dashboardRef.current) return;
      try {
          const canvas = await html2canvas(dashboardRef.current, {
              backgroundColor: '#0a0a0f', // Match body bg
              scale: 2
          });
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = `resource-mgm-dashboard-${new Date().toISOString().slice(0, 10)}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      } catch (err) {
          console.error('Failed to export PNG', err);
          alert('Failed to generate PNG.');
      }
  };

  const handleClearCache = () => {
      if (confirm('Are you sure you want to wipe all data? This cannot be undone.')) {
          onReset();
          onClose();
      }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }} onClick={onClose}>
      <div 
        style={{
          background: '#13131a',
          padding: '2rem',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'white' }}>Data Management</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
                onClick={handleExportJson}
                style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
            >
                <span>📥 Export Data (JSON)</span>
            </button>

            <button 
                onClick={() => fileInputRef.current?.click()}
                style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
            >
                <span>📤 Import Data (JSON)</span>
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".json"
                onChange={handleImportJson}
            />

            <button 
                onClick={handleExportPng}
                style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.5rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
            >
                <span>📸 Export Dashboard (PNG)</span>
            </button>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

            <button 
                onClick={handleClearCache}
                style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#ef4444',
                    fontWeight: 600,
                    cursor: 'pointer'
                }}
            >
                ⚠️ Clear All Data
            </button>
        </div>

        <button 
          onClick={onClose}
          style={{
            marginTop: '2rem',
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
