import 'server-only';
import fs from 'node:fs';
import { publicAssetFilePath, normalizePublicAssetPath } from './path';
import { ASSET_FALLBACKS } from './constants';
import { AssetMetadata, AssetCategory } from './types';

export function assetExists(pathStr: string): boolean {
  try {
    const fsPath = publicAssetFilePath(pathStr);
    return fs.existsSync(fsPath);
  } catch {
    return false;
  }
}

export function getAssetMetadata(pathStr: string): AssetMetadata {
  const normalized = normalizePublicAssetPath(pathStr);
  const fsPath = publicAssetFilePath(pathStr);
  const exists = fs.existsSync(fsPath);
  let sizeBytes = 0;

  if (exists) {
    const stats = fs.statSync(fsPath);
    sizeBytes = stats.size;
  }

  const ext = fsPath.substring(fsPath.lastIndexOf('.')).toLowerCase();

  return {
    path: normalized,
    exists,
    sizeBytes,
    extension: ext,
    isFallback: false,
    resolvedPath: fsPath
  };
}

export function getAssetOrFallback(pathStr: string, category: AssetCategory): string {
  if (assetExists(pathStr)) {
    return normalizePublicAssetPath(pathStr);
  }
  return ASSET_FALLBACKS[category];
}
