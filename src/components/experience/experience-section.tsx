import React from 'react';
import { getSection, requireStringField, getStringArrayField, getOptionalStringField } from '@/lib/csv/repository';
import { SectionShell } from '../layout/section-shell';
import { SurfaceCard } from '../ui/surface-card';
import { Badge } from '../ui/badge';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

export async function ExperienceSection() {
  const experiences = await getSection('experience');

  return (
    <SectionShell
      id="experience"
      eyebrow="Journey"
      title="Professional Experience"
      description="Internships and software engineering experience focused on big data, machine learning, and application development."
      className="bg-[var(--color-surface)]/30 border-y border-[var(--color-border)]"
    >
      <div className="relative border-l border-[var(--color-border)] ml-2 md:ml-6 pl-6 md:pl-10 space-y-12 w-full">
        {experiences.map((exp) => {
          const org = requireStringField(exp, 'organization');
          const role = requireStringField(exp, 'role');
          const startDate = requireStringField(exp, 'start_date');
          const endDate = requireStringField(exp, 'end_date');
          const summary = requireStringField(exp, 'summary');
          const location = getOptionalStringField(exp, 'location');
          const bullets = getStringArrayField(exp, 'bullet');
          const technologies = getStringArrayField(exp, 'technology');
          const metrics = getStringArrayField(exp, 'metric');

          return (
            <div key={exp.itemId} className="relative group">
              {/* Timeline Node marker */}
              <span className="absolute -left-[31px] md:-left-[47px] top-1.5 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-[var(--color-background)] border border-[var(--color-border-strong)] group-hover:border-[var(--color-accent)] transition-colors">
                <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-[var(--color-accent)] opacity-40 group-hover:opacity-100 transition-opacity"></span>
              </span>

              <SurfaceCard className="p-6 md:p-8 hover:border-[var(--color-border-strong)] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-text)] flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-[var(--color-accent)] shrink-0" aria-hidden="true" />
                      {role}
                    </h3>
                    <p className="text-base font-medium text-[var(--color-muted)] mt-1">
                      {org}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono text-[var(--color-muted)]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {startDate} — {endDate}
                    </span>
                    {location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {location}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-base text-[var(--color-text)] mb-4 leading-relaxed text-pretty">
                  {summary}
                </p>

                {/* Render bullet accomplishments if present */}
                {bullets.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-[var(--color-muted)] space-y-2 mb-4 pl-1">
                    {bullets.map((bullet, idx) => (
                      <li key={idx} className="text-pretty">{bullet}</li>
                    ))}
                  </ul>
                )}

                {/* Render key project metrics if present */}
                {metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {metrics.map((metric, idx) => (
                      <span key={idx} className="inline-flex items-center text-xs font-mono text-[var(--color-accent)] bg-[var(--color-accent-soft)] px-2.5 py-1 rounded-sm">
                        {metric}
                      </span>
                    ))}
                  </div>
                )}

                {/* Render Technologies list */}
                {technologies.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <h4 className="text-xs font-mono uppercase text-[var(--color-muted)] mb-2 tracking-wider">
                      Technologies Utilized:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </SurfaceCard>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
