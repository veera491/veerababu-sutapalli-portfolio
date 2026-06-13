import React from 'react';
import { SectionShell } from '../layout/section-shell';
import { ProjectViewModel } from './project-types';
import { FeaturedProjectCard } from './featured-project-card';
import { ProjectCard } from './project-card';

export interface SelectedWorkSectionProps {
  projects: readonly ProjectViewModel[];
}

export function SelectedWorkSection({ projects }: SelectedWorkSectionProps) {
  const featured = projects.filter(p => p.itemType === 'featured').sort((a, b) => a.order - b.order);
  const standard = projects.filter(p => p.itemType === 'standard').sort((a, b) => a.order - b.order);

  if (projects.length === 0) return null;

  return (
    <SectionShell
      id="work"
      eyebrow="Selected Work"
      title="Research, Machine Learning and Engineering Projects"
      description="The following selection spans algorithmic research, AI systems, analytics infrastructure, and applied product engineering."
      className="bg-[var(--color-background)]"
    >
      <div className="flex flex-col mt-8">
        {/* Featured Projects */}
        {featured.length > 0 && (
          <div className="mb-16 md:mb-24">
            <h3 className="sr-only">Featured Projects</h3>
            <div className="flex flex-col">
              {featured.map(project => (
                <FeaturedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Standard Projects */}
        {standard.length > 0 && (
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-8 border-b border-[var(--color-border)] pb-4">
              Supporting Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {standard.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
