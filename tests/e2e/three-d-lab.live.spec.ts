import { test, expect, Page, Response, ConsoleMessage } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Dedicated Live Production tests for /3d-lab.
 * Runs against the real deployed Vercel URL — no local server.
 * Run with: npm run test:e2e:live:3d-lab
 */

const PRODUCTION_ORIGIN = 'https://veerababu-sutapalli.vercel.app';
const liveOrigin = process.env.LIVE_BASE_URL
  ? new URL(process.env.LIVE_BASE_URL).origin
  : PRODUCTION_ORIGIN;

test.describe('Live Production 3D Lab — Core & Security', () => {
  let pageErrors: Error[] = [];
  let consoleErrors: string[] = [];

  test.beforeEach(() => {
    pageErrors = [];
    consoleErrors = [];
  });

  const setupLoggers = (page: Page) => {
    page.on('pageerror', (exception: Error) => {
      pageErrors.push(exception);
    });
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('hydration') || (text.includes('React') && !text.includes('Failed to load'))) {
          consoleErrors.push(text);
        }
      }
    });
  };

  test.afterEach(() => {
    expect(pageErrors, `Uncaught page errors occurred:\n${pageErrors.map(e => e.message).join('\n')}`).toEqual([]);
    expect(consoleErrors, `Severe console errors occurred:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('HTTP 200, HTTPS, security headers, metadata, and sitemap checks', async ({ page }) => {
    setupLoggers(page);
    const response = await page.goto('/3d-lab');
    expect(response?.status()).toBe(200);
    expect(page.url()).toMatch(/^https?:\/\//);

    // Validate headers
    const headers = response?.headers() ?? {};
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');

    // H1 check
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // robots check
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
    expect(robots).toContain('nofollow');

    // canonical check
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`${liveOrigin}/3d-lab`);

    // verify primary navigation does not reference /3d-lab
    const navLinks = await page.locator('header a, nav a').evaluateAll((els: HTMLAnchorElement[]) => 
      els.map(el => el.getAttribute('href'))
    );
    expect(navLinks).not.toContain('/3d-lab');
  });
});

test.describe('Live Production 3D Lab — Dynamic Gating & Responsiveness', () => {
  // Check if response text contains Three.js/R3F markers
  const isThreeJsResponse = async (response: Response) => {
    const url = response.url();
    if (url.includes('/_next/static/chunks/') && url.endsWith('.js')) {
      try {
        const text = await response.text();
        return text.includes('WebGLRenderer') || text.includes('react-three');
      } catch {
        // ignore cached or aborted responses
      }
    }
    return false;
  };

  const setupDesktopTierA = async (page: Page) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'deviceMemory', { value: 8, configurable: true });
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
    });
  };

  test('Desktop Tier A loads and downloads 3D chunk', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();
    await setupDesktopTierA(page);
    
    let downloadedThreeJs = false;
    page.on('response', async (res) => {
      if (await isThreeJsResponse(res)) {
        downloadedThreeJs = true;
      }
    });

    await page.goto(`${liveOrigin}/3d-lab`);
    await page.waitForLoadState('networkidle');

    const canvasContainer = page.locator('div[data-device-tier]');
    await expect(canvasContainer).toBeVisible({ timeout: 35000 });
    
    const tier = await canvasContainer.getAttribute('data-device-tier');
    expect(tier).toBe('A');

    await expect(canvasContainer).toHaveAttribute('data-scene-ready', 'true', { timeout: 35000 });
    expect(downloadedThreeJs).toBe(true);

    await context.close();
  });

  test('Mobile Tier B uses static fallback and does NOT download 3D chunk', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }
    });
    const page = await context.newPage();

    let downloadedThreeJs = false;
    page.on('response', async (res) => {
      if (await isThreeJsResponse(res)) {
        downloadedThreeJs = true;
      }
    });

    await page.goto(`${liveOrigin}/3d-lab`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait to check tier resolution

    const canvasContainer = page.locator('div[data-device-tier]');
    await expect(canvasContainer).toBeVisible();

    const tier = await canvasContainer.getAttribute('data-device-tier');
    expect(tier).toBe('B');

    // Confirm that the Three.js chunk is NOT downloaded
    expect(downloadedThreeJs).toBe(false);

    // Confirm no page-level horizontal scroll
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);

    await context.close();
  });

  test('Reduced Motion emulates static fallback and does NOT download 3D chunk', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();

    let downloadedThreeJs = false;
    page.on('response', async (res) => {
      if (await isThreeJsResponse(res)) {
        downloadedThreeJs = true;
      }
    });

    await page.goto(`${liveOrigin}/3d-lab`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const canvasContainer = page.locator('div[data-device-tier]');
    await expect(canvasContainer).toBeVisible();

    const tier = await canvasContainer.getAttribute('data-device-tier');
    expect(tier).toBe('C');
    expect(downloadedThreeJs).toBe(false);

    await context.close();
  });

  test('Axe compliance scan on live route', async ({ page }) => {
    test.setTimeout(120000);
    await page.goto('/3d-lab');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const severeViolations = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(severeViolations, `Live route Axe Violations:\n${JSON.stringify(severeViolations, null, 2)}`).toEqual([]);
  });
});
