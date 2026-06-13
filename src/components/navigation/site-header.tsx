import React from 'react';
import Link from 'next/link';
import { Container } from '../layout/container';
import { DesktopNavigation } from './desktop-navigation';
import { MobileNavigation, NavLink } from './mobile-navigation';
import { ButtonLink } from '../ui/button-link';
import { parseCsv } from '@/lib/csv/parser';

export async function SiteHeader() {
  const { content } = await parseCsv();
  
  const siteIdentity = content['site']?.find(i => i.itemId === 'identity');
  const fullName = siteIdentity?.fields['full_name'] as string || 'Portfolio';
  const resumePath = siteIdentity?.fields['resume_path'] as string;
  
  const navItems = content['navigation'] || [];
  const links: NavLink[] = navItems
    .filter(item => item.enabled)
    .sort((a, b) => a.itemOrder - b.itemOrder)
    .map(item => ({
      label: item.fields['label'] as string,
      target: item.fields['target'] as string,
    }));
    
  const resumeCta = content['hero_cta']?.find(i => i.itemId === 'resume');
  const showResume = resumeCta?.enabled && resumePath;
  const resumeLabel = resumeCta?.fields['label'] as string || 'View Résumé';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-background)]/80 border-b border-[var(--color-border)]">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="text-lg font-semibold tracking-tight text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus:outline-none rounded-sm"
          >
            {fullName}
          </Link>
          
          <div className="flex items-center gap-6">
            <DesktopNavigation links={links} />
            
            {showResume && (
              <ButtonLink 
                href={resumePath} 
                variant="secondary" 
                className="hidden md:inline-flex py-1.5 min-h-[36px]"
              >
                {resumeLabel}
              </ButtonLink>
            )}
            
            <MobileNavigation links={links} />
          </div>
        </div>
      </Container>
    </header>
  );
}
