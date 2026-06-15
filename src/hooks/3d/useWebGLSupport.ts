'use client';

import { useState } from 'react';

export function useWebGLSupport(): boolean {
  const [supported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!(window.WebGLRenderingContext && gl);
    } catch {
      return false;
    }
  });

  return supported;
}
