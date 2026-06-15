import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as fs from 'fs';
import * as path from 'path';

const screenshotDir = path.join(process.cwd(), 'docs/3d-redesign/step-13-evidence');

test.beforeAll(() => {
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
});

test.describe('3D Lab Prototype E2E Tests', () => {
  let pageErrors: Error[] = [];
  let consoleErrors: string[] = [];

  const setupDesktopTierA = async (page: Page) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'deviceMemory', { value: 8, configurable: true });
      Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
    });
  };

  test.beforeEach(({ page }) => {
    pageErrors = [];
    consoleErrors = [];

    page.on('pageerror', (exception) => {
      pageErrors.push(exception);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('hydration') || (text.includes('React') && !text.includes('Failed to load'))) {
          consoleErrors.push(text);
        }
      }
    });
  });

  test.afterEach(() => {
    expect(pageErrors, `Uncaught page errors occurred:\n${pageErrors.map(e => e.message).join('\n')}`).toEqual([]);
    expect(consoleErrors, `Severe console errors occurred:\n${consoleErrors.join('\n')}`).toEqual([]);
  });

  test('Semantic Route and Metadata Checks', async ({ page }) => {
    const response = await page.goto('/3d-lab');
    expect(response?.status()).toBe(200);

    // Assert H1 requirements
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Robots noindex directives
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
    expect(robots).toContain('nofollow');

    // Make sure index navigation links are absent
    const sitemapContent = fs.existsSync(path.join(process.cwd(), 'public/sitemap.xml'))
      ? fs.readFileSync(path.join(process.cwd(), 'public/sitemap.xml'), 'utf-8')
      : '';
    expect(sitemapContent).not.toContain('/3d-lab');
  });

  test('Eligible Desktop loads Canvas & updates state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await setupDesktopTierA(page);
    await page.goto('/3d-lab');

    // Wait for the custom data-device-tier attribute to trigger (allow up to 25s for dev compilation)
    const canvasContainer = page.locator('div[data-device-tier]');
    await expect(canvasContainer).toBeVisible({ timeout: 25000 });

    // Confirm Tier A or B selection (robust to low-cpu CI/VM environments)
    const deviceTier = await canvasContainer.getAttribute('data-device-tier');
    expect(deviceTier).toBe('A');

    // Wait for scene compile/ready signal
    await expect(canvasContainer).toHaveAttribute('data-scene-ready', 'true', { timeout: 25000 });

    // Capture initial desktop screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'desktop-initial-1440x900.png'), scale: 'css', animations: 'disabled', timeout: 15000 });
  });

  test('Reduced Motion emulated config falls back to Tier C', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/3d-lab');

    const canvasContainer = page.locator('div[data-testid="canvas-fallback"]');
    await expect(canvasContainer).toBeVisible();

    const tierWrapper = page.locator('div[data-device-tier]');
    if (await tierWrapper.count() > 0) {
      await expect(tierWrapper).toHaveAttribute('data-device-tier', 'C');
    }

    // Capture reduced motion view
    await page.screenshot({ path: path.join(screenshotDir, 'reduced-motion-1440x900.png'), scale: 'css', animations: 'disabled', timeout: 15000 });
  });

  test('Mobile view constraints check', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/3d-lab');

    const wrapper = page.locator('div[data-device-tier]');
    await expect(wrapper).toBeVisible();
    
    // Tier B or C is expected on mobile viewport sizes
    const tier = await wrapper.getAttribute('data-device-tier');
    expect(['B', 'C']).toContain(tier);

    // Verify layout scroll width does not exceed client width (0 horizontal scroll)
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);

    // Capture mobile view
    await page.screenshot({ path: path.join(screenshotDir, 'mobile-390x844.png'), scale: 'css', animations: 'disabled', timeout: 15000 });
  });

  test('Network Gating - 3D bundle download verification', async ({ browser }) => {
    // Helper to check if Three.js or R3F bundle is requested/downloaded
    const runNetworkAudit = async (width: number, height: number, reducedMotion: boolean, disable3d: boolean) => {
      const context = await browser.newContext({
        viewport: { width, height },
        reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
      });
      const page = await context.newPage();
      
      if (width === 1440 && !reducedMotion && !disable3d) {
        await page.addInitScript(() => {
          Object.defineProperty(navigator, 'deviceMemory', { value: 8, configurable: true });
          Object.defineProperty(navigator, 'hardwareConcurrency', { value: 8, configurable: true });
        });
      }

      let downloadedThreeJs = false;
      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('/_next/static/chunks/') && url.endsWith('.js')) {
          try {
            const text = await response.text();
            if (text.includes('WebGLRenderer') || text.includes('react-three')) {
              downloadedThreeJs = true;
            }
          } catch {
            // response body might be cached or aborted
          }
        }
      });

      const targetUrl = disable3d ? '/3d-lab?disable-3d=true' : '/3d-lab';
      await page.goto(targetUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500); // allow hydration & tier checks
      
      await context.close();
      return downloadedThreeJs;
    };

    // 1. Desktop Tier A (should download 3D bundle)
    const desktopDownloaded = await runNetworkAudit(1440, 900, false, false);
    expect(desktopDownloaded).toBe(true);

    // 2. Mobile Tier B (should NOT download 3D bundle)
    const mobileDownloaded = await runNetworkAudit(390, 844, false, false);
    expect(mobileDownloaded).toBe(false);

    // 3. Reduced Motion Tier C (should NOT download 3D bundle)
    const reducedMotionDownloaded = await runNetworkAudit(1440, 900, true, false);
    expect(reducedMotionDownloaded).toBe(false);

    // 4. WebGL Disabled Tier C (should NOT download 3D bundle)
    const webglDisabledDownloaded = await runNetworkAudit(1440, 900, false, true);
    expect(webglDisabledDownloaded).toBe(false);
  });

  test('WebGL simulated failures gracefully trigger fallback', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // Run with disable-3d query parameter
    await page.goto('/3d-lab?disable-3d=true');

    // Fallback poster visible
    await expect(page.locator('div[data-testid="canvas-fallback"]')).toBeVisible();

    // Take screenshot evidence
    await page.screenshot({ path: path.join(screenshotDir, 'no-webgl-fallback-1440x900.png'), scale: 'css', animations: 'disabled', timeout: 15000 });
  });

  test('Page visibility changes correctly pauses/resumes loops', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await setupDesktopTierA(page);
    await page.goto('/3d-lab');

    const canvasContainer = page.locator('div[data-device-tier]');
    await expect(canvasContainer).toHaveAttribute('data-scene-ready', 'true', { timeout: 15000 });
    await expect(canvasContainer).toHaveAttribute('data-frameloop-active', 'true');

    // Emulate hidden tab visibilityState
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(canvasContainer).toHaveAttribute('data-frameloop-active', 'false');

    // Restore visible tab
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(canvasContainer).toHaveAttribute('data-frameloop-active', 'true');
  });

  test('Keyboard accessibility checks', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/3d-lab');

    // Press Tab once to focus the logo link in header
    await page.keyboard.press('Tab');
    const logoLink = page.locator('header a[href="/"]').first();
    await expect(logoLink).toBeFocused();
  });

  test('Axe Accessibility Scans on 3D Lab', async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await setupDesktopTierA(page);
    await page.goto('/3d-lab');
    await page.waitForTimeout(1000);

    // axe check on desktop
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const severeViolations = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(severeViolations, `Lab Route Axe Violations:\n${JSON.stringify(severeViolations, null, 2)}`).toEqual([]);
  });

  test('Capture Wide Desktop Screenshot Evidence', async ({ page }) => {
    test.setTimeout(45000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await setupDesktopTierA(page);
    await page.goto('/3d-lab');
    const canvasContainer = page.locator('div[data-device-tier]');
    await expect(canvasContainer).toBeVisible({ timeout: 25000 });
    await expect(canvasContainer).toHaveAttribute('data-scene-ready', 'true', { timeout: 25000 });
    await page.screenshot({ path: path.join(screenshotDir, 'wide-desktop-1920x1080.png'), scale: 'css', animations: 'disabled', timeout: 15000 });
  });

  test('Capture Tablet Screenshot Evidence', async ({ page }) => {
    test.setTimeout(30000);
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/3d-lab');
    await page.screenshot({ path: path.join(screenshotDir, 'tablet-768x1024.png'), scale: 'css', animations: 'disabled', timeout: 15000 });
  });

  test('Capture Desktop Scrolled Screenshot Evidence', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await setupDesktopTierA(page);
    await page.goto('/3d-lab');
    const canvasContainer = page.locator('div[data-device-tier]');
    await expect(canvasContainer).toHaveAttribute('data-scene-ready', 'true', { timeout: 25000 });

    // Scroll to Capabilities
    const capabilities = page.locator('#capabilities');
    await capabilities.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // allow interpolation ease
    await page.screenshot({ path: path.join(screenshotDir, 'desktop-scrolled-capabilities-1440x900.png'), scale: 'css', animations: 'disabled', timeout: 15000 });

    // Scroll to Projects
    const work = page.locator('#work');
    await work.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, 'desktop-scrolled-projects-1440x900.png'), scale: 'css', animations: 'disabled', timeout: 15000 });

    // Scroll to Contact
    const contact = page.locator('#contact');
    await contact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, 'desktop-contact-1440x900.png'), scale: 'css', animations: 'disabled', timeout: 15000 });
  });

  test('Capture Scene Failure Fallback Screenshot Evidence', async ({ browser }) => {
    test.setTimeout(30000);
    const errorContext = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const errorPage = await errorContext.newPage();
    await errorPage.addInitScript(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__SIMULATE_3D_ERROR__ = true;
    });
    await errorPage.goto('/3d-lab');
    await expect(errorPage.locator('div[data-testid="canvas-fallback"]')).toBeVisible();
    await errorPage.screenshot({ path: path.join(screenshotDir, 'scene-failure-fallback-1440x900.png'), scale: 'css', animations: 'disabled', timeout: 15000 });
    await errorPage.close();
    await errorContext.close();
  });
});
