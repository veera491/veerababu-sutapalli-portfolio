import React from 'react';

export interface PageShellProps {
  children: React.ReactNode;
  header: React.ReactNode;
  footer?: React.ReactNode;
}

export function PageShell({ children, header, footer }: PageShellProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Subtle technical grid texture */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-grid opacity-30" aria-hidden="true" />
      
      {header}
      
      <main className="flex-grow flex flex-col pt-16 sm:pt-20">
        {children}
      </main>
      
      {footer}
    </div>
  );
}
