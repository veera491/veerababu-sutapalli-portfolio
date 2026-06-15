export interface SectionTransform {
  position: [number, number, number];
  rotation: [number, number, number];
}

export const SECTION_CAMERA_TRANSFORMS: SectionTransform[] = [
  // Hero: Offset right/behind copy
  { position: [2, 0, 7.5], rotation: [0, 0.15, 0] },
  // Capabilities: Camera inside capability rings
  { position: [-1.2, 0.8, 4.5], rotation: [0.08, -0.25, 0.03] },
  // Projects: Camera moves down and orbits the project nodes
  { position: [0.8, -0.8, 5.5], rotation: [-0.15, 0.35, -0.05] },
  // Contact: Calmed final terminal view
  { position: [0, 0, 4.2], rotation: [0, 0, 0] },
];

export const TIER_CONFIGS = {
  A: {
    nodeCount: 350,
    lineCount: 150,
    dpr: 1.5,
    pulseSpeed: 1.5,
    orbitSpeed: 0.12,
  },
  B: {
    nodeCount: 80,
    lineCount: 30,
    dpr: 1.25,
    pulseSpeed: 0.8,
    orbitSpeed: 0.05,
  },
  C: {
    nodeCount: 0,
    lineCount: 0,
    dpr: 1.0,
    pulseSpeed: 0,
    orbitSpeed: 0,
  },
};

export const COLOR_PALETTE = {
  background: '#0d0d0d',
  accentOrange: '#ff6b35',
  accentCyan: '#00f0ff',
  mutedText: '#a3a3a3',
};
export type DeviceTier = 'A' | 'B' | 'C';
