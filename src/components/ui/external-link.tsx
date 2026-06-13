import React from 'react';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

export interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

export function ExternalLink({ href, children, showIcon = true, className = '', ...props }: ExternalLinkProps) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className={`inline-flex items-center gap-1 text-[var(--color-accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus:outline-none rounded-sm ${className}`}
      {...props}
    >
      {children}
      {showIcon && <ExternalLinkIcon className="h-3 w-3" aria-hidden="true" />}
    </a>
  );
}
