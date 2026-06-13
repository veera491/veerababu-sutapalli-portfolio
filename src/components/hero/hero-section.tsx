import { getSection, requireItem, requireStringField, getOptionalStringField } from '@/lib/csv/repository';
import { Container } from '@/components/layout/container';
import { HeroPortrait } from './hero-portrait';
import { HeroActions } from './hero-actions';
import { HeroProofStrip } from './hero-proof-strip';

export async function HeroSection() {
  const identityItem = await requireItem('site', 'identity');
  const fullName = requireStringField(identityItem, 'full_name');
  const primaryRole = requireStringField(identityItem, 'primary_role');
  const tagline = requireStringField(identityItem, 'tagline');
  const openToWork = getOptionalStringField(identityItem, 'open_to_work') === 'true';

  const heroPhase2 = await requireItem('hero', 'phase_2');
  const heroPhase4 = await requireItem('hero', 'phase_4');
  
  const eyebrow = getOptionalStringField(heroPhase2, 'eyebrow');
  const h1Text = getOptionalStringField(heroPhase2, 'text') || fullName;
  const specialtyLine = getOptionalStringField(heroPhase4, 'text');

  const heroSettings = await requireItem('hero', 'settings');
  const staticImage = requireStringField(heroSettings, 'static_image');
  const mobileImage = getOptionalStringField(heroSettings, 'mobile_image') || staticImage;
  const portraitAlt = getOptionalStringField(heroSettings, 'portrait_alt') || 'Portrait';

  const heroCtaProjects = await requireItem('hero_cta', 'projects');
  const heroCtaResume = await requireItem('hero_cta', 'resume');

  const proofItems = await getSection('proof');

  return (
    <section id="home" className="relative w-full pt-16 md:pt-24 lg:pt-32 pb-16 overflow-hidden" aria-labelledby="home-heading">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-end w-full">
          {/* Copy Column */}
          <div className="w-full lg:w-[55%] flex flex-col pt-8 lg:pb-12 z-10">
            {openToWork && (
              <div className="inline-flex items-center gap-2 mb-6 w-fit bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]"></span>
                </span>
                <span className="text-sm font-medium text-[var(--color-text)]">Open to opportunities</span>
              </div>
            )}
            
            {eyebrow && (
              <span className="block text-sm md:text-base font-mono text-[var(--color-accent)] tracking-wider uppercase mb-4">
                {eyebrow}
              </span>
            )}
            
            <h1 id="home-heading" className="text-clamp-h1 font-semibold tracking-tight text-[var(--color-text)] mb-6 text-balance leading-tight max-w-2xl">
              {h1Text}
            </h1>
            
            <p className="text-xl md:text-2xl font-medium text-[var(--color-text)] mb-4 max-w-xl">
              {primaryRole}
            </p>
            
            <p className="text-lg md:text-xl text-[var(--color-muted)] mb-6 max-w-xl text-pretty">
              {tagline}
            </p>
            
            {specialtyLine && (
              <p className="text-base md:text-lg text-[var(--color-muted)] mb-10 max-w-xl border-l-2 border-[var(--color-accent)] pl-4">
                {specialtyLine}
              </p>
            )}

            <HeroActions projectsItem={heroCtaProjects} resumeItem={heroCtaResume} />
          </div>

          {/* Portrait Column */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end mt-8 lg:mt-0 relative z-0">
             {/* Radial gradient background behind portrait */}
             <div 
               className="absolute inset-0 blur-3xl opacity-30 pointer-events-none" 
               aria-hidden="true" 
               style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 60%)' }}
             />
             <HeroPortrait desktopSrc={staticImage} mobileSrc={mobileImage} alt={portraitAlt} />
          </div>
        </div>

        <HeroProofStrip items={proofItems} />
      </Container>
    </section>
  );
}
