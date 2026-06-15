import fs from 'node:fs';
import path from 'node:path';
import Papa from 'papaparse';

async function main() {
  const isProduction = process.argv.includes('--production');
  console.log(`Starting SEO verification (Mode: ${isProduction ? 'PRODUCTION' : 'LOCAL'})...`);
  let hasErrors = false;
  const warnings = [];

  const checkFileExists = (filePath, description) => {
    const fullPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.error(`[ERROR] Missing ${description}: ${filePath}`);
      hasErrors = true;
      return false;
    }
    const stats = fs.statSync(fullPath);
    if (stats.size === 0) {
      console.error(`[ERROR] Empty file ${description}: ${filePath}`);
      hasErrors = true;
      return false;
    }
    console.log(`  [OK] Found ${description}: ${filePath} (${stats.size} bytes)`);
    return true;
  };

  // 1. Check Brand Assets
  console.log('\n--- Checking brand assets ---');
  checkFileExists('public/favicon.svg', 'Favicon SVG');
  checkFileExists('public/icon.png', 'Browser Icon PNG');
  checkFileExists('public/apple-touch-icon.png', 'Apple Touch Icon PNG');
  checkFileExists('public/assets/og-image.png', 'Open Graph social card');

  // Validate PNG dimensions
  const getPngDimensions = (filePath) => {
    const fullPath = path.resolve(process.cwd(), filePath);
    const buffer = fs.readFileSync(fullPath);
    if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
      throw new Error(`File ${filePath} is not a valid PNG`);
    }
    if (buffer.toString('ascii', 12, 16) !== 'IHDR') {
      throw new Error(`IHDR chunk not found in ${filePath}`);
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  };

  try {
    const ogDims = getPngDimensions('public/assets/og-image.png');
    if (ogDims.width !== 1200 || ogDims.height !== 630) {
      console.error(`[ERROR] OG Image dimensions are invalid: ${ogDims.width}x${ogDims.height}. Expected 1200x630.`);
      hasErrors = true;
    } else {
      console.log(`  [OK] OG Image dimensions are correct: 1200x630`);
    }
  } catch (e) {
    console.error(`[ERROR] Mismatched/corrupt OG Image: ${e.message}`);
    hasErrors = true;
  }

  try {
    const iconDims = getPngDimensions('public/icon.png');
    if (iconDims.width !== 180 || iconDims.height !== 180) {
      console.error(`[ERROR] Browser Icon dimensions are invalid: ${iconDims.width}x${iconDims.height}. Expected 180x180.`);
      hasErrors = true;
    } else {
      console.log(`  [OK] Browser Icon dimensions are correct: 180x180`);
    }
  } catch (e) {
    console.error(`[ERROR] Mismatched/corrupt Browser Icon: ${e.message}`);
    hasErrors = true;
  }

  try {
    const appleDims = getPngDimensions('public/apple-touch-icon.png');
    if (appleDims.width !== 180 || appleDims.height !== 180) {
      console.error(`[ERROR] Apple Touch Icon dimensions are invalid: ${appleDims.width}x${appleDims.height}. Expected 180x180.`);
      hasErrors = true;
    } else {
      console.log(`  [OK] Apple Touch Icon dimensions are correct: 180x180`);
    }
  } catch (e) {
    console.error(`[ERROR] Mismatched/corrupt Apple Touch Icon: ${e.message}`);
    hasErrors = true;
  }

  // Validate favicon SVG security
  const faviconPath = path.resolve(process.cwd(), 'public/favicon.svg');
  if (fs.existsSync(faviconPath)) {
    const favSvg = fs.readFileSync(faviconPath, 'utf8');
    if (/<script/i.test(favSvg)) {
      console.error(`[ERROR] Security risk: Favicon SVG contains <script> tags!`);
      hasErrors = true;
    } else {
      console.log(`  [OK] Favicon SVG is secure (no script tags found)`);
    }
  }

  // 2. Check source endpoints and code configs
  console.log('\n--- Checking source and routing configurations ---');
  checkFileExists('src/app/robots.ts', 'Robots endpoint');
  checkFileExists('src/app/sitemap.ts', 'Sitemap endpoint');
  checkFileExists('src/lib/seo.ts', 'Central SEO configuration');
  checkFileExists('src/lib/metadata.ts', 'Metadata export library');
  checkFileExists('src/lib/site-url.ts', 'Site URL normalizer');
  checkFileExists('src/components/seo/json-ld.tsx', 'JSON-LD schema component');

  // Verify robots does not block /_next/
  const robotsPath = path.resolve(process.cwd(), 'src/app/robots.ts');
  if (fs.existsSync(robotsPath)) {
    const robotsCode = fs.readFileSync(robotsPath, 'utf8');
    if (/_next/i.test(robotsCode) && /disallow/i.test(robotsCode)) {
      console.error(`[ERROR] Robots configuration disallows /_next/ crawler access.`);
      hasErrors = true;
    } else {
      console.log(`  [OK] Robots configuration does not block Next.js static assets`);
    }
  }

  // Verify sitemap only has / route
  const sitemapPath = path.resolve(process.cwd(), 'src/app/sitemap.ts');
  if (fs.existsSync(sitemapPath)) {
    const sitemapCode = fs.readFileSync(sitemapPath, 'utf8');
    if (sitemapCode.includes('/work') || sitemapCode.includes('/project') || sitemapCode.includes('/research')) {
      console.error(`[ERROR] Sitemap contains nonexistent secondary internal project-detail routes.`);
      hasErrors = true;
    } else {
      console.log(`  [OK] Sitemap contains only correct canonical homepage entry`);
    }
  }

  // 3. Check environment configuration and URL validation
  console.log('\n--- Checking URL Resolution validation ---');
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '';

  function cleanAndNormalize(urlStr) {
    if (!urlStr) return null;
    let target = urlStr.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }
    try {
      const parsed = new URL(target);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return null;
      }
      return parsed.origin;
    } catch {
      return null;
    }
  }

  const siteUrl = cleanAndNormalize(rawUrl);

  if (isProduction) {
    if (!siteUrl) {
      console.error(`[ERROR] Production site URL is missing or invalid. Raw URL: "${rawUrl}"`);
      hasErrors = true;
    } else if (siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1')) {
      console.error(`[ERROR] Production site URL cannot resolve to localhost: "${siteUrl}"`);
      hasErrors = true;
    } else if (!siteUrl.startsWith('https://')) {
      console.error(`[ERROR] Production site URL must use secure HTTPS protocol: "${siteUrl}"`);
      hasErrors = true;
    } else {
      console.log(`  [OK] Production canonical URL resolves securely to: "${siteUrl}"`);
    }
  } else {
    console.log(`  [OK] Local resolved site URL is: "${siteUrl || 'http://localhost:3000'}"`);
  }

  // 4. Verify CSV content parameters
  console.log('\n--- Validating CSV content metadata ---');
  const csvPath = path.resolve(process.cwd(), 'content', 'portfolio.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`[ERROR] portfolio.csv not found at ${csvPath}`);
    process.exit(1);
  }

  const csvData = fs.readFileSync(csvPath, 'utf8');
  const parseResult = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: "greedy"
  });

  if (parseResult.errors.length > 0) {
    console.error(`[ERROR] Parsing CSV:`, parseResult.errors);
    process.exit(1);
  }

  const rows = parseResult.data;

  let fullName = '';
  let primaryRole = '';
  let tagline = '';
  let seoTitle = '';
  let seoDescription = '';
  const projects = [];
  const publications = [];

  for (const row of rows) {
    const section = row.section;
    const itemId = row.item_id;
    const field = row.field;
    const value = row.value;
    const enabled = row.enabled === 'true';

    if (!enabled) continue;

    if (section === 'site' && itemId === 'identity') {
      if (field === 'full_name') fullName = value;
      if (field === 'primary_role') primaryRole = value;
      if (field === 'tagline') tagline = value;
    }

    if (section === 'seo' && itemId === 'global') {
      if (field === 'title') seoTitle = value;
      if (field === 'description') seoDescription = value;
    }

    if (section === 'project') {
      let project = projects.find(p => p.itemId === itemId);
      if (!project) {
        project = { itemId, technologies: [] };
        projects.push(project);
      }
      if (field === 'title') project.title = value;
      if (field === 'summary' || field === 'short_description') project.description = value;
      if (field === 'github_url' || field === 'demo_url' || field === 'publication_url') project.link = value;
      if (field === 'technology') project.technologies.push(value);
    }

    if (section === 'publication') {
      let pub = publications.find(p => p.itemId === itemId);
      if (!pub) {
        pub = { itemId, authors: [] };
        publications.push(pub);
      }
      if (field === 'title') pub.title = value;
      if (field === 'summary') pub.summary = value;
      if (field === 'author') pub.authors.push(value);
      if (field === 'publication_url') pub.publicationUrl = value;
    }
  }

  // Identity checks
  if (!fullName) {
    console.error('[ERROR] Full name is missing or disabled in portfolio.csv (site/identity/full_name)');
    hasErrors = true;
  } else {
    console.log(`  [OK] Identity verified: Full Name: "${fullName}"`);
  }
  if (!primaryRole) {
    console.error('[ERROR] Primary role is missing or disabled in portfolio.csv (site/identity/primary_role)');
    hasErrors = true;
  }
  if (!tagline) {
    console.error('[ERROR] Tagline is missing or disabled in portfolio.csv (site/identity/tagline)');
    hasErrors = true;
  }

  // SEO config checks
  if (!seoTitle) {
    console.error('[ERROR] SEO title setting is missing or disabled in portfolio.csv (seo/global/title)');
    hasErrors = true;
  }
  if (!seoDescription) {
    console.error('[ERROR] SEO description setting is missing or disabled in portfolio.csv (seo/global/description)');
    hasErrors = true;
  }

  // Count matches
  if (projects.length !== 8) {
    console.error(`[ERROR] Expected exactly 8 enabled projects from CSV, found ${projects.length}`);
    hasErrors = true;
  } else {
    console.log(`  [OK] Found exactly 8 enabled projects`);
  }

  if (publications.length !== 2) {
    console.error(`[ERROR] Expected exactly 2 enabled publications from CSV, found ${publications.length}`);
    hasErrors = true;
  } else {
    console.log(`  [OK] Found exactly 2 enabled publications`);
  }

  // Wording checks - verify documentation has no peer-reviewed claim about these BTH records
  console.log('\n--- Checking audit documentation truthfulness ---');
  const auditDocPath = path.resolve(process.cwd(), 'docs/seo-audit.md');
  if (fs.existsSync(auditDocPath)) {
    const docText = fs.readFileSync(auditDocPath, 'utf8');
    if (/peer-reviewed/i.test(docText)) {
      console.error(`[ERROR] docs/seo-audit.md contains unverified "peer-reviewed" wording.`);
      hasErrors = true;
    } else {
      console.log(`  [OK] docs/seo-audit.md conforms to truthfulness (no peer-reviewed claims)`);
    }
  }

  console.log(`\n--- Verification Summary ---`);
  if (warnings.length > 0) {
    console.log(`Warnings: ${warnings.length}`);
    warnings.forEach(w => console.log(`  [WARN] ${w}`));
  }

  if (hasErrors) {
    console.log('\nSEO verification failed.');
    process.exit(1);
  }

  console.log('\nSEO verification successful!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
