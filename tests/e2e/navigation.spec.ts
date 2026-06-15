import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as path from 'path';

const screenshotDir = path.join(process.cwd(), 'docs/responsive-evidence');

test.describe('Navigation and Accessibility verification', () => {
  // Capture page errors, hydration failures, and console errors
  let pageErrors: Error[] = [];
  let consoleErrors: string[] = [];

  test.beforeEach(({ page }) => {
    pageErrors = [];
    consoleErrors = [];

    page.on('pageerror', (exception) => {
      pageErrors.push(exception);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Only capture application-level errors:
        // - React hydration failures
        // - React runtime errors
        // Ignore external third-party resource failures (e.g., Vercel Analytics
        // endpoints unreachable from localhost — this is expected in local mode)
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

  test('Mobile Menu Interaction and Dialog Accessibility Checks', async ({ page }) => {
    // 1. Set viewport to mobile standard
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // 2. Locate mobile menu trigger button
    const trigger = page.locator('button[aria-label*="menu" i]');
    await expect(trigger).toBeVisible();

    // 3. Accessibility checks for trigger name & size
    const label = await trigger.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label?.toLowerCase()).toContain('menu');

    const box = await trigger.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    // 4. Verify initial aria-expanded
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // 5. Open mobile navigation
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // 6. Verify first menu item receives focus automatically
    const menuDialog = page.locator('div[role="dialog"]');
    await expect(menuDialog).toBeVisible();
    const firstLink = menuDialog.locator('a').first();
    await expect(firstLink).toBeFocused();

    // 7. Verify body scroll lock is applied (body overflow is hidden)
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');

    // 8. Capture mobile menu screenshot for evidence
    const menuScreenshotPath = path.join(screenshotDir, 'mobile-menu-390x844.png');
    await page.screenshot({ path: menuScreenshotPath });
    console.log(`Saved screenshot evidence: ${menuScreenshotPath}`);

    // 9. Verify keyboard navigation Escape key closes menu
    await page.keyboard.press('Escape');
    await expect(menuDialog).not.toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // 10. Verify focus is returned to the trigger after closing
    await expect(trigger).toBeFocused();

    // 11. Open again and test that clicking a navigation link closes it
    await trigger.click();
    await expect(menuDialog).toBeVisible();
    await firstLink.click();
    await expect(menuDialog).not.toBeVisible();
  });

  test('Axe Accessibility Scans', async ({ page }) => {
    // Desktop Home Axe Scan
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    let results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    let severeViolations = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(severeViolations, `Desktop Axe Violations Found:\n${JSON.stringify(severeViolations, null, 2)}`).toEqual([]);

    // Mobile Home Axe Scan
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    severeViolations = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(severeViolations, `Mobile Axe Violations Found:\n${JSON.stringify(severeViolations, null, 2)}`).toEqual([]);

    // Mobile Menu Open Axe Scan
    const trigger = page.locator('button[aria-label*="menu" i]');
    await trigger.click();
    await page.waitForSelector('div[role="dialog"]');

    results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    severeViolations = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(severeViolations, `Mobile Menu Open Axe Violations Found:\n${JSON.stringify(severeViolations, null, 2)}`).toEqual([]);
  });

  test('Reduced Motion Configuration Mode', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Smoke check that page still loaded fine
    await expect(page.locator('#home-heading')).toBeVisible();
    await expect(page.locator('#work-heading')).toBeVisible();
  });
});
