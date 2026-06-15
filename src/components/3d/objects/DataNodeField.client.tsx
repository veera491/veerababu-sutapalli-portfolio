'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceTier, TIER_CONFIGS, COLOR_PALETTE } from '@/lib/3d/scene-config';

interface DataNodeFieldProps {
  tier: DeviceTier;
}

interface NodeData {
  position: THREE.Vector3;
  originalPos: THREE.Vector3;
  speed: number;
  scale: number;
  noiseOffset: number;
}

// Deterministic, pure pseudo-random number generator (LCG) to conform with React 19 render purity rules
function createLcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function DataNodeField({ tier }: DataNodeFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const config = TIER_CONFIGS[tier];
  const nodeCount = config.nodeCount;
  const lineCount = config.lineCount;

  // 1. Generate node coordinates clustered by section
  const nodes = useMemo<NodeData[]>(() => {
    const arr: NodeData[] = [];
    const random = createLcg(491); // seed

    for (let i = 0; i < nodeCount; i++) {
      const sectionIndex = i % 4;
      let x = 0, y = 0, z = 0;

      if (sectionIndex === 0) {
        // Hero: wide dispersion
        x = (random() - 0.5) * 12;
        y = (random() - 0.5) * 8;
        z = (random() - 0.5) * 4 - 1;
      } else if (sectionIndex === 1) {
        // Capabilities: circular ring cluster
        const angle = random() * Math.PI * 2;
        const radius = 2.5 + random() * 2.0;
        x = Math.cos(angle) * radius - 2.0;
        y = Math.sin(angle) * radius + 1.0;
        z = (random() - 0.5) * 2;
      } else if (sectionIndex === 2) {
        // Projects: orbit shells
        const angle = random() * Math.PI * 2;
        const radius = 3.5 + random() * 1.5;
        x = Math.cos(angle) * radius + 1.0;
        y = (random() - 0.5) * 3.0 - 1.0;
        z = Math.sin(angle) * radius;
      } else {
        // Contact: compact spherical lattice
        const u = random();
        const v = random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(random()) * 2.2;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi) - 0.5;
      }

      arr.push({
        position: new THREE.Vector3(x, y, z),
        originalPos: new THREE.Vector3(x, y, z),
        speed: 0.15 + random() * 0.35,
        scale: 0.035 + random() * 0.045,
        noiseOffset: random() * 150,
      });
    }
    return arr;
  }, [nodeCount]);

  // 2. Generate line pairs connecting nearby nodes
  const lineData = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(lineCount * 2 * 3); // 2 points per line, 3 coords per point
    const pairs: { a: number; b: number }[] = [];
    let count = 0;

    for (let i = 0; i < nodes.length && count < lineCount; i++) {
      const nodeA = nodes[i];
      for (let j = i + 1; j < nodes.length && count < lineCount; j++) {
        const nodeB = nodes[j];
        const dist = nodeA.position.distanceTo(nodeB.position);

        if (dist > 0.7 && dist < 1.8) {
          pairs.push({ a: i, b: j });

          positions[count * 6] = nodeA.position.x;
          positions[count * 6 + 1] = nodeA.position.y;
          positions[count * 6 + 2] = nodeA.position.z;

          positions[count * 6 + 3] = nodeB.position.x;
          positions[count * 6 + 4] = nodeB.position.y;
          positions[count * 6 + 5] = nodeB.position.z;

          count++;
        }
      }
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: geom, pairs };
  }, [nodes, lineCount]);

  // Bind initial matrices
  useEffect(() => {
    if (!meshRef.current) return;
    const tempObj = new THREE.Object3D();

    nodes.forEach((node, i) => {
      tempObj.position.copy(node.position);
      tempObj.scale.setScalar(node.scale);
      tempObj.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObj.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  // Animate node updates and redraw lines
  useFrame((state) => {
    const tempObj = new THREE.Object3D();
    const elapsed = state.clock.getElapsedTime();

    if (meshRef.current) {
      nodes.forEach((node, i) => {
        const driftX = Math.sin(elapsed * node.speed + node.noiseOffset) * 0.12;
        const driftY = Math.cos(elapsed * node.speed + node.noiseOffset) * 0.12;
        const driftZ = Math.sin(elapsed * node.speed * 0.6 + node.noiseOffset) * 0.08;

        node.position.copy(node.originalPos).add(new THREE.Vector3(driftX, driftY, driftZ));

        tempObj.position.copy(node.position);
        tempObj.scale.setScalar(node.scale);
        tempObj.updateMatrix();
        meshRef.current!.setMatrixAt(i, tempObj.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (lineRef.current && lineData.pairs.length > 0) {
      const positionAttr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      lineData.pairs.forEach((pair, idx) => {
        const nodeA = nodes[pair.a];
        const nodeB = nodes[pair.b];

        positionAttr.setXYZ(idx * 2, nodeA.position.x, nodeA.position.y, nodeA.position.z);
        positionAttr.setXYZ(idx * 2 + 1, nodeB.position.x, nodeB.position.y, nodeB.position.z);
      });
      positionAttr.needsUpdate = true;
    }
  });

  // Explicit geometry cleanup
  useEffect(() => {
    return () => {
      if (lineData.geometry) {
        lineData.geometry.dispose();
      }
    };
  }, [lineData]);

  return (
    <group>
      {/* Cyan points nodes */}
      <instancedMesh
        ref={meshRef}
        args={[
          null as unknown as THREE.BufferGeometry,
          null as unknown as THREE.Material,
          nodeCount,
        ]}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color={COLOR_PALETTE.accentCyan} transparent opacity={0.6} />
      </instancedMesh>

      {/* Connection segment lines */}
      {lineCount > 0 && lineData.pairs.length > 0 && (
        <lineSegments ref={lineRef} geometry={lineData.geometry}>
          <lineBasicMaterial
            color={COLOR_PALETTE.accentOrange}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}

export default DataNodeField;
