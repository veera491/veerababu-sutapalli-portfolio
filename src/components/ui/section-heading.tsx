import React from 'react';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function SectionHeading({ children, as = 'h2', className = '', ...props }: SectionHeadingProps) {
  const Component = as;
  return (
    <Component 
      className={`text-clamp-h2 font-semibold tracking-tight text-[var(--color-text)] mb-4 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
