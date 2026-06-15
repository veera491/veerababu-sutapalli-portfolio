import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const viewports = [
  { width: 320, height: 568, name: '320x568' },
  { width: 360, height: 800, name: '360x800' },
  { width: 390, height: 844, name: '390x844' },
  { width: 768, height: 1024, name: '768x1024' },
  { width: 1024, height: 768, name: '1024x768' },
  { width: 1440, height: 900, name: '1440x900' }
];

const screenshotDir = path.join(process.cwd(), 'docs/responsive-evidence');

test.beforeAll(() => {
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
});

test.describe('Responsive Layout Verification', () => {
  for (const vp of viewports) {
    test(`Viewport ${vp.name} layout integrity and overflow check`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Navigate to homepage
      const response = await page.goto('/');
      expect(response?.status()).toBe(200);

      // Wait for font loading or main layout to settle
      await page.waitForTimeout(1000);

      // Assert no horizontal scroll overflow
      const overflowResult = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const hasOverflow = scrollWidth > docWidth;

        const badElements: string[] = [];
        if (hasOverflow) {
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > docWidth) {
              const className = el.className ? `.${Array.from(el.classList).join('.')}` : '';
              badElements.push(`${el.tagName}${className} (width: ${rect.width}px, right: ${rect.right}px, clientWidth: ${docWidth}px)`);
            }
          });
        }
        return { hasOverflow, scrollWidth, docWidth, badElements };
      });

      expect(
        overflowResult.hasOverflow,
        `Page has horizontal scroll overflow at ${vp.name}! scrollWidth: ${overflowResult.scrollWidth}px, clientWidth: ${overflowResult.docWidth}px. Offending elements: \n${overflowResult.badElements.join('\n')}`
      ).toBe(false);

      // Verify page sections
      await expect(page.locator('#home')).toBeVisible();
      await expect(page.locator('#about')).toBeVisible();
      await expect(page.locator('#capabilities')).toBeVisible();
      await expect(page.locator('#work')).toBeVisible();
      await expect(page.locator('#research')).toBeVisible();
      await expect(page.locator('#experience')).toBeVisible();
      await expect(page.locator('#education')).toBeVisible();
      await expect(page.locator('#contact')).toBeVisible();

      // Capture screenshot evidence for specific required viewports
      if (['320x568', '390x844', '768x1024', '1440x900'].includes(vp.name)) {
        const screenshotPath = path.join(screenshotDir, `home-${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Saved screenshot evidence: ${screenshotPath}`);
      }
    });
  }
});
