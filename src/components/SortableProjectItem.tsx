import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';

interface SortableProjectItemProps {
  project: Project;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const SortableProjectItem: React.FC<SortableProjectItemProps> = ({ project, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    touchAction: 'none', // Prevent scrolling while dragging on touch devices
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 'auto'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProjectCard 
        project={project} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    </div>
  );
};
