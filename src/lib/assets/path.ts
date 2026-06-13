import 'server-only';
import path from 'node:path';

export function normalizePublicAssetPath(inputPath: string): string {
  if (!inputPath || inputPath.trim() === '') {
    throw new Error('Asset path cannot be empty');
  }
  
  if (inputPath.includes('..')) {
    throw new Error(`Asset path cannot contain '..': ${inputPath}`);
  }
  
  if (inputPath.startsWith('http://') || inputPath.startsWith('https://') || inputPath.startsWith('mailto:')) {
    throw new Error(`Asset path cannot be an external URL: ${inputPath}`);
  }
  
  const normalized = inputPath.startsWith('/') ? inputPath : `/${inputPath}`;
  
  if (!normalized.startsWith('/assets/')) {
    throw new Error(`Asset path must be within /assets/: ${inputPath}`);
  }
  
  return normalized;
}

export function publicAssetFilePath(inputPath: string): string {
  const normalized = normalizePublicAssetPath(inputPath);
  const relative = normalized.startsWith('/') ? normalized.slice(1) : normalized;
  const resolved = path.resolve(process.cwd(), 'public', relative);
  
  if (!resolved.startsWith(path.resolve(process.cwd(), 'public'))) {
     throw new Error(`Path escape detected: ${inputPath}`);
  }
  
  return resolved;
}
