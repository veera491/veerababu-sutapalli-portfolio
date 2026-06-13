import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
}

export function ButtonLink({
  href,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'right',
  disabled,
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  const baseStyles = 'inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] rounded-sm disabled:opacity-50 disabled:pointer-events-none';
  
  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles = 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-opacity-90';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-border-strong)]';
  } else if (variant === 'ghost') {
    variantStyles = 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)]';
  } else if (variant === 'text') {
    variantStyles = 'bg-transparent text-[var(--color-accent)] hover:underline px-0 min-w-0';
  }

  const combinedClassName = `${baseStyles} ${variantStyles} ${className}`;
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');
  const externalProps = isExternal && !href.startsWith('mailto:') 
    ? { target: '_blank', rel: 'noreferrer' } 
    : {};

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />}
    </>
  );

  if (isExternal) {
    return (
      <a 
        href={href} 
        className={combinedClassName}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        {...externalProps}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link 
      href={href} 
      className={combinedClassName}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {content}
    </Link>
  );
}
