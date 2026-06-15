'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceTier, SECTION_CAMERA_TRANSFORMS } from '@/lib/3d/scene-config';

interface SceneScrollControllerProps {
  tier: DeviceTier;
}

export function SceneScrollController({ tier }: SceneScrollControllerProps) {
  const { camera } = useThree();
  const scrollPercentRef = useRef<number>(0);
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetRot = useRef<THREE.Euler>(new THREE.Euler());

  // Listen to native window scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollHeight = docHeight - winHeight;

      if (scrollHeight <= 0) {
        scrollPercentRef.current = 0;
        return;
      }

      const pct = window.scrollY / scrollHeight;
      scrollPercentRef.current = Math.min(Math.max(pct, 0), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useFrame((state) => {
    const p = scrollPercentRef.current;

    // Segment calculation (3 segments for 4 sections)
    const segment = Math.min(Math.floor(p * 3), 2); // 0, 1, or 2
    const segmentProgress = (p - segment * 0.3333) / 0.3333; // range [0, 1]

    const startTransform = SECTION_CAMERA_TRANSFORMS[segment];
    const endTransform = SECTION_CAMERA_TRANSFORMS[segment + 1];

    // Lerp coordinates
    const basePosX = THREE.MathUtils.lerp(startTransform.position[0], endTransform.position[0], segmentProgress);
    const basePosY = THREE.MathUtils.lerp(startTransform.position[1], endTransform.position[1], segmentProgress);
    const basePosZ = THREE.MathUtils.lerp(startTransform.position[2], endTransform.position[2], segmentProgress);

    const baseRotX = THREE.MathUtils.lerp(startTransform.rotation[0], endTransform.rotation[0], segmentProgress);
    const baseRotY = THREE.MathUtils.lerp(startTransform.rotation[1], endTransform.rotation[1], segmentProgress);
    const baseRotZ = THREE.MathUtils.lerp(startTransform.rotation[2], endTransform.rotation[2], segmentProgress);

    // Subtle parallax offsets (Tier A desktop only, maximum ~4-6 degrees)
    let parallaxX = 0;
    let parallaxY = 0;

    if (tier === 'A') {
      // state.pointer maps mouse coordinates to range [-1, 1]
      parallaxX = state.pointer.x * 0.45; // camera x offset
      parallaxY = state.pointer.y * 0.35; // camera y offset
    }

    // Combine positioning
    targetPos.current.set(basePosX + parallaxX * 0.5, basePosY + parallaxY * 0.5, basePosZ);

    // Apply parallax to rotation (max ~0.08 radians or 4.5 degrees)
    targetRot.current.set(
      baseRotX - parallaxY * 0.04,
      baseRotY + parallaxX * 0.04,
      baseRotZ,
      'XYZ'
    );

    // Smooth camera ease toward target state
    camera.position.lerp(targetPos.current, 0.08);

    const targetQuat = new THREE.Quaternion().setFromEuler(targetRot.current);
    camera.quaternion.slerp(targetQuat, 0.08);
  });

  return null;
}

export default SceneScrollController;
