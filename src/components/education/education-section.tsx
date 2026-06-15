import React from 'react';
import { getSection, requireStringField, getStringArrayField, getOptionalStringField } from '@/lib/csv/repository';
import { SectionShell } from '../layout/section-shell';
import { SurfaceCard } from '../ui/surface-card';
import { Badge } from '../ui/badge';
import { ButtonLink } from '../ui/button-link';
import { GraduationCap, Award, Calendar, MapPin, ExternalLink } from 'lucide-react';

export async function EducationSection() {
  const educations = await getSection('education');
  const achievements = await getSection('achievement');

  return (
    <SectionShell
      id="education"
      eyebrow="Qualifications"
      title="Education &amp; Achievements"
      description="Formal academic degrees, technical specializations, and competitive achievements."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
        {/* Education Column */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-[var(--color-accent)]" aria-hidden="true" />
            Academic Degrees
          </h3>

          <div className="flex flex-col gap-6">
            {educations.map((edu) => {
              const inst = requireStringField(edu, 'institution');
              const degree = requireStringField(edu, 'degree');
              const fieldOfStudy = getOptionalStringField(edu, 'field_of_study') || '';
              const startDate = requireStringField(edu, 'start_date');
              const endDate = requireStringField(edu, 'end_date');
              const location = getOptionalStringField(edu, 'location');
              const desc = getOptionalStringField(edu, 'description');
              const specializations = getStringArrayField(edu, 'specialization');

              return (
                <SurfaceCard key={edu.itemId} className="p-6 hover:border-[var(--color-border-strong)] transition-colors">
                  <div className="flex justify-between items-start gap-4 mb-2 flex-wrap sm:flex-nowrap">
                    <div>
                      <h4 className="text-lg font-semibold text-[var(--color-text)]">
                        {degree} in {fieldOfStudy}
                      </h4>
                      <p className="text-sm font-medium text-[var(--color-muted)] mt-0.5">
                        {inst}
                      </p>
                    </div>

                    <div className="flex flex-col items-end text-xs font-mono text-[var(--color-muted)] shrink-0">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {startDate} — {endDate}
                      </span>
                      {location && (
                        <span className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {location}
                        </span>
                      )}
                    </div>
                  </div>

                  {desc && (
                    <p className="text-sm text-[var(--color-muted)] mb-4 leading-relaxed text-pretty">
                      {desc}
                    </p>
                  )}

                  {specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {specializations.map((spec, idx) => (
                        <Badge key={idx} variant="outline">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  )}
                </SurfaceCard>
              );
            })}
          </div>
        </div>

        {/* Achievements Column */}
        <div className="flex flex-col gap-6">
          <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
            <Award className="h-6 w-6 text-[var(--color-accent)]" aria-hidden="true" />
            Key Achievements
          </h3>

          <div className="flex flex-col gap-6">
            {achievements.map((ach) => {
              const title = requireStringField(ach, 'title');
              const desc = requireStringField(ach, 'description');
              const date = getOptionalStringField(ach, 'date');
              const url = getOptionalStringField(ach, 'url');

              return (
                <SurfaceCard key={ach.itemId} className="p-6 hover:border-[var(--color-border-strong)] transition-colors h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="text-lg font-semibold text-[var(--color-text)]">
                        {title}
                      </h4>
                      {date && (
                        <span className="text-xs font-mono text-[var(--color-muted)] px-2 py-0.5 border border-[var(--color-border)] rounded-sm shrink-0">
                          {date}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed text-pretty">
                      {desc}
                    </p>
                  </div>

                  {url && (
                    <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                      <ButtonLink href={url} variant="text" icon={ExternalLink} className="text-xs min-h-[36px] py-1">
                        View Credential / Profile
                      </ButtonLink>
                    </div>
                  )}
                </SurfaceCard>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
