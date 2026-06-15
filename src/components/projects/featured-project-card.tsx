import React from 'react';
import { ProjectViewModel } from './project-types';
import { SurfaceCard } from '../ui/surface-card';
import { ProjectMedia } from './project-media';
import { ProjectMetrics } from './project-metrics';
import { ProjectTechnologies } from './project-technologies';
import { ProjectLinks } from './project-links';

export function FeaturedProjectCard({ project, priority = false }: { project: ProjectViewModel; priority?: boolean }) {
  // Use 'publication' category fallback for research-oriented projects if needed
  const mediaCategory = project.publicationUrl ? 'publication' : 'project';

  return (
    <SurfaceCard className="flex flex-col lg:flex-row mb-12 lg:mb-16 hover:border-[var(--color-border-strong)] transition-colors">
      <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto relative border-b lg:border-b-0 lg:border-r border-[var(--color-border)]">
        <ProjectMedia 
          src={project.coverImage} 
          alt={`Visual representation of ${project.title}`} 
          category={mediaCategory} 
          className="h-full"
          priority={priority}
        />
      </div>
      <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            {project.category && (
              <span className="text-xs font-mono text-[var(--color-accent)] tracking-wider uppercase">
                {project.category}
              </span>
            )}
            {project.status && (
              <span className="text-xs font-mono text-[var(--color-muted)]">
                {project.status}
              </span>
            )}
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] mb-3 text-balance">
            {project.title}
          </h3>
          <p className="text-base text-[var(--color-muted)] mb-6 text-pretty">
            {project.summary || project.shortDescription}
          </p>
          <ProjectMetrics metrics={project.metrics} maxCount={3} />
          <ProjectTechnologies technologies={project.technologies} maxCount={6} />
        </div>
        {(project.githubUrl || project.publicationUrl || project.demoUrl) && (
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
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
