import fs from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';

async function main() {
  const csvPath = path.resolve(process.cwd(), 'content', 'portfolio.csv');
  console.log(`Reading CSV from ${csvPath}...`);

  if (!fs.existsSync(csvPath)) {
    console.error(`Error: portfolio.csv not found at ${csvPath}`);
    process.exit(1);
  }

  const csvData = fs.readFileSync(csvPath, 'utf8');

  const parseResult = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: "greedy"
  });

  if (parseResult.errors.length > 0) {
    console.error(`Error parsing CSV:`, parseResult.errors);
    process.exit(1);
  }

  const rows = parseResult.data;

  // Group rows by section and item_id
  const itemsMap = new Map();
  for (const row of rows) {
    const section = row.section;
    const itemId = row.item_id;
    const enabled = row.enabled === 'true';

    if (section !== 'project') continue;
    if (!enabled) continue;

    const key = `${section}:::${itemId}`;
    if (!itemsMap.has(key)) {
      itemsMap.set(key, { itemId, fields: {} });
    }
    const item = itemsMap.get(key);
    item.fields[row.field] = row.value;
  }

  let hasErrors = false;
  const verifiedFiles = [];
  const missingFiles = [];
  const warnings = [];
  const folderSlugMismatches = [];
  const seenPaths = new Set();

  console.log(`\nValidating project cover assets...\n`);

  for (const item of itemsMap.values()) {
    const title = item.fields.title || item.itemId;
    const slug = item.fields.slug;
    const coverImage = item.fields.cover_image;

    if (!slug) {
      console.warn(`[WARNING] Project '${item.itemId}' is missing a slug.`);
      warnings.push(`Project '${item.itemId}' is missing a slug.`);
      continue;
    }

    if (!coverImage) {
      console.error(`[ERROR] Project '${title}' (slug: ${slug}) is missing a 'cover_image' path in portfolio.csv.`);
      missingFiles.push(`Project '${title}' is missing 'cover_image' field.`);
      hasErrors = true;
      continue;
    }

    // Check path normalization
    if (!coverImage.startsWith('/assets/projects/')) {
      console.error(`[ERROR] Project '${title}' cover path is not normalized: '${coverImage}'. Expected path to start with '/assets/projects/'.`);
      hasErrors = true;
      continue;
    }

    // Check duplicate references
    if (seenPaths.has(coverImage)) {
      console.warn(`[WARNING] Duplicate cover image path referenced: '${coverImage}'`);
      warnings.push(`Duplicate cover path: '${coverImage}'`);
    } else {
      seenPaths.add(coverImage);
    }

    // Check folder name / slug mismatches
    // Path format: /assets/projects/<project-slug>/cover.(webp|svg)
    const expectedPrefix = `/assets/projects/${slug}/`;
    if (!coverImage.startsWith(expectedPrefix)) {
      console.warn(`[WARNING] Slug mismatch: Project slug is '${slug}', but cover path is '${coverImage}'. Expected path to start with '${expectedPrefix}'.`);
      folderSlugMismatches.push(`Slug mismatch: '${slug}' vs '${coverImage}'`);
    }

    // Resolve file system path
    const relativePath = coverImage.startsWith('/') ? coverImage.slice(1) : coverImage;
    const fsPath = path.resolve(process.cwd(), 'public', relativePath);

    if (!fs.existsSync(fsPath)) {
      console.error(`[ERROR] File does not exist: '${coverImage}' (resolved to ${fsPath})`);
      missingFiles.push(coverImage);
      hasErrors = true;
    } else {
      const stats = fs.statSync(fsPath);
      const kb = stats.size / 1024;
      verifiedFiles.push(`${coverImage} (${kb.toFixed(1)} KB)`);

      // Warn if cover image is oversized (> 500KB for WebP, > 250KB for SVG)
      if (coverImage.endsWith('.svg') && kb > 250) {
        console.warn(`[WARNING] Oversized SVG: '${coverImage}' is ${kb.toFixed(1)} KB (recommended max 250 KB)`);
        warnings.push(`Oversized SVG: '${coverImage}' (${kb.toFixed(1)} KB)`);
      } else if (kb > 1024) {
        console.warn(`[WARNING] Oversized WebP: '${coverImage}' is ${(kb/1024).toFixed(1)} MB (recommended max 1 MB)`);
        warnings.push(`Oversized image: '${coverImage}' (${(kb/1024).toFixed(1)} MB)`);
      }
    }
  }

  console.log(`\n--- Verification Summary ---`);
  console.log(`Verified Assets: ${verifiedFiles.length}`);
  verifiedFiles.forEach(f => console.log(`  [OK] ${f}`));

  if (warnings.length > 0) {
    console.log(`\nWarnings: ${warnings.length}`);
    warnings.forEach(w => console.log(`  [WARN] ${w}`));
  }

  if (hasErrors) {
    console.log(`\nErrors: ${missingFiles.length + folderSlugMismatches.length}`);
    missingFiles.forEach(m => console.log(`  [ERR] Missing or invalid: ${m}`));
    console.log(`\nAsset verification failed.`);
    process.exit(1);
  }

  console.log(`\nAsset verification successful!`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
