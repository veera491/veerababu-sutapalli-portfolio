import React from 'react';

export interface SurfaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  children: React.ReactNode;
}

export function SurfaceCard({ interactive = false, children, className = '', ...props }: SurfaceCardProps) {
  const baseClasses = 'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-sm overflow-hidden transition-colors';
  const interactiveClasses = interactive ? 'hover:border-[var(--color-border-strong)] cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] focus:outline-none' : '';
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
