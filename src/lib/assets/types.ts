export interface AssetMetadata {
  path: string;
  exists: boolean;
  sizeBytes: number;
  extension: string;
  isFallback: boolean;
  resolvedPath: string;
}

export type AssetCategory = 'project' | 'publication' | 'diagram' | 'application' | 'education';
