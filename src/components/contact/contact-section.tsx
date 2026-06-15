import React from 'react';
import { requireItem, requireStringField, getSection, getOptionalStringField } from '@/lib/csv/repository';
import { SectionShell } from '../layout/section-shell';
import { ButtonLink } from '../ui/button-link';
import { Mail, MapPin, Send, ExternalLink } from 'lucide-react';

export async function ContactSection() {
  const contactItem = await requireItem('contact', 'primary');
  const email = requireStringField(contactItem, 'email');
  const availability = requireStringField(contactItem, 'value');
  const location = getOptionalStringField(contactItem, 'location');

  const socialItems = await getSection('social');

  return (
    <SectionShell
      id="contact"
      eyebrow="Connect"
      title="Get in Touch"
      description="Let's discuss potential opportunities, collaborations, or technical projects."
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8 py-8">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] mb-2">
          <Mail className="h-8 w-8" aria-hidden="true" />
        </div>

        <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
          Start a Conversation
        </h3>

        <p className="text-lg text-[var(--color-muted)] max-w-xl leading-relaxed text-pretty">
          {availability}
        </p>

        {location && (
          <p className="text-sm font-mono text-[var(--color-muted)] flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--color-accent)] shrink-0" aria-hidden="true" />
            {location}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4 w-full sm:w-auto">
          <ButtonLink href={email} variant="primary" icon={Send} className="w-full sm:w-auto">
            Email Me
          </ButtonLink>

          {socialItems.map((social) => {
            const label = requireStringField(social, 'label');
            const url = requireStringField(social, 'url');

            return (
              <ButtonLink
                key={social.itemId}
                href={url}
                variant="secondary"
                icon={ExternalLink}
                className="w-full sm:w-auto text-xs min-h-[44px]"
              >
                {label}
              </ButtonLink>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
