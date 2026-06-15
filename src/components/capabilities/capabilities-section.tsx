import React from 'react';
import { getSection, getStringArrayField, requireStringField } from '@/lib/csv/repository';
import { SectionShell } from '../layout/section-shell';
import { SurfaceCard } from '../ui/surface-card';
import { Badge } from '../ui/badge';

export async function CapabilitiesSection() {
  const capabilities = await getSection('capability');
  const skillGroups = await getSection('skill_group');

  return (
    <SectionShell
      id="capabilities"
      eyebrow="Expertise"
      title="Core Capabilities &amp; Technical Skills"
      description="Applied engineering capabilities spanning data infrastructure, machine learning pipelines, and GenAI workflows."
    >
      <div className="flex flex-col gap-16 w-full">
        {/* Core Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((item) => {
            const title = requireStringField(item, 'title');
            const description = requireStringField(item, 'description');

            return (
              <SurfaceCard key={item.itemId} className="p-6 hover:border-[var(--color-border-strong)] transition-colors">
                <h4 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                  {title}
                </h4>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {description}
                </p>
              </SurfaceCard>
            );
          })}
        </div>

        {/* Detailed Skills Inventory */}
        <div className="border-t border-[var(--color-border)] pt-16">
          <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-8 border-b border-[var(--color-border)] pb-4">
            Technical Skill Inventory
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {skillGroups.map((group) => {
              const title = requireStringField(group, 'title');
              const skills = getStringArrayField(group, 'skill');

              return (
                <div key={group.itemId} className="flex flex-col gap-3">
                  <h4 className="text-sm font-mono uppercase text-[var(--color-accent)] tracking-wider">
                    {title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
