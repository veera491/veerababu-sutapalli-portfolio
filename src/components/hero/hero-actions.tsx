import { requireStringField } from '@/lib/csv/repository';
import { ButtonLink } from '@/components/ui/button-link';
import { ArrowRight, FileText } from 'lucide-react';
import { PortfolioItem } from '@/lib/csv/types';

export interface HeroActionsProps {
  projectsItem: PortfolioItem;
  resumeItem?: PortfolioItem;
}

export function HeroActions({ projectsItem, resumeItem }: HeroActionsProps) {
  if (!projectsItem.enabled) return null;

  const projectsLabel = requireStringField(projectsItem, 'label');
  const projectsTarget = requireStringField(projectsItem, 'target');

  const resumeEnabled = resumeItem?.enabled;
  const resumeLabel = resumeEnabled ? requireStringField(resumeItem, 'label') : '';
  const resumeTarget = resumeEnabled ? requireStringField(resumeItem, 'target') : '';

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <ButtonLink href={projectsTarget} variant="primary" icon={ArrowRight}>
        {projectsLabel}
      </ButtonLink>
      
      {resumeEnabled && (
        <ButtonLink href={resumeTarget} variant="secondary" icon={FileText}>
          {resumeLabel}
        </ButtonLink>
      )}
    </div>
  );
}
