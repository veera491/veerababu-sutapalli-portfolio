import React from 'react';
import { getImageProps } from 'next/image';

export interface HeroPortraitProps {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}

export function HeroPortrait({ desktopSrc, mobileSrc, alt }: HeroPortraitProps) {
  const common = { alt, fill: true, priority: true, sizes: '(max-width: 768px) 100vw, 50vw' };

  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...common, src: mobileSrc });

  const {
    props: { srcSet: desktopSrcSet, ...desktopRest },
  } = getImageProps({ ...common, src: desktopSrc });

  return (
    <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-[4/5] mx-auto rounded-sm overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl">
      {/* Decorative grid lines behind the image but inside container */}
      <div className="absolute inset-0 bg-grid opacity-20" aria-hidden="true" />
      
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
        <img
          srcSet={mobileSrcSet}
          {...desktopRest}
          alt={alt}
          className="object-cover object-top w-full h-full relative z-10 grayscale-[15%]"
        />
      </picture>

      {/* Restrained copper accent line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-accent)] z-20 opacity-80" aria-hidden="true" />
    </div>
  );
}
