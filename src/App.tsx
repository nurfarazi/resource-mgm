import { useState } from 'react';
import { useProjectStore } from './hooks/useProjectStore';
import { useUserStore } from './hooks/useUserStore';
import { ProjectCard } from './components/ProjectCard';
import { AddProjectModal } from './components/AddProjectModal';
import { UserManagementModal } from './components/UserManagementModal';
import type { Project, ProjectInput } from './types';

function App() {
  const { projects, addProject, updateProject, removeProject } = useProjectStore();
  const { users, addUser, removeUser } = useUserStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Calculate generic stats using the centralized user store
  // We align assignments with real users where possible
  const userStats: Record<string, { totalAllocation: number, color: string, id: string }> = {};
  
  // Initialize stats for all known users
  users.forEach(u => {
      userStats[u.id] = { totalAllocation: 0, color: u.color, id: u.id };
  });

  projects.forEach(p => {
    p.assignments.forEach(m => {
      // If we have a matching user in our store, use that ID. 
      // Fallback to name-matching or temp logic not really needed if we use IDs correctly.
      if (userStats[m.id]) {
          userStats[m.id].totalAllocation += m.allocation;
      }
    });
  });

  const handleEdit = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
        setEditingProject(project);
        setIsModalOpen(true);
    }
  };

  const handleSave = (input: ProjectInput) => {
    if (editingProject) {
        updateProject(editingProject.id, input);
    } else {
        addProject(input);
    }
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingProject(null); // Clear editing state on close
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '120px' }}>
      
      {/* Reduced Header */}
      <header style={{ 
        marginBottom: '2rem', 
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 700, 
            background: 'linear-gradient(135deg, var(--text-main) 0%, var(--text-muted) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em'
          }}>
            Resource Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Prototype Dashboard
          </p>
        </div>
        
        <button
            onClick={() => setIsUserModalOpen(true)}
            style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
            }}
        >
            <span>👥</span> Manage Team
        </button>
      </header>
      
      {/* User Summary Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)', opacity: 0.9 }}>Team Workload Summary</h2>
        <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            overflowX: 'auto', 
            paddingBottom: '1rem',
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
        }}>
          {users.map((user) => {
            const stats = userStats[user.id] || { totalAllocation: 0, color: user.color };
            return (
                <div key={user.id} style={{
                minWidth: '200px',
                background: 'var(--bg-card)',
                border: 'var(--glass-border)',
                borderRadius: '1rem',
                padding: '1rem',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: user.isMe ? 'white' : 'var(--text-muted)' }}>{user.name}</span>
                    {user.isMe && <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>YOU</span>}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 700, 
                    color: stats.totalAllocation > 100 ? '#ef4444' : user.color 
                    }}>
                    {stats.totalAllocation}%
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>load</span>
                </div>
                
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                    width: `${Math.min(stats.totalAllocation, 100)}%`, 
                    height: '100%', 
                    background: stats.totalAllocation > 100 ? '#ef4444' : user.color 
                    }} />
                </div>
                </div>
            );
          })}
        </div>
      </section>

      <main>
        {projects.length === 0 ? (
          <div style={{ 
            padding: '5rem', 
            textAlign: 'center',
            border: '2px dashed var(--glass-border)',
            borderRadius: '2rem',
            color: 'var(--text-muted)'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>No Active Projects</h3>
            <p>Tap the + button to get started.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}>
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={removeProject}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </main>

      <button 
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          boxShadow: '0 10px 40px -10px var(--primary-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        +
      </button>

      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingProject={editingProject}
      />
      
      <UserManagementModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        users={users}
        onAdd={addUser}
        onDelete={removeUser}
      />
    </div>
  );
}

export default App;
