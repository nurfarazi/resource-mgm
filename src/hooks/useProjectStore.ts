import { useState, useEffect } from 'react';
import type { Project, ProjectInput } from '../types';

const STORAGE_KEY = 'resource-mgm-data-v1';

export function useProjectStore() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
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

  return {
    projects,
    addProject,
    updateProject,
    removeProject,
  };
}
