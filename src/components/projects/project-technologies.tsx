import React from 'react';
import { Badge } from '../ui/badge';

export interface ProjectTechnologiesProps {
  technologies: readonly string[];
  maxCount: number;
}

export function ProjectTechnologies({ technologies, maxCount }: ProjectTechnologiesProps) {
  if (technologies.length === 0) return null;
  
  const displayTechs = technologies.slice(0, maxCount);
  const remaining = technologies.length - maxCount;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {displayTechs.map((tech, i) => (
        <Badge key={i} variant="outline">{tech}</Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline">+{remaining} more</Badge>
      )}
    </div>
  );
}
