import { getSection, requireItem, requireStringField } from '@/lib/csv/repository';
import { Container } from '@/components/layout/container';
import { SectionShell } from '@/components/layout/section-shell';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SectionHeading } from '@/components/ui/section-heading';
import { SurfaceCard } from '@/components/ui/surface-card';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button-link';

export default async function Home() {
  const identityItem = await requireItem('site', 'identity');
  const fullName = requireStringField(identityItem, 'full_name');
  const primaryRole = requireStringField(identityItem, 'primary_role');
  const tagline = requireStringField(identityItem, 'tagline');

  const socialItems = await getSection('social');
  const proofItems = await getSection('proof');

  return (
    <>
      <section id="hero-minimal" className="py-24 md:py-32">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Portfolio Foundation</Eyebrow>
            <SectionHeading as="h1" className="mb-6 lg:text-6xl">{fullName}</SectionHeading>
            <p className="text-xl md:text-2xl text-[var(--color-muted)] max-w-2xl mb-8">
              {tagline}
            </p>
            
            <Badge variant="accent" className="px-4 py-1.5 text-sm mb-12 md:mb-20">
              {primaryRole}
            </Badge>

            <div>
              <h3 className="text-sm font-mono text-[var(--color-muted)] uppercase tracking-wider mb-6">Connect</h3>
              <div className="flex flex-wrap gap-4">
                {socialItems.map(item => {
                  if (!item.enabled) return null;
                  const label = requireStringField(item, 'label');
                  const url = requireStringField(item, 'url');
                  
                  if (url.startsWith('REPLACE_WITH_')) return null;

                  return (
                    <ButtonLink 
                      key={item.itemId}
                      href={url} 
                      variant="secondary"
                    >
                      {label}
                    </ButtonLink>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionShell 
        id="proof" 
        title="Proof of Work" 
        description="Core qualifications and achievements validating professional capabilities."
      >
        <div className="flex flex-wrap gap-3 mb-16">
          {proofItems.map(item => {
            if (!item.enabled) return null;
            const val = requireStringField(item, 'value');
            return <Badge key={item.itemId} variant="default" className="px-3 py-1.5 text-sm">{val}</Badge>;
          })}
        </div>

        <SurfaceCard className="p-8 md:p-12">
          <Eyebrow>Architecture</Eyebrow>
          <h3 className="text-2xl font-semibold mb-4 text-[var(--color-text)]">CSV Content Engine</h3>
          <p className="text-[var(--color-muted)] max-w-2xl mb-6">
            Content managed through one validated CSV. All visible personal text comes directly from the server-side CSV repository.
          </p>
          <div className="flex flex-col gap-3 font-mono text-sm text-[var(--color-muted)] border-t border-[var(--color-border)] pt-6">
            <p>✓ Validation Engine Passing</p>
            <p>✓ Asset Sandbox Verified</p>
            <p>✓ Premium Design Tokens Applied</p>
          </div>
        </SurfaceCard>
      </SectionShell>
    </>
  );
}
