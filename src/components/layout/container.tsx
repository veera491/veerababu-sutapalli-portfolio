import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'narrow' | 'default' | 'wide';
  children: React.ReactNode;
}

export function Container({ size = 'default', className = '', children, ...props }: ContainerProps) {
  let sizeClass = 'max-w-7xl'; // ~1280px default
  if (size === 'narrow') sizeClass = 'max-w-4xl';
  if (size === 'wide') sizeClass = 'max-w-[1440px]';

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
