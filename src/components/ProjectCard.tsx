import React from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: any) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete, onEdit }) => {
  // Find "Me"
  const me = project.assignments.find(a => a.isMe);
  const others = project.assignments.filter(a => !a.isMe);
  
  // Calculate unassigned
  const totalAllocated = project.assignments.reduce((sum, a) => sum + a.allocation, 0);
  const unassigned = Math.max(0, 100 - totalAllocated);

  const mainColor = me ? me.color : '#6366f1';

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
        gap: '1.5rem',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        overflow: 'hidden',
        boxShadow: `0 4px 20px 0 rgba(0,0,0,0.2), inset 0 0 0 1px ${mainColor}20`,
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 20px 40px -10px rgba(0,0,0,0.5), inset 0 0 0 1px ${mainColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = `0 4px 20px 0 rgba(0,0,0,0.2), inset 0 0 0 1px ${mainColor}20`;
      }}
    >
      {/* Header */}
      <div>
         <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{project.name}</h3>
         <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
             <span style={{ 
               fontSize: '0.75rem', 
               color: 'white', 
               background: mainColor, 
               padding: '0.25rem 0.75rem', 
               borderRadius: '1rem',
               fontWeight: 600,
               boxShadow: `0 0 10px ${mainColor}60`
             }}>
               Me: {me?.allocation || 0}%
             </span>
             {others.length > 0 && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)', 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  +{others.length} others
                </span>
             )}
         </div>
      </div>

      {/* Visual Team Distribution Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <span>Resource Distribution</span>
          <span>{totalAllocated}% Filled</span>
        </div>
        <div style={{ 
          height: '24px', 
          width: '100%', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '12px', 
          overflow: 'hidden',
          display: 'flex',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {/* Me */}
          {me && me.allocation > 0 && (
            <div 
              style={{ width: `${me.allocation}%`, background: me.color, height: '100%', position: 'relative' }}
              title={`Me: ${me.allocation}%`}
            >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2))' }} />
            </div>
          )}
          
          {/* Others */}
          {others.map((member) => (
             member.allocation > 0 && (
              <div 
                key={member.id}
                style={{ width: `${member.allocation}%`, background: member.color, height: '100%', position: 'relative', opacity: 0.8 }}
                title={`${member.name}: ${member.allocation}%`}
              />
             )
          ))}

          {/* Unassigned */}
          {unassigned > 0 && (
            <div 
              style={{ 
                width: `${unassigned}%`, 
                background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 4px, transparent 4px, transparent 8px)',
                height: '100%'
              }}
              title={`Unassigned: ${unassigned}%`}
            />
          )}
        </div>
      </div>

      {/* Team Details List (Mini) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {project.assignments.map(member => (
          <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: member.color, boxShadow: `0 0 8px ${member.color}` }} />
             <div style={{ flex: 1, color: member.isMe ? 'white' : 'var(--text-muted)', fontWeight: member.isMe ? 600 : 400 }}>
               {member.name}
             </div>
             <div style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '0.5rem', 
               fontSize: '0.75rem', 
               color: 'var(--text-muted)', 
               background: 'rgba(255,255,255,0.03)', 
               padding: '0.25rem 0.5rem',
               borderRadius: '0.5rem'
             }}>
               <span style={{ color: '#818cf8' }}>FE {member.typeSplit.frontend}%</span>
               <span style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.1)' }} />
               <span style={{ color: '#f472b6' }}>BE {member.typeSplit.backend}%</span>
             </div>
          </div>
        ))}
      </div>

       {/* Actions */}
       <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <button 
           onClick={() => onEdit(project.id, {})}
           style={{
             background: 'rgba(255,255,255,0.05)',
             color: 'var(--text-muted)',
             width: '32px',
             height: '32px',
             borderRadius: '50%',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             fontSize: '1rem',
             cursor: 'pointer',
             transition: 'all 0.2s'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.background = 'white';
             e.currentTarget.style.color = 'black';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
             e.currentTarget.style.color = 'var(--text-muted)';
           }}
         >
           ✎
         </button>
         <button 
           onClick={() => onDelete(project.id)}
           style={{
             background: 'rgba(255,255,255,0.05)',
             color: 'var(--text-muted)',
             width: '32px',
             height: '32px',
             borderRadius: '50%',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             fontSize: '1.25rem',
             cursor: 'pointer',
             transition: 'all 0.2s'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.background = '#ef4444';
             e.currentTarget.style.color = 'white';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
             e.currentTarget.style.color = 'var(--text-muted)';
           }}
         >
           ×
         </button>
       </div>
    </div>
  );
};
