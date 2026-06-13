import React from 'react';
import { ProjectViewModel } from './project-types';
import { SurfaceCard } from '../ui/surface-card';
import { ProjectMedia } from './project-media';
import { ProjectMetrics } from './project-metrics';
import { ProjectTechnologies } from './project-technologies';
import { ProjectLinks } from './project-links';

export function ProjectCard({ project }: { project: ProjectViewModel }) {
  const mediaCategory = project.publicationUrl ? 'publication' : 'project';

  return (
    <SurfaceCard className="flex flex-col h-full hover:border-[var(--color-border-strong)] transition-colors">
      <div className="w-full aspect-video border-b border-[var(--color-border)] relative">
        <ProjectMedia 
          src={project.coverImage} 
          alt={`Cover for ${project.title}`} 
          category={mediaCategory} 
          className="h-full"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {project.category && (
          <span className="text-xs font-mono text-[var(--color-accent)] tracking-wider uppercase mb-3 block">
            {project.category}
          </span>
        )}
        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2 text-balance">
          {project.title}
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4 flex-grow text-pretty">
          {project.shortDescription || project.summary}
        </p>
        
        <ProjectMetrics metrics={project.metrics} maxCount={2} />
        
        <div className="mt-4">
          <ProjectTechnologies technologies={project.technologies} maxCount={5} />
        </div>
        
        {(project.githubUrl || project.publicationUrl || project.demoUrl) && (
          <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <ProjectLinks 
              githubUrl={project.githubUrl} 
              publicationUrl={project.publicationUrl} 
              demoUrl={project.demoUrl} 
              title={project.title} 
            />
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}
