import React from 'react';
import { requireItem, requireStringField, getStringArrayField } from '@/lib/csv/repository';
import { SectionShell } from '../layout/section-shell';
import { Badge } from '../ui/badge';
import { SurfaceCard } from '../ui/surface-card';

export async function AboutSection() {
  const aboutItem = await requireItem('about', 'main');
  const heading = requireStringField(aboutItem, 'heading');
  const paragraphs = getStringArrayField(aboutItem, 'paragraph');
  const keywords = getStringArrayField(aboutItem, 'keyword');

  return (
    <SectionShell
      id="about"
      eyebrow="Profile"
      title="About Me"
      description="My focus lies in building reliable, scalable, and production-ready machine learning systems."
      className="bg-[var(--color-surface)]/30 border-y border-[var(--color-border)]"
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
        {/* Biography text */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-text)] leading-snug">
            {heading}
          </h3>
          <div className="flex flex-col gap-4 text-base text-[var(--color-muted)] leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Technical Focus Keywords */}
        <div className="w-full lg:w-1/3">
          <SurfaceCard className="p-6 h-full flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-mono uppercase text-[var(--color-accent)] tracking-wider mb-4">
                Core Specialties
              </h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="accent">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--color-border)] font-mono text-xs text-[var(--color-muted)]">
              <p>{"// Rigorous verification"}</p>
              <p>{"// Production-ready integration"}</p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </SectionShell>
  );
}
