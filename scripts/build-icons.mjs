/**
 * build-icons.mjs — LOCAL / MANUAL UTILITY ONLY
 *
 * ⚠️  macOS-only: uses the `sips` command-line tool (bundled with macOS).
 * ⚠️  NOT safe for CI, GitHub Actions, or Vercel deployment (Linux).
 * ⚠️  NEVER call this from: npm run build, npm run check, or any CI script.
 *
 * Purpose:
 *   Regenerates brand PNG assets from embedded SVG source when the SVG
 *   design changes. The generated PNGs are committed to Git so that CI
 *   and Vercel build use the pre-built artifacts without needing sips.
 *
 * Usage (macOS only):
 *   npm run build:icons
 *
 * Committed output assets:
 *   public/favicon.svg           (source — always committed)
 *   public/icon.png              (generated — committed)
 *   public/apple-touch-icon.png  (generated — committed)
 *   public/assets/og-image.png   (generated — committed)
 *
 * Portability outcome: B — generated PNGs are committed; script is manual-only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ogImageSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#0d0d0d"/>
  <style>
    .title { font-family: system-ui, -apple-system, sans-serif; font-weight: 800; font-size: 64px; fill: #f5f5f5; }
    .subtitle { font-family: system-ui, -apple-system, sans-serif; font-weight: 600; font-size: 32px; fill: #ff6b35; letter-spacing: 2px; }
    .footer-text { font-family: system-ui, -apple-system, sans-serif; font-weight: 400; font-size: 20px; fill: #a3a3a3; letter-spacing: 1px; }
    .line-grid { stroke: #171717; stroke-width: 2; }
    .line-accent { stroke: #ff6b35; stroke-width: 3; stroke-linecap: round; opacity: 0.2; }
    .logo-bg { fill: #171717; stroke: #ff6b35; stroke-width: 2; }
  </style>

  <!-- Grid Background -->
  <line x1="0" y1="105" x2="1200" y2="105" class="line-grid"/>
  <line x1="0" y1="210" x2="1200" y2="210" class="line-grid"/>
  <line x1="0" y1="315" x2="1200" y2="315" class="line-grid"/>
  <line x1="0" y1="420" x2="1200" y2="420" class="line-grid"/>
  <line x1="0" y1="525" x2="1200" y2="525" class="line-grid"/>

  <line x1="200" y1="0" x2="200" y2="630" class="line-grid"/>
  <line x1="400" y1="0" x2="400" y2="630" class="line-grid"/>
  <line x1="600" y1="0" x2="600" y2="630" class="line-grid"/>
  <line x1="800" y1="0" x2="800" y2="630" class="line-grid"/>
  <line x1="1000" y1="0" x2="1000" y2="630" class="line-grid"/>

  <!-- Circuit overlay lines -->
  <path d="M 200 210 L 400 210 L 500 315 L 800 315 L 900 420 L 1000 420" fill="none" class="line-accent"/>
  <circle cx="200" cy="210" r="6" fill="#ff6b35"/>
  <circle cx="1000" cy="420" r="6" fill="#ff6b35"/>

  <!-- Monogram Logo badge -->
  <g transform="translate(100, 265)">
    <rect width="100" height="100" rx="12" class="logo-bg"/>
    <!-- Initials VS nodes path inside the box -->
    <path d="M 30 35 L 50 75 L 70 35" fill="none" stroke="#ff6b35" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 68 40 L 52 35 A 8 8 0 0 0 36 43 A 8 8 0 0 0 48 51 A 8 8 0 0 1 60 59 A 8 8 0 0 1 44 67 L 32 64" fill="none" stroke="#f5f5f5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="30" cy="35" r="5" fill="#ff6b35" />
    <circle cx="70" cy="35" r="5" fill="#ff6b35" />
    <circle cx="50" cy="75" r="6" fill="#ff6b35" />
  </g>

  <!-- Text Content -->
  <text x="250" y="315" class="title">VEERABABU SUTAPALLI</text>
  <text x="250" y="375" class="subtitle">AI / ML / GenAI Engineer</text>
  <text x="250" y="440" class="footer-text">Portfolio · Machine Learning Systems · Distributed Deep Learning</text>
</svg>
`;

const appleTouchIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="100%" height="100%" fill="#0d0d0d"/>
  <!-- Stylized circuit nodes forming a V and S shape scaled for 180x180 -->
  <g transform="translate(18, 18) scale(4.5)">
    <!-- Subtle back grid lines -->
    <line x1="4" y1="16" x2="28" y2="16" stroke="#1f1f1f" stroke-width="1.5" stroke-linecap="round" />
    <line x1="16" y1="4" x2="16" y2="28" stroke="#1f1f1f" stroke-width="1.5" stroke-linecap="round" />

    <!-- V Shape: Nodes at (6,8) -> (16,26) -> (26,8) -->
    <path d="M 6 8 L 16 26 L 26 8" fill="none" stroke="#ff6b35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8" />
    <!-- S Shape overlaid: (26,10) -> (16,10) -> (10,16) -> (22,20) -> (6,24) -->
    <path d="M 24 12 L 18 10 A 4 4 0 0 0 10 14 A 4 4 0 0 0 16 18 A 4 4 0 0 1 22 22 A 4 4 0 0 1 14 26 L 8 24" fill="none" stroke="#f5f5f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Accent Nodes -->
    <circle cx="6" cy="8" r="2.5" fill="#ff6b35" />
    <circle cx="26" cy="8" r="2.5" fill="#ff6b35" />
    <circle cx="16" cy="26" r="3" fill="#ff6b35" />
  </g>
</svg>
`;

async function main() {
  console.log('Compiling brand icons and Open Graph assets...');

  const tmpOgSvg = path.resolve(process.cwd(), 'public', 'tmp-og.svg');
  const tmpAppleSvg = path.resolve(process.cwd(), 'public', 'tmp-apple.svg');

  fs.writeFileSync(tmpOgSvg, ogImageSvg.trim());
  fs.writeFileSync(tmpAppleSvg, appleTouchIconSvg.trim());

  try {
    // Compile og-image.png
    console.log('Rendering public/assets/og-image.png (1200x630)...');
    execSync('sips -s format png --resampleHeightWidth 630 1200 public/tmp-og.svg --out public/assets/og-image.png');

    // Compile apple-touch-icon.png
    console.log('Rendering public/apple-touch-icon.png (180x180)...');
    execSync('sips -s format png --resampleHeightWidth 180 180 public/tmp-apple.svg --out public/apple-touch-icon.png');

    // Compile icon.png (transparent monogram)
    console.log('Rendering public/icon.png (180x180)...');
    execSync('sips -s format png --resampleHeightWidth 180 180 public/favicon.svg --out public/icon.png');

    console.log('Verification check on generated images:');
    const checkOutput = execSync('sips -g pixelWidth -g pixelHeight -g format public/assets/og-image.png public/icon.png public/apple-touch-icon.png', { encoding: 'utf8' });
    console.log(checkOutput);

    console.log('All visual assets generated successfully!');
  } catch (error) {
    console.error('Failed compiling visual assets:', error);
    process.exit(1);
  } finally {
    if (fs.existsSync(tmpOgSvg)) fs.unlinkSync(tmpOgSvg);
    if (fs.existsSync(tmpAppleSvg)) fs.unlinkSync(tmpAppleSvg);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
