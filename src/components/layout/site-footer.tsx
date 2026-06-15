import React from 'react';
import { requireItem, requireStringField, getOptionalStringField } from '@/lib/csv/repository';
import { Container } from './container';
import { ButtonLink } from '../ui/button-link';
import { FileText, ArrowUp } from 'lucide-react';

export async function SiteFooter() {
  const footerItem = await requireItem('footer', 'main');
  const copyright = requireStringField(footerItem, 'copyright');
  const tagline = requireStringField(footerItem, 'tagline');
  const resumePath = getOptionalStringField(footerItem, 'resume_path');

  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-background)] py-12">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {copyright}
            </span>
            <p className="text-xs text-[var(--color-muted)] max-w-md leading-relaxed">
              {tagline}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {resumePath && (
              <ButtonLink
                href={resumePath}
                variant="ghost"
                icon={FileText}
                className="text-xs min-h-[36px] py-1.5"
              >
                Download Résumé
              </ButtonLink>
            )}

            <a
              href="#home"
              className="inline-flex items-center justify-center h-11 w-11 rounded-sm border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus:outline-none"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
