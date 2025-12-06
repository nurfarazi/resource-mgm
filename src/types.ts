export interface Project {
  id: string;
  name: string;
  allocation: number; // Percentage 0-100
  typeSplit: {
    frontend: number; // Percentage 0-100
    backend: number; // Percentage 0-100
  };
  color: string;
  description?: string;
  lastUpdated: number;
}

export type ProjectInput = Omit<Project, 'id' | 'lastUpdated'>;
