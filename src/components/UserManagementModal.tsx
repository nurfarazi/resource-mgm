import React, { useState } from 'react';
import type { User } from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onAdd: (name: string, color: string) => void;
  onDelete: (id: string) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose, users, onAdd, onDelete }) => {
  const [newName, setNewName] = useState('');
  
  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ['#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#6366f1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    onAdd(newName, randomColor);
    setNewName('');
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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>Manage Team</h2>
        
        {/* Add User Form */}
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
            <input 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Enter new user name..."
                style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    outline: 'none',
                    fontFamily: 'var(--font-main)',
                }}
                required
            />
            <button 
                type="submit"
                style={{
                    padding: '0.75rem 1rem',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontWeight: 600
                }}
            >
                Add
            </button>
        </form>

        {/* User List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
            {users.map(user => (
                <div key={user.id} style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '0.5rem',
                    border: user.isMe ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: user.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            {user.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.name} {user.isMe && '(You)'}</span>
                    </div>
                    {!user.isMe && (
                        <button 
                            onClick={() => onDelete(user.id)}
                            style={{
                                color: '#ef4444',
                                background: 'transparent',
                                fontSize: '1.25rem',
                                padding: '0 0.5rem'
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
        </div>

        <button 
          onClick={onClose}
          style={{
            marginTop: '2rem',
            width: '100%',
            padding: '0.75rem',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-muted)',
            borderRadius: '0.5rem'
          }}
        >
          Close
        </button>

      </div>
    </div>
  );
};
