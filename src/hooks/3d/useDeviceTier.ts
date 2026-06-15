'use client';

import { useState, useEffect } from 'react';
import { useWebGLSupport } from './useWebGLSupport';
import { useReducedMotion } from './useReducedMotion';

export type DeviceTier = 'A' | 'B' | 'C';

interface ExtendedNavigator {
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export function useDeviceTier(): DeviceTier {
  const hasWebGL = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();
  const [tier, setTier] = useState<DeviceTier>('C');

  useEffect(() => {
    const checkTier = () => {
      // Audit baseline bypass
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('disable-3d') === 'true') {
          setTier('C');
          return;
        }
      }

      if (!hasWebGL || prefersReducedMotion) {
        setTier('C');
        return;
      }

      const isMobileOrTablet =
        window.matchMedia('(max-width: 1023px)').matches ||
        window.matchMedia('(pointer: coarse)').matches;

      // Safe check device memory / cores
      let isLowPower = false;
      if (typeof navigator !== 'undefined') {
        const nav = navigator as ExtendedNavigator;
        if (nav.deviceMemory && nav.deviceMemory < 4) {
          isLowPower = true;
        }
        if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) {
          isLowPower = true;
        }
      }

      if (isMobileOrTablet || isLowPower) {
        setTier('B');
      } else {
        setTier('A');
      }
    };

    // Defer state update to next macrotask to prevent React 19 synchronous cascading render warnings
    const timer = setTimeout(checkTier, 0);

    window.addEventListener('resize', checkTier);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkTier);
    };
  }, [hasWebGL, prefersReducedMotion]);

  return tier;
}
