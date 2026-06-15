import React from 'react';
import { getSection, requireStringField, getStringArrayField, getOptionalStringField } from '@/lib/csv/repository';
import { SectionShell } from '../layout/section-shell';
import { SurfaceCard } from '../ui/surface-card';
import { ButtonLink } from '../ui/button-link';
import { BookOpen, FileText, Settings, Award } from 'lucide-react';

export async function ResearchSection() {
  const publications = await getSection('publication');

  return (
    <SectionShell
      id="research"
      eyebrow="Publications"
      title="Research &amp; Publications"
      description="Academic research publications and thesis reports covering distributed deep learning and forecasting."
      className="bg-[var(--color-surface)]/30 border-y border-[var(--color-border)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {publications.map((pub) => {
          const title = requireStringField(pub, 'title');
          const summary = requireStringField(pub, 'summary');
          const authors = getStringArrayField(pub, 'author');
          const pubUrl = getOptionalStringField(pub, 'publication_url');

          const researchProblem = getOptionalStringField(pub, 'research_problem');
          const contributions = getStringArrayField(pub, 'contribution');
          const methodologies = getStringArrayField(pub, 'methodology');

          return (
            <SurfaceCard key={pub.itemId} className="p-6 md:p-8 hover:border-[var(--color-border-strong)] transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider bg-[var(--color-accent-soft)] px-2.5 py-1 rounded-sm">
                    Research Paper
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-3 text-balance leading-snug">
                  {title}
                </h3>

                {authors.length > 0 && (
                  <p className="text-xs font-mono text-[var(--color-muted)] mb-6">
                    Author: {authors.join(', ')}
                  </p>
                )}

                <p className="text-sm text-[var(--color-text)] mb-6 leading-relaxed text-pretty">
                  {summary}
                </p>

                {/* Optional structured fields like problem and methodology */}
                <div className="space-y-4 mb-6 border-t border-[var(--color-border)] pt-4 text-sm">
                  {researchProblem && (
                    <div className="flex gap-3 items-start">
                      <BookOpen className="h-4 w-4 text-[var(--color-accent)] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <strong className="text-xs font-mono uppercase text-[var(--color-text)] block mb-0.5">Research Problem</strong>
                        <span className="text-[var(--color-muted)] leading-relaxed text-pretty">{researchProblem}</span>
                      </div>
                    </div>
                  )}

                  {methodologies.length > 0 && (
                    <div className="flex gap-3 items-start">
                      <Settings className="h-4 w-4 text-[var(--color-accent)] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <strong className="text-xs font-mono uppercase text-[var(--color-text)] block mb-0.5">Methodology</strong>
                        <span className="text-[var(--color-muted)] leading-relaxed text-pretty">{methodologies.join(' — ')}</span>
                      </div>
                    </div>
                  )}

                  {contributions.length > 0 && (
                    <div className="flex gap-3 items-start">
                      <Award className="h-4 w-4 text-[var(--color-accent)] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <strong className="text-xs font-mono uppercase text-[var(--color-text)] block mb-0.5">Key Contribution</strong>
                        <span className="text-[var(--color-muted)] leading-relaxed text-pretty">{contributions.join(' — ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {pubUrl && (
                <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                  <ButtonLink href={pubUrl} variant="secondary" icon={FileText} className="text-xs min-h-[38px] py-1.5 w-full sm:w-auto">
                    View Publication Portal
                  </ButtonLink>
                </div>
              )}
            </SurfaceCard>
          );
        })}
      </div>
    </SectionShell>
  );
}
