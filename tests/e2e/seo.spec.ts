import { test, expect } from '@playwright/test';

interface BaseNode {
  '@type': string;
  '@id'?: string;
}

interface PersonNode extends BaseNode {
  '@type': 'Person';
  name: string;
  jobTitle: string;
  alumniOf: unknown[];
  knowsAbout: string[];
}

interface WebSiteNode extends BaseNode {
  '@type': 'WebSite';
  name: string;
}

interface ItemListNode extends BaseNode {
  '@type': 'ItemList';
  name: string;
  itemListElement: unknown[];
}

interface ReportNode extends BaseNode {
  '@type': 'Report';
  headline: string;
  description: string;
  url: string;
  author: unknown[];
}

type GraphNode = PersonNode | WebSiteNode | ItemListNode | ReportNode | BaseNode;

interface GraphStructure {
  '@context': string;
  '@graph': GraphNode[];
}

test.describe('SEO, Metadata, and Crawl Readiness Verification', () => {
  const targetOrigin = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : 'http://localhost:3000';

  test('Page Title, Meta Description, and Canonical link', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Title tag
    const title = await page.title();
    expect(title).toContain('VEERABABU SUTAPALLI');
    expect(title.length).toBeGreaterThan(10);

    // Meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).not.toBeNull();
    expect(description?.length).toBeGreaterThan(30);

    // Canonical link tag
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).not.toBeNull();
    expect(canonical).toBe(targetOrigin);

    // Verify localhost is not present in metadata when test production URL is supplied
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      expect(canonical).not.toContain('localhost');
      expect(canonical).not.toContain('127.0.0.1');
    }
  });

  test('Open Graph and Twitter Metadata', async ({ page }) => {
    await page.goto('/');

    // OG Title & Description
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('VEERABABU SUTAPALLI');

    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).not.toBeNull();

    // OG Type and URL
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('website');

    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBe(targetOrigin);

    // OG Image (Next.js automatically prefixes with base URL origin)
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBe(`${targetOrigin}/assets/og-image.png`);

    // Twitter properties
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');

    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');
    expect(twitterTitle).toContain('VEERABABU SUTAPALLI');

    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    expect(twitterImage).toBe(`${targetOrigin}/assets/og-image.png`);

    // Host checks in production-like tests
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      expect(ogUrl).not.toContain('localhost');
      expect(ogImage).not.toContain('localhost');
      expect(twitterImage).not.toContain('localhost');
    }
  });

  test('Semantic Structure - H1 tag requirement', async ({ page }) => {
    await page.goto('/');

    // Validate that exactly one h1 exists on the homepage
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    const h1Text = await page.locator('h1').textContent();
    expect(h1Text?.toUpperCase()).toContain('VEERA');
  });

  test('JSON-LD Structured Data Parsing and Validation', async ({ page }) => {
    await page.goto('/');

    // Find the application/ld+json script tag
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toBeAttached();

    const rawJson = await jsonLdScript.innerHTML();
    expect(rawJson).not.toBeNull();

    // Parse JSON-LD structure
    let graphData: GraphStructure | null = null;
    expect(() => {
      graphData = JSON.parse(rawJson) as GraphStructure;
    }).not.toThrow();

    expect(graphData).not.toBeNull();
    expect(graphData).toHaveProperty('@context', 'https://schema.org');
    expect(graphData).toHaveProperty('@graph');
    expect(Array.isArray(graphData?.['@graph'])).toBe(true);

    const graph = graphData!['@graph'];

    // Verify duplicate @id values in graph
    const ids = graph.map(node => node['@id']).filter(Boolean);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);

    // Verify Person schema
    const person = graph.find((node): node is PersonNode => node['@type'] === 'Person');
    expect(person).toBeDefined();
    expect(person?.name).toBe('VEERABABU SUTAPALLI');
    expect(person?.jobTitle).toContain('Engineer');
    expect(person?.alumniOf).toHaveLength(2);
    expect(person?.knowsAbout).toContain('Machine Learning Engineer');

    // Verify WebSite schema
    const website = graph.find((node): node is WebSiteNode => node['@type'] === 'WebSite');
    expect(website).toBeDefined();
    expect(website?.name).toContain('VEERABABU SUTAPALLI');

    // Verify Project ItemList schema
    const itemlist = graph.find((node): node is ItemListNode => node['@type'] === 'ItemList');
    expect(itemlist).toBeDefined();
    expect(itemlist?.name).toBe('Selected Projects');
    expect(itemlist?.itemListElement.length).toBe(8);

    // Verify Report schema (for student theses/research reports)
    const reports = graph.filter((node): node is ReportNode => node['@type'] === 'Report');
    expect(reports.length).toBe(2);
    reports.forEach((rep) => {
      expect(rep.headline).toBeDefined();
      expect(rep.description).toBeDefined();
      expect(rep.url).toBeDefined();
      expect(rep.author).toBeDefined();
    });

    // Check no peer-reviewed wording is in parsed JSON-LD
    expect(rawJson).not.toContain('peer-reviewed');
  });

  test('Robots.txt Crawl Endpoint allowance', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);

    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('text/plain');

    const text = await response?.text();
    expect(text?.toLowerCase()).toContain('user-agent: *');
    expect(text).toContain('Allow: /');

    // Explicitly assertrobots does NOT block /_next/ static assets
    expect(text).not.toContain('Disallow: /_next/');
    expect(text).not.toContain('Disallow: /api/');

    expect(text?.toLowerCase()).toContain('sitemap.xml');
    expect(text).toContain(`${targetOrigin}/sitemap.xml`);
  });

  test('Sitemap.xml Crawl Endpoint', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);

    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('xml');

    const text = await response?.text();
    expect(text).toContain('<urlset');
    expect(text).toContain('<loc>');
    expect(text).toContain('</urlset>');

    // Sitemap should only contain the homepage URL and no nonexistent case studies paths
    expect(text).toContain(`<loc>${targetOrigin}/</loc>`);
    expect(text).not.toContain('/work');
    expect(text).not.toContain('/project');
    expect(text).not.toContain('/research');
  });

  test('Favicons and Icon availability and response success', async ({ page }) => {
    await page.goto('/');

    const favicon = await page.locator('link[rel="icon"]').first().getAttribute('href');
    expect(favicon).not.toBeNull();

    const favResponse = await page.request.get(favicon!);
    expect(favResponse.status()).toBe(200);

    const appleIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    expect(appleIcon).toBe('/apple-touch-icon.png');

    const appleResponse = await page.request.get(appleIcon!);
    expect(appleResponse.status()).toBe(200);
  });

  test('Truthfulness check - No peer-reviewed claims on home content', async ({ page }) => {
    await page.goto('/');

    // Scrape all text content on the page
    const pageText = await page.locator('body').textContent();
    expect(pageText?.toLowerCase()).not.toContain('peer-reviewed');
  });
});
