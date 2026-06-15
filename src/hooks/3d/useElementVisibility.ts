'use client';

import { useState, useEffect, RefObject } from 'react';

export function useElementVisibility(ref: RefObject<HTMLElement | null>): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.05,
      }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [ref]);

  return isVisible;
}
