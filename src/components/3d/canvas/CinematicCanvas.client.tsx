'use client';

import React, { useRef, useState, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { useDeviceTier } from '@/hooks/3d/useDeviceTier';
import { useWebGLSupport } from '@/hooks/3d/useWebGLSupport';
import { useReducedMotion } from '@/hooks/3d/useReducedMotion';
import { usePageVisibility } from '@/hooks/3d/usePageVisibility';
import { useElementVisibility } from '@/hooks/3d/useElementVisibility';
import { CanvasFallback } from './CanvasFallback';
import { CanvasErrorBoundary } from './CanvasErrorBoundary.client';

// Lazy-load the R3F Scene component
const NeuralCoreScene = lazy(() => import('../scenes/NeuralCoreScene.client'));

export function CinematicCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tier = useDeviceTier();
  const hasWebGL = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();
  const isPageVisible = usePageVisibility();
  const isElementVisible = useElementVisibility(containerRef);
  const [isReady, setIsReady] = useState(false);

  // Switch to static fallback instantly for Tier C
  if (tier === 'C') {
    return <CanvasFallback />;
  }

  const isLoopActive = isPageVisible && isElementVisible;
  const frameloop = isLoopActive ? 'always' : 'never';

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none bg-[#0d0d0d]"
      style={{ zIndex: 0 }}
      data-device-tier={tier}
      data-webgl-supported={hasWebGL ? 'true' : 'false'}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      data-scene-ready={isReady ? 'true' : 'false'}
      data-canvas-visible={isElementVisible ? 'true' : 'false'}
      data-frameloop-active={isLoopActive ? 'true' : 'false'}
    >
      {/* Render Fallback SVG while the 3D scene compiles/loads */}
      {!isReady && <CanvasFallback />}

      <CanvasErrorBoundary>
        <Suspense fallback={null}>
          <Canvas
            shadows={false}
            gl={{
              antialias: tier === 'A',
              powerPreference: 'high-performance',
              alpha: true,
              depth: true,
              stencil: false,
            }}
            dpr={tier === 'A' ? 1.5 : 1.25}
            frameloop={frameloop}
            camera={{ position: [0, 0, 8], fov: 60 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: isReady ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
            }}
          >
            <NeuralCoreScene
              tier={tier}
              onReady={() => setIsReady(true)}
            />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  );
}

export default CinematicCanvas;
