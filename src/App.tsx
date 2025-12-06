import { useState } from 'react';
import { useProjectStore } from './hooks/useProjectStore';
import { ProjectCard } from './components/ProjectCard';
import { AddProjectModal } from './components/AddProjectModal';

function App() {
  const { projects, addProject, updateProject, removeProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAllocation = projects.reduce((acc, p) => acc + p.allocation, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
      <header style={{ 
        marginBottom: '3rem', 
        paddingTop: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, var(--text-main) 0%, var(--text-muted) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Resource Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px' }}>
            Current bandwidth usage: <strong style={{ 
              color: totalAllocation > 100 ? '#ef4444' : '#10b981' 
            }}>{totalAllocation}%</strong>
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '1rem 2rem',
            background: 'white',
            color: 'black',
            fontWeight: 600,
            fontSize: '1rem',
            border: 'none',
            borderRadius: '2rem',
            boxShadow: '0 0 20px rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.2)';
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>+</span> Add Project
        </button>
      </header>
      
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
            <p>You can breathe easily... or add a project to get started.</p>
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
                onEdit={updateProject}
              />
            ))}
          </div>
        )}
      </main>

      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addProject}
      />
    </div>
  );
}

export default App;
