/**
 * Live Production HTTP Verifier
 * Usage: node scripts/verify-live-production.mjs
 *    or: LIVE_BASE_URL=https://veerababu-sutapalli.vercel.app node scripts/verify-live-production.mjs
 *
 * Fast endpoint-level diagnostics against the deployed site.
 * Does not start any local server.
 */

const BASE_URL = process.env.LIVE_BASE_URL || 'https://veerababu-sutapalli.vercel.app';

let hasErrors = false;
const warnings = [];

function ok(msg) {
  console.log(`  [OK] ${msg}`);
}

function warn(msg) {
  console.warn(`  [WARN] ${msg}`);
  warnings.push(msg);
}

function fail(msg) {
  console.error(`  [FAIL] ${msg}`);
  hasErrors = true;
}

async function fetchUrl(url, description) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'veerababu-portfolio-verifier/1.0' },
    });
    return response;
  } catch (err) {
    fail(`${description}: network error — ${err.message}`);
    return null;
  }
}

async function main() {
  console.log(`\nLive Production Verifier`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Time:   ${new Date().toISOString()}\n`);

  // ── 1. Homepage ──────────────────────────────────────────────────────────
  console.log('--- Homepage ---');
  {
    const res = await fetchUrl(BASE_URL, 'Homepage');
    if (res) {
      if (res.status !== 200) {
        fail(`Homepage returned HTTP ${res.status}`);
      } else {
        ok(`Homepage returned HTTP 200`);
      }

      // HTTPS check
      if (!BASE_URL.startsWith('https://')) {
        fail(`BASE_URL does not use HTTPS: ${BASE_URL}`);
      } else {
        ok(`HTTPS is used`);
      }

      const html = await res.text();

      // Canonical check
      const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
      if (!canonicalMatch) {
        fail('No canonical link tag found in homepage HTML');
      } else {
        const canonical = canonicalMatch[1];
        if (canonical === BASE_URL || canonical === BASE_URL + '/') {
          ok(`Canonical: ${canonical}`);
        } else {
          fail(`Canonical mismatch: found "${canonical}", expected "${BASE_URL}"`);
        }
        if (canonical.includes('localhost')) fail(`Canonical contains localhost: ${canonical}`);
        if (canonical.includes('portfolio.example.test')) fail(`Canonical contains test origin`);
      }

      // og:url check
      const ogUrlMatch = html.match(/<meta[^>]*property="og:url"[^>]*content="([^"]+)"/);
      if (!ogUrlMatch) {
        warn('og:url meta tag not found in homepage HTML');
      } else {
        const ogUrl = ogUrlMatch[1];
        if (ogUrl.includes('localhost') || ogUrl.includes('portfolio.example.test')) {
          fail(`og:url contains leaked origin: ${ogUrl}`);
        } else {
          ok(`og:url: ${ogUrl}`);
        }
      }

      // og:image check
      const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
      if (ogImageMatch) {
        const ogImageUrl = ogImageMatch[1];
        if (ogImageUrl.includes('localhost') || ogImageUrl.includes('portfolio.example.test')) {
          fail(`og:image contains leaked origin: ${ogImageUrl}`);
        } else {
          ok(`og:image URL: ${ogImageUrl}`);
          // Fetch it
          const imgRes = await fetchUrl(ogImageUrl, 'OG image');
          if (imgRes && imgRes.status === 200) {
            ok(`OG image returns HTTP 200`);
          } else if (imgRes) {
            fail(`OG image returned HTTP ${imgRes.status}`);
          }
        }
      } else {
        warn('og:image meta tag not found in homepage HTML');
      }

      // Leakage checks
      if (html.includes('portfolio.example.test')) {
        fail(`"portfolio.example.test" found in homepage HTML — test origin leaked to production`);
      } else {
        ok(`No test-origin leakage (portfolio.example.test)`);
      }
    }
  }

  // ── 2. Robots ────────────────────────────────────────────────────────────
  console.log('\n--- Robots.txt ---');
  {
    const res = await fetchUrl(`${BASE_URL}/robots.txt`, 'robots.txt');
    if (res) {
      if (res.status !== 200) {
        fail(`robots.txt returned HTTP ${res.status}`);
      } else {
        ok(`robots.txt returned HTTP 200`);
      }
      const text = await res.text();
      if (text.toLowerCase().includes('user-agent: *')) {
        ok('robots.txt has user-agent: *');
      } else {
        fail('robots.txt missing user-agent: *');
      }
      const expectedSitemap = `${BASE_URL}/sitemap.xml`;
      if (text.includes(expectedSitemap)) {
        ok(`robots.txt references: ${expectedSitemap}`);
      } else {
        fail(`robots.txt does not reference: ${expectedSitemap}`);
      }
      if (text.includes('Disallow: /_next/')) {
        fail('robots.txt incorrectly blocks /_next/');
      } else {
        ok('robots.txt does not block /_next/');
      }
      if (text.includes('localhost')) {
        fail('robots.txt contains localhost');
      } else {
        ok('No localhost in robots.txt');
      }
    }
  }

  // ── 3. Sitemap ───────────────────────────────────────────────────────────
  console.log('\n--- Sitemap.xml ---');
  {
    const res = await fetchUrl(`${BASE_URL}/sitemap.xml`, 'sitemap.xml');
    if (res) {
      if (res.status !== 200) {
        fail(`sitemap.xml returned HTTP ${res.status}`);
      } else {
        ok(`sitemap.xml returned HTTP 200`);
      }
      const text = await res.text();
      const homepageLoc = `<loc>${BASE_URL}/</loc>`;
      if (text.includes(homepageLoc)) {
        ok(`Sitemap contains homepage: ${homepageLoc}`);
      } else {
        fail(`Sitemap missing: ${homepageLoc}`);
      }
      if (text.includes('localhost')) {
        fail('sitemap.xml contains localhost');
      } else {
        ok('No localhost in sitemap.xml');
      }
    }
  }

  // ── 4. Icons ─────────────────────────────────────────────────────────────
  console.log('\n--- Icons and Brand Assets ---');
  const assets = [
    ['/favicon.svg', 'Favicon SVG'],
    ['/icon.png', 'Browser icon PNG'],
    ['/apple-touch-icon.png', 'Apple touch icon PNG'],
    ['/assets/og-image.png', 'OG image PNG'],
  ];
  for (const [path, name] of assets) {
    const res = await fetchUrl(`${BASE_URL}${path}`, name);
    if (res) {
      if (res.status === 200) {
        ok(`${name}: ${path} → HTTP 200`);
      } else {
        fail(`${name}: ${path} → HTTP ${res.status}`);
      }
    }
  }

  // ── 5. Security headers ───────────────────────────────────────────────────
  console.log('\n--- Security Headers ---');
  {
    const res = await fetchUrl(BASE_URL, 'Homepage headers');
    if (res) {
      const checks = [
        ['x-content-type-options', 'nosniff'],
        ['x-frame-options', 'DENY'],
        ['referrer-policy', 'strict-origin-when-cross-origin'],
      ];
      for (const [header, expected] of checks) {
        const value = res.headers.get(header);
        if (value && value.toLowerCase().includes(expected.toLowerCase())) {
          ok(`${header}: ${value}`);
        } else if (value) {
          warn(`${header}: "${value}" (expected to include "${expected}")`);
        } else {
          fail(`Missing header: ${header}`);
        }
      }
      // Permissions-Policy
      const pp = res.headers.get('permissions-policy');
      if (pp && pp.includes('camera=()')) {
        ok(`permissions-policy: ${pp}`);
      } else if (pp) {
        warn(`permissions-policy: "${pp}" (expected camera=())`);
      } else {
        fail('Missing header: permissions-policy');
      }
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────');
  if (warnings.length > 0) {
    console.log(`Warnings: ${warnings.length}`);
    warnings.forEach((w) => console.warn(`  [WARN] ${w}`));
  }

  if (hasErrors) {
    console.error(`\nLive verification FAILED.\n`);
    process.exit(1);
  }

  console.log(`\nLive verification PASSED.\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
