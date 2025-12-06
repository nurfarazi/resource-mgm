import React, { useState, useEffect } from 'react';
import type { ProjectInput, TeamMember } from '../types';
import { useUserStore } from '../hooks/useUserStore';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ProjectInput) => void;
  editingProject?: any; // Avoiding deep type verify for now to save time, effectively Project | null
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSave, editingProject }) => {
  const { users } = useUserStore();
  const [name, setName] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Find 'Me' from the user store to set as default if needed
  const meUser = users.find(u => u.isMe);

  useEffect(() => {
    if (isOpen) {
      if (editingProject) {
        setName(editingProject.name);
        setMembers(JSON.parse(JSON.stringify(editingProject.assignments)));
      } else {
        setName('');
        // Add Me by default
        if (meUser) {
          setMembers([{
            ...meUser,
            allocation: 50,
            typeSplit: { frontend: 50, backend: 50 }
          }]);
        }
      }
    }
  }, [isOpen, editingProject, meUser]);

  if (!isOpen) return null;

  const totalAllocation = members.reduce((sum, m) => sum + m.allocation, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      assignments: members
    });
    onClose();
  };

  const addMemberFromUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Check if already added
    if (members.find(m => m.id === userId)) return;

    setMembers([
      ...members,
      {
        ...user,
        allocation: 0,
        typeSplit: { frontend: 50, backend: 50 }
      }
    ]);
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
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
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.25rem',
    color: 'var(--text-muted)',
    fontSize: '0.85rem'
  };

  // Find users not yet in the project
  const availableUsers = users.filter(u => !members.find(m => m.id === u.id));

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
      zIndex: 1000
    }} onClick={onClose}>
      <div 
        style={{
          background: '#13131a',
          padding: '2rem',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>
          {editingProject ? 'Edit Project' : 'Add Team Project'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>Project Name</label>
            <input 
              style={inputStyle}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Website Overhaul"
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Team Allocation</h3>
            <span style={{ 
              color: totalAllocation > 100 ? '#ef4444' : '#10b981',
              fontWeight: 700 
            }}>
              Total: {totalAllocation}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {members.map((member) => (
              <div key={member.id} style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem',
                borderRadius: '1rem',
                border: `1px solid ${member.color}30`,
                position: 'relative'
              }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: member.color }} />
                    <span style={{ fontWeight: 600 }}>{member.name}</span>
                  </div>
                   <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Workload ({member.allocation}%)</label>
                    <input 
                      type="range"
                      style={{ width: '100%', height: '4px', margin: '0.5rem 0' }}
                      min="0"
                      max="100"
                      value={member.allocation}
                      onChange={e => updateMember(member.id, { allocation: Number(e.target.value) })}
                    />
                  </div>
                  {!member.isMe && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      style={{ color: '#ef4444', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer' }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Split Slider */}
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role Split</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {member.typeSplit.frontend}% FE / {member.typeSplit.backend}% BE
                      </span>
                   </div>
                   <input 
                     type="range"
                     style={{ width: '100%', height: '4px', margin: 0 }}
                     min="0"
                     max="100"
                     value={member.typeSplit.frontend}
                     onChange={e => updateMember(member.id, { 
                       typeSplit: { frontend: Number(e.target.value), backend: 100 - Number(e.target.value) } 
                     })}
                   />
                </div>
              </div>
            ))}
            
            {/* Add User Dropdown */}
            {availableUsers.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                     <label style={labelStyle}>Add Team Member</label>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select 
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            onChange={(e) => {
                                if (e.target.value) {
                                    addMemberFromUser(e.target.value);
                                    e.target.value = ''; // Reset select
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="">Select a user...</option>
                            {availableUsers.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                     </div>
                </div>
            )}
            
            {availableUsers.length === 0 && (
                <div style={{ padding: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No more users available. Add new users in the main menu to assign them here.
                </div>
            )}

          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
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
              disabled={totalAllocation > 100}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: totalAllocation > 100 ? '#ef4444' : 'var(--primary)',
                color: 'white',
                fontWeight: 600,
                opacity: totalAllocation > 100 ? 0.5 : 1,
                cursor: totalAllocation > 100 ? 'not-allowed' : 'pointer',
                boxShadow: totalAllocation > 100 ? 'none' : '0 0 20px var(--primary-glow)'
              }}
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
