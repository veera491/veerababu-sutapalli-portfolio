import React from 'react';
import Image from 'next/image';
import { getAssetOrFallback } from '@/lib/assets/manifest';
import { AssetCategory } from '@/lib/assets/types';

export interface ProjectMediaProps {
  src?: string;
  alt: string;
  category: AssetCategory;
  className?: string;
  priority?: boolean;
}

export function ProjectMedia({ src, alt, category, className = '', priority = false }: ProjectMediaProps) {
  const finalSrc = getAssetOrFallback(src || '', category);
  
  return (
    <div className={`relative w-full overflow-hidden bg-[var(--color-surface)] ${className}`}>
      {/* Decorative texture to hide from assistive tech */}
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      <Image 
        src={finalSrc} 
        alt={alt} 
        fill 
        priority={priority}
        className="object-cover relative z-10"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
