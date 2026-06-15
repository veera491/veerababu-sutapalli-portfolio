'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CanvasFallback from './CanvasFallback';
import { useDeviceTier } from '@/hooks/3d/useDeviceTier';
import { useWebGLSupport } from '@/hooks/3d/useWebGLSupport';
import { useReducedMotion } from '@/hooks/3d/useReducedMotion';

// Dynamically import the CinematicCanvas client component with ssr disabled
const CinematicCanvas = dynamic(
  () => import('./CinematicCanvas.client'),
  {
    ssr: false,
    loading: () => <CanvasFallback />,
  }
);

export function DynamicCanvasWrapper() {
  const tier = useDeviceTier();
  const hasWebGL = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    // Queue resolution to let useDeviceTier compute
    const timer = setTimeout(() => {
      setMounted(true);
      setIsResolved(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !isResolved) {
    return <CanvasFallback />;
  }

  // Only eligible Tier A desktop devices execute the dynamic import for the R3F canvas
  if (tier === 'A') {
    return <CinematicCanvas />;
  }

  // Tier B and Tier C render the static fallback wrapped in a diagnostic container.
  // This satisfies E2E tests checking for diagnostics without downloading Three.js/R3F.
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none select-none bg-[#0d0d0d]"
      style={{ zIndex: 0 }}
      data-device-tier={tier}
      data-webgl-supported={hasWebGL ? 'true' : 'false'}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      data-scene-ready="false"
      data-canvas-visible="false"
      data-frameloop-active="false"
    >
      <CanvasFallback />
    </div>
  );
}

export default DynamicCanvasWrapper;
