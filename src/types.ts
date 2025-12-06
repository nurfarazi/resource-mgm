export interface AllocationSplit {
  frontend: number;
  backend: number;
}

export interface User {
  id: string;
  name: string;
  color: string;
  isMe?: boolean;
}

// Assignment inside a project
export interface TeamMember extends User {
  // We extend User to keep a snapshot, but ideally we link by ID.
  // For this prototype, we'll store the snapshot but use the ID to check identity.
  allocation: number; // % of the project
  typeSplit: AllocationSplit;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  assignments: TeamMember[];
  lastUpdated: number;
}

export type ProjectInput = Omit<Project, 'id' | 'lastUpdated'>;
