import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  let variantStyles = '';
  if (variant === 'default') {
    variantStyles = 'bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]';
  } else if (variant === 'accent') {
    variantStyles = 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border border-[var(--color-accent-soft)]';
  } else if (variant === 'outline') {
    variantStyles = 'bg-transparent text-[var(--color-muted)] border border-[var(--color-border-strong)]';
  }

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono tracking-wide ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
