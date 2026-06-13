import 'server-only';
import { parseCsv } from '../csv/parser';
import { ASSET_FIELDS } from './constants';
import { assetExists, getAssetMetadata } from './manifest';
import { normalizePublicAssetPath } from './path';

export interface AssetValidationReport {
  totalReferences: number;
  uniqueReferences: number;
  existingFiles: number;
  missingRequiredFiles: number;
  missingOptionalFiles: number;
  invalidPaths: number;
  fallbackAssets: number;
  oversizedAssets: number;
  warnings: string[];
  errors: string[];
}

export async function validateAssets(): Promise<AssetValidationReport> {
  const { content } = await parseCsv();
  const report: AssetValidationReport = {
    totalReferences: 0,
    uniqueReferences: 0,
    existingFiles: 0,
    missingRequiredFiles: 0,
    missingOptionalFiles: 0,
    invalidPaths: 0,
    fallbackAssets: 0,
    oversizedAssets: 0,
    warnings: [],
    errors: [],
  };

  const assetPaths = new Set<{path: string, required: boolean, section: string, itemId: string, field: string}>();

  let cinematicEnabled = false;
  const heroSettings = content['hero']?.find(i => i.itemId === 'settings');
  if (heroSettings) {
    cinematicEnabled = heroSettings.fields['cinematic_enabled'] === 'true';
  }

  let resumeCtaEnabled = false;
  const resumeCta = content['hero_cta']?.find(i => i.itemId === 'resume');
  if (resumeCta && resumeCta.enabled) {
    resumeCtaEnabled = true;
  }

  for (const [section, items] of Object.entries(content)) {
    for (const item of items) {
      if (!item.enabled) continue;

      for (const [field, value] of Object.entries(item.fields)) {
        if (!ASSET_FIELDS.includes(field)) continue;

        const processValue = (val: string) => {
          if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('mailto:')) return;
          if (val.startsWith('REPLACE_WITH_')) return;
          if (field === 'pdf_url' && !val.startsWith('/')) return;

          if (field === 'frame_path' && !cinematicEnabled) return;

          report.totalReferences++;
          
          try {
            // handle templates like frame_{index}.webp gracefully if we ever enable cinematic
            // For now, if we pass it to normalize it should work, but exists() will fail. 
            // It's optional when cinematic is false (we ignore it above).
            
            const normalized = normalizePublicAssetPath(val);
            
            let isRequired = false;
            if (section === 'hero' && item.itemId === 'settings' && field === 'static_image' && !cinematicEnabled) isRequired = true;
            if (section === 'hero' && item.itemId === 'settings' && field === 'mobile_image') isRequired = true;
            if (section === 'site' && item.itemId === 'identity' && field === 'resume_path' && resumeCtaEnabled) isRequired = true;
            if (field === 'favicon_path') isRequired = true;

            assetPaths.add({path: normalized, required: isRequired, section, itemId: item.itemId, field});
          } catch {
            report.invalidPaths++;
            report.errors.push(`Invalid asset path in ${section}/${item.itemId}/${field}: ${val}`);
          }
        };

        if (Array.isArray(value)) {
          value.forEach(processValue);
        } else {
          processValue(value as string);
        }
      }
    }
  }

  const uniquePaths = new Set(Array.from(assetPaths).map(a => a.path));
  report.uniqueReferences = uniquePaths.size;

  for (const asset of assetPaths) {
    const exists = assetExists(asset.path);
    if (!exists) {
      if (asset.required) {
        report.missingRequiredFiles++;
        report.errors.push(`Missing required asset: ${asset.path} (referenced in ${asset.section}/${asset.itemId}/${asset.field})`);
      } else {
        // avoid double counting missing optional files per reference if already counted
        report.warnings.push(`Missing optional asset: ${asset.path} (referenced in ${asset.section}/${asset.itemId}/${asset.field})`);
      }
    }
  }

  for (const path of uniquePaths) {
    if (assetExists(path)) {
      report.existingFiles++;
      const meta = getAssetMetadata(path);
      
      const kb = meta.sizeBytes / 1024;
      const mb = kb / 1024;
      
      if (path.includes('portrait') && kb > 700) {
         report.oversizedAssets++;
         report.warnings.push(`Oversized portrait image: ${path} (${kb.toFixed(2)} KB)`);
      } else if (path.includes('project') && mb > 1) {
         report.oversizedAssets++;
         report.warnings.push(`Oversized project image: ${path} (${mb.toFixed(2)} MB)`);
      } else if (meta.extension === '.svg' && kb > 250) {
         report.oversizedAssets++;
         report.warnings.push(`Oversized SVG: ${path} (${kb.toFixed(2)} KB)`);
      } else if (meta.extension === '.pdf' && mb > 5) {
         report.oversizedAssets++;
         report.warnings.push(`Oversized PDF: ${path} (${mb.toFixed(2)} MB)`);
      }
    } else {
      report.fallbackAssets++;
      // It's a fallback since it doesn't exist
    }
  }
  
  // Calculate missing counts correctly per reference or per unique file?
  // Let's count missing Required/Optional based on references as pushed to errors/warnings above.
  report.missingOptionalFiles = report.warnings.filter(w => w.startsWith('Missing optional')).length;

  return report;
}
