import { useState } from 'react';
import type { ProjectInput } from '../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: ProjectInput) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [allocation, setAllocation] = useState(20);
  const [frontend, setFrontend] = useState(50);
  const [color, setColor] = useState('#6366f1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name,
      allocation,
      typeSplit: {
        frontend,
        backend: 100 - frontend
      },
      color
    });
    onClose();
    // Reset form
    setName('');
    setAllocation(20);
    setFrontend(50);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.3)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'var(--font-main)',
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div 
        style={{
          background: '#13131a',
          padding: '2rem',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: '500px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>Add New Project</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Project Name</label>
            <input 
              style={inputStyle}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Veny"
              required
              autoFocus
            />
          </div>

          <div>
             <label style={labelStyle}>Allocation ({allocation}%)</label>
             <input 
               type="range"
               style={{ ...inputStyle, padding: 0, height: '4px' }}
               min="1"
               max="100"
               value={allocation}
               onChange={e => setAllocation(Number(e.target.value))}
             />
          </div>

          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Frontend vs Backend</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{frontend}% FE / {100-frontend}% BE</span>
             </div>
             <div style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '1rem',
               background: 'rgba(0,0,0,0.3)',
               padding: '1rem',
               borderRadius: '0.5rem',
               border: '1px solid rgba(255,255,255,0.1)',
               marginBottom: '1rem'
             }}>
               <input 
                 type="range"
                 style={{ flex: 1, margin: 0 }}
                 min="0"
                 max="100"
                 value={frontend}
                 onChange={e => setFrontend(Number(e.target.value))}
               />
             </div>
          </div>

          <div>
            <label style={labelStyle}>Accent Color</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: color === c ? '2px solid white' : '2px solid transparent',
                    cursor: 'pointer',
                    transform: color === c ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--primary)',
                color: 'white',
                fontWeight: 600,
                boxShadow: '0 0 20px var(--primary-glow)'
              }}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
