'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import CanvasFallback from './CanvasFallback';

// Dynamically import the CinematicCanvas client component with ssr disabled
const CinematicCanvas = dynamic(
  () => import('./CinematicCanvas.client'),
  {
    ssr: false,
    loading: () => <CanvasFallback />,
  }
);

export function DynamicCanvasWrapper() {
  return <CinematicCanvas />;
}

export default DynamicCanvasWrapper;
