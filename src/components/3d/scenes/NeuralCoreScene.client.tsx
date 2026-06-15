'use client';

import React, { useEffect } from 'react';
import { DeviceTier } from '@/lib/3d/scene-config';
import { IntelligenceCore } from '../objects/IntelligenceCore.client';
import { DataNodeField } from '../objects/DataNodeField.client';
import { SceneScrollController } from '../interactions/SceneScrollController.client';

interface NeuralCoreSceneProps {
  tier: DeviceTier;
  onReady: () => void;
}

export function NeuralCoreScene({ tier, onReady }: NeuralCoreSceneProps) {
  useEffect(() => {
    // Fast callback signaling component completion
    const timer = setTimeout(() => {
      onReady();
    }, 50);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <>
      {/* Restrained lighting without expensive shadow calculations */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -3, 2]} intensity={0.8} color="#00f0ff" />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#ff6b35" distance={5} />

      {/* Procedural AI Core Component */}
      <IntelligenceCore tier={tier} />

      {/* Instanced Data Points Field Component */}
      <DataNodeField tier={tier} />

      {/* Camera Scroll Coordinator & Pointer Parallax */}
      <SceneScrollController tier={tier} />
    </>
  );
}

export default NeuralCoreScene;
