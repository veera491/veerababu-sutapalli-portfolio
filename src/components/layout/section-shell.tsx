import React from 'react';
import { Container } from './container';

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
  contentSize?: 'narrow' | 'default' | 'wide';
  className?: string;
}

export function SectionShell({ 
  id, 
  title, 
  eyebrow, 
  description, 
  children, 
  contentSize = 'default',
  className = '',
  ...props 
}: SectionShellProps) {
  return (
    <section 
      id={id} 
      className={`py-20 md:py-32 scroll-mt-24 ${className}`}
      aria-labelledby={`${id}-heading`}
      {...props}
    >
      <Container size={contentSize}>
        <div className="mb-12 md:mb-16 max-w-2xl">
          {eyebrow && (
            <span className="block text-sm md:text-base font-mono text-[var(--color-accent)] tracking-wider uppercase mb-3">
              {eyebrow}
            </span>
          )}
          <h2 id={`${id}-heading`} className="text-clamp-h2 font-semibold tracking-tight text-[var(--color-text)] mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-[var(--color-muted)] max-w-xl">
              {description}
            </p>
          )}
        </div>
        <div className="w-full">
          {children}
        </div>
      </Container>
    </section>
  );
}
