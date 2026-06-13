import React from 'react';
import Link from 'next/link';

export interface NavLink {
  label: string;
  target: string;
}

export interface DesktopNavigationProps {
  links: NavLink[];
}

export function DesktopNavigation({ links }: DesktopNavigationProps) {
  return (
    <nav className="hidden md:flex items-center gap-8" aria-label="Desktop">
      {links.map((link) => (
        <Link 
          key={link.label}
          href={link.target}
          className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] focus:outline-none rounded-sm"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
