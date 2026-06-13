import React from 'react';

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Eyebrow({ children, className = '', ...props }: EyebrowProps) {
  return (
    <span 
      className={`block text-sm md:text-base font-mono text-[var(--color-accent)] tracking-wider uppercase mb-3 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
