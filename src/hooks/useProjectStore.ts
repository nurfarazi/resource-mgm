import { useState, useEffect } from 'react';
import type { Project, ProjectInput, TeamMember } from '../types';

const STORAGE_KEY = 'resource-mgm-data-v1';

export function useProjectStore() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      const loaded = item ? JSON.parse(item) : [];

      // Migration logic: Convert old projects to new format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return loaded.map((p: any) => {
        if (!p.assignments) {
          // It's an old project
          const me: TeamMember = {
            id: 'me',
            name: 'Me',
            allocation: p.allocation || 0,
            typeSplit: p.typeSplit || { frontend: 50, backend: 50 },
            color: p.color || '#6366f1',
            isMe: true
          };
          return {
            ...p,
            assignments: [me],
            // clean up legacy fields
            allocation: undefined,
            typeSplit: undefined,
            color: undefined
          };
        }
        return p;
      });
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects:', error);
    }
  }, [projects]);

  const addProject = (input: ProjectInput) => {
    const newProject: Project = {
      ...input,
      id: crypto.randomUUID(),
      lastUpdated: Date.now(),
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<ProjectInput>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, lastUpdated: Date.now() } : p
      )
    );
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const importProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
  };

  const resetProjects = () => {
    setProjects([]);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const reorderProjects = (reorderedProjects: Project[]) => {
    setProjects(reorderedProjects);
  };

  return {
    projects,
    addProject,
    updateProject,
    removeProject,
    importProjects,
    resetProjects,
    reorderProjects
  };
}
