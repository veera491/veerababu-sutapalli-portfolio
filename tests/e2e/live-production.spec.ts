import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Live production test suite.
 * Runs against the real deployed Vercel URL — no local server.
 * Run with: npm run test:e2e:live
 */

const PRODUCTION_ORIGIN = 'https://veerababu-sutapalli.vercel.app';
// If LIVE_BASE_URL is overridden, use its origin for assertions
const liveOrigin =
  process.env.LIVE_BASE_URL
    ? new URL(process.env.LIVE_BASE_URL).origin
    : PRODUCTION_ORIGIN;

test.describe('Live Production — Core Health', () => {
  test('Homepage returns HTTP 200 over HTTPS', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    // Confirm HTTPS
    expect(page.url()).toMatch(/^https:\/\//);
    // No redirect loop (only one navigation)
    expect(page.url()).not.toContain('localhost');
  });

  test('No uncaught page exceptions', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('No React hydration errors in console', async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('hydrat')) {
        hydrationErrors.push(msg.text());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(hydrationErrors).toHaveLength(0);
  });
});

test.describe('Live Production — SEO and Metadata', () => {
  test('Page title is present and correct', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.toUpperCase()).toContain('VEERABABU');
  });

  test('Meta description is present', async ({ page }) => {
    await page.goto('/');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).not.toBeNull();
    expect(desc!.length).toBeGreaterThan(30);
  });

  test('Canonical equals production origin', async ({ page }) => {
    await page.goto('/');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(liveOrigin);
    expect(canonical).not.toContain('localhost');
    expect(canonical).not.toContain('portfolio.example.test');
  });

  test('og:url uses production origin', async ({ page }) => {
    await page.goto('/');
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBe(liveOrigin);
    expect(ogUrl).not.toContain('localhost');
    expect(ogUrl).not.toContain('portfolio.example.test');
  });

  test('og:image uses production origin and returns 200', async ({ page }) => {
    await page.goto('/');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).not.toBeNull();
    expect(ogImage).toContain(liveOrigin);
    expect(ogImage).not.toContain('localhost');

    const imgResponse = await page.request.get(ogImage!);
    expect(imgResponse.status()).toBe(200);
  });

  test('Twitter metadata exists', async ({ page }) => {
    await page.goto('/');
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    expect(twitterTitle).not.toBeNull();
  });

  test('Exactly one H1 exists', async ({ page }) => {
    await page.goto('/');
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text?.toUpperCase()).toContain('VEERA');
  });

  test('JSON-LD parses and contains no localhost or test-origin URLs', async ({ page }) => {
    await page.goto('/');
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeAttached();
    const rawJson = await jsonLd.innerHTML();
    expect(() => JSON.parse(rawJson)).not.toThrow();
    expect(rawJson).not.toContain('localhost');
    expect(rawJson).not.toContain('portfolio.example.test');
  });

  test('No placeholder test origins appear in production HTML', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toContain('portfolio.example.test');
    // Rendered metadata must not contain localhost
    const metaTags = await page.locator('head meta, head link').evaluateAll((els) =>
      els.map((el) => el.outerHTML).join('\n')
    );
    expect(metaTags).not.toContain('localhost');
  });
});

test.describe('Live Production — Crawl Endpoints', () => {
  test('robots.txt returns 200 and references production sitemap', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text?.toLowerCase()).toContain('user-agent: *');
    expect(text).toContain('Allow: /');
    expect(text).not.toContain('Disallow: /_next/');
    expect(text).toContain(`${liveOrigin}/sitemap.xml`);
    expect(text).not.toContain('localhost');
    expect(text).not.toContain('portfolio.example.test');
  });

  test('sitemap.xml returns 200 with correct production homepage URL', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain('<urlset');
    expect(text).toContain(`<loc>${liveOrigin}/</loc>`);
    expect(text).not.toContain('localhost');
    expect(text).not.toContain('portfolio.example.test');
    expect(text).not.toContain('/work');
    expect(text).not.toContain('/project');
  });

  test('404 page behaves correctly', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist-xyz');
    expect(response?.status()).toBe(404);
  });
});

test.describe('Live Production — Assets and Icons', () => {
  test('favicon responds successfully', async ({ page }) => {
    await page.goto('/');
    const favicon = await page.locator('link[rel="icon"]').first().getAttribute('href');
    expect(favicon).not.toBeNull();
    const favResponse = await page.request.get(favicon!);
    expect(favResponse.status()).toBe(200);
  });

  test('Apple touch icon responds successfully', async ({ page }) => {
    await page.goto('/');
    const appleIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    expect(appleIcon).not.toBeNull();
    const appleResponse = await page.request.get(appleIcon!);
    expect(appleResponse.status()).toBe(200);
  });

  test('No failed essential asset requests', async ({ page }) => {
    const failedRequests: string[] = [];
    page.on('requestfailed', (req) => {
      const url = req.url();
      // Only track local assets, not third-party
      if (url.includes(liveOrigin)) {
        failedRequests.push(url);
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(failedRequests).toHaveLength(0);
  });
});

test.describe('Live Production — Accessibility', () => {
  test('No serious or critical Axe issues on live homepage', async ({ page }) => {
    test.setTimeout(180000);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const seriousOrCritical = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    if (seriousOrCritical.length > 0) {
      console.error('Axe violations:', JSON.stringify(seriousOrCritical, null, 2));
    }
    expect(seriousOrCritical).toHaveLength(0);
  });
});

test.describe('Live Production — Responsive', () => {
  test('Mobile layout has no page-level horizontal overflow', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    await context.close();
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px tolerance
  });

  test('Mobile navigation works on production', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('/');
    const menuButton = page.locator('button[aria-label*="menu" i]').first();
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('div[role="dialog"]')).toBeVisible();
    await context.close();
  });
});

test.describe('Live Production — Security Headers', () => {
  test('Security headers are present on homepage', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers() ?? {};
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
  });
});
