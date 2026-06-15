'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceTier, TIER_CONFIGS, COLOR_PALETTE } from '@/lib/3d/scene-config';

interface IntelligenceCoreProps {
  tier: DeviceTier;
}

export function IntelligenceCore({ tier }: IntelligenceCoreProps) {
  const innerRef = useRef<THREE.Mesh>(null);
  const midRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  const config = TIER_CONFIGS[tier];

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const pulseSpeed = config.pulseSpeed;
    const orbitSpeed = config.orbitSpeed;

    // Pulse the scale of the inner core
    if (innerRef.current) {
      const scale = 1 + Math.sin(elapsed * pulseSpeed * 2) * 0.06;
      innerRef.current.scale.set(scale, scale, scale);
    }

    // Mid lattice rotation
    if (midRef.current) {
      midRef.current.rotation.x = elapsed * orbitSpeed * 0.5;
      midRef.current.rotation.y = elapsed * orbitSpeed;
    }

    // Outer lattice rotation in reverse direction
    if (outerRef.current) {
      outerRef.current.rotation.y = -elapsed * orbitSpeed * 0.3;
      outerRef.current.rotation.z = elapsed * orbitSpeed * 0.2;
    }
  });

  return (
    <group>
      {/* 1. Inner glowing nucleus */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={COLOR_PALETTE.accentOrange} toneMapped={false} />
      </mesh>

      {/* 2. Middle lattice structure (Octahedron) */}
      <mesh ref={midRef}>
        <octahedronGeometry args={[1.0, 1]} />
        <meshBasicMaterial
          color={COLOR_PALETTE.accentOrange}
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* 3. Outer structural wireframe (Icosahedron) */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial
          color={COLOR_PALETTE.accentCyan}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 4. Flat planar orbital ring (Tier A only) */}
      {tier === 'A' && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[2.3, 2.32, 64]} />
          <meshBasicMaterial
            color={COLOR_PALETTE.accentCyan}
            side={THREE.DoubleSide}
            transparent
            opacity={0.15}
          />
        </mesh>
      )}
    </group>
  );
}

export default IntelligenceCore;
