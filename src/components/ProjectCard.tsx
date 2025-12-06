import React from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: any) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        border: 'var(--glass-border)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        overflow: 'hidden',
        boxShadow: `0 4px 20px 0 rgba(0,0,0,0.2), inset 0 0 0 1px ${project.color}20`,
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 12px 40px 0 rgba(0,0,0,0.4), inset 0 0 0 1px ${project.color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 20px 0 rgba(0,0,0,0.2), inset 0 0 0 1px ${project.color}20`;
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{project.name}</h3>
           <span style={{ 
             fontSize: '0.875rem', 
             color: 'var(--text-muted)', 
             background: 'rgba(255,255,255,0.05)', 
             padding: '0.25rem 0.75rem', 
             borderRadius: '1rem' 
           }}>
             Total Impact
           </span>
        </div>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 800, 
          color: project.color,
          textShadow: `0 0 20px ${project.color}60`
        }}>
          {project.allocation}%
        </div>
      </div>

      {/* Visual Split Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Frontend ({project.typeSplit.frontend}%)</span>
          <span>Backend ({project.typeSplit.backend}%)</span>
        </div>
        <div style={{ 
          height: '12px', 
          width: '100%', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '6px', 
          overflow: 'hidden',
          display: 'flex'
        }}>
          <div style={{ 
            width: `${project.typeSplit.frontend}%`, 
            background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' 
          }} />
          <div style={{ 
             width: `${project.typeSplit.backend}%`, 
             background: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 100%)',
             boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)'
          }} />
        </div>
      </div>

       {/* Actions */}
       <button 
         onClick={() => onDelete(project.id)}
         style={{
           position: 'absolute',
           top: '1rem',
           right: '1rem',
           background: 'transparent',
           color: 'var(--text-muted)',
           fontSize: '1.25rem',
           opacity: 0.1,
           cursor: 'pointer',
           padding: '0.5rem'
         }}
         onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
         onMouseLeave={(e) => e.currentTarget.style.opacity = '0.1'}
       >
         ×
       </button>
    </div>
  );
};
