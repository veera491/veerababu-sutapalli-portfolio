import React from 'react';
import { ExternalLink } from '../ui/external-link';

export interface ProjectLinksProps {
  githubUrl?: string;
  publicationUrl?: string;
  demoUrl?: string;
  title: string;
}

export function ProjectLinks({ githubUrl, publicationUrl, demoUrl, title }: ProjectLinksProps) {
  if (!githubUrl && !publicationUrl && !demoUrl) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium">
      {githubUrl && (
        <ExternalLink href={githubUrl} aria-label={`GitHub repository for ${title}`}>
          GitHub
        </ExternalLink>
      )}
      {publicationUrl && (
        <ExternalLink href={publicationUrl} aria-label={`Publication for ${title}`}>
          Publication
        </ExternalLink>
      )}
      {demoUrl && (
        <ExternalLink href={demoUrl} aria-label={`Live demo for ${title}`}>
          Live Demo
        </ExternalLink>
      )}
    </div>
  );
}
