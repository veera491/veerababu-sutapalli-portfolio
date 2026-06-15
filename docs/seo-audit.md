# Production-Ready SEO Audit & Crawl Readiness

This document outlines the SEO architecture, structured metadata configurations, crawl endpoints, and validation results implemented for the Veerababu Sutapalli Cinematic AI Portfolio.

---

## 1. Route Inventory

* `/` (Static) — The primary landing page containing sections for work, research, capabilities, experience, education, and contact.
* `/_not-found` (Static) — Fallback page for non-existent routes.

There are no dynamic/internal project-detail routes, conforming strictly to the single-page application model.

---

## 2. Canonical URL Strategy

We resolve the base canonical domain using the helper [src/lib/site-url.ts](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/src/lib/site-url.ts):
* It dynamically reads the `NEXT_PUBLIC_SITE_URL` environment variable.
* It parses and normalizes it (ensuring trailing slashes are removed and validating format structure).
* In local development or fallback scenarios, it safely defaults to `http://localhost:3000`.

This base URL is used to build canonical links (`alternates.canonical`) and absolute link entries inside `sitemap.xml` and `robots.txt`.

---

## 3. Implemented Metadata

Metadata uses the modern Next.js Metadata API. Configuration is centered under [src/lib/metadata.ts](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/src/lib/metadata.ts) and resolves details dynamically from the portfolio content database.

### SEO Core Config
* **Title**: `VEERABABU SUTAPALLI | Machine Learning & GenAI Engineer`
* **Description**: `Machine Learning and GenAI engineer building reliable AI systems, LLM applications and data-driven products.`
* **Keywords**: `AI Engineer, Machine Learning Engineer, GenAI Engineer, LLM Application Development, RAG Systems, Python Developer, PyTorch, MLOps, Data Infrastructure, Distributed Systems, Software Engineer`
* **Language**: `en-US`

### Open Graph (OG)
* **Title**: `VEERABABU SUTAPALLI | Machine Learning & GenAI Engineer`
* **Description**: `Machine Learning and GenAI engineer building reliable AI systems, LLM applications and data-driven products.`
* **Type**: `website`
* **URL**: `/` (Canonical base URL)
* **Site Name**: `VEERABABU SUTAPALLI | Machine Learning & GenAI Engineer`
* **Images**: `/assets/og-image.png` (1200 × 630px, optimized, cinematic-matching dark charcoal with orange highlights)

### Twitter Cards
* **Card Style**: `summary_large_image`
* **Title**: `VEERABABU SUTAPALLI | Machine Learning & GenAI Engineer`
* **Description**: `Machine Learning and GenAI engineer building reliable AI systems, LLM applications and data-driven products.`
* **Images**: `/assets/og-image.png`

---

## 4. Brand Icons & Assets

All icon assets are stored under `public/` and are fully validated for format structure:
* **Favicon SVG**: [public/favicon.svg](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/public/favicon.svg) — A clean transparent monogram of initials "VS" designed with circuit node theme.
* **Apple Touch Icon**: [public/apple-touch-icon.png](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/public/apple-touch-icon.png) (180 × 180px PNG) — High-contrast branded vector monogram.
* **Browser Icon**: [public/icon.png](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/public/icon.png) (180 × 180px PNG) — Standard high-resolution launcher icon.

---

## 5. Crawler Readiness & Routing

### Robots Configuration (`/robots.txt`)
Generated dynamically by [src/app/robots.ts](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/src/app/robots.ts):
```text
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Sitemap: <canonical-site-url>/sitemap.xml
```

### Sitemap Configuration (`/sitemap.xml`)
Generated dynamically by [src/app/sitemap.ts](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/src/app/sitemap.ts):
* Exposes `/` as the primary canonical route.
* Sets priority to `1.0` and change frequency to `monthly`.

---

## 6. Structured JSON-LD Data

Rendered dynamically using a React Server Component [src/components/seo/json-ld.tsx](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/src/components/seo/json-ld.tsx) and injected inside the layout body wrapper. All schemas are nested in a single `@graph` representation using stable `@id` attributes for connectivity.

### Schemas Implemented:
1. **Person**:
   * Name: `VEERABABU SUTAPALLI`
   * Job Title: `Machine Learning & GenAI Engineer`
   * Description: `Building reliable AI systems from data and models to intelligent applications.`
   * Alumni Of: `Blekinge Institute of Technology`, `Jawaharlal Nehru Technological University Kakinada`
   * Knows About: List of keywords and core technologies.
   * Profiles (`sameAs`): LinkedIn, GitHub.

2. **WebSite**:
   * Name: `VEERABABU SUTAPALLI | Machine Learning & GenAI Engineer`
   * Description: Primary site summary.
   * Publisher/Author: Referencing Person via `@id`.

3. **ItemList (Projects)**:
   * Maps all 8 enabled projects from the CSV repository with title, summary, technology tags, and respective GitHub/publication link references.

4. **Report (Publications)**:
   * Maps 2 academic research publications (collaborative BLOOMZ inference & life insurance risk prediction comparative study).
   * Correctly attributes authors, publisher (`Blekinge Institute of Technology`), and URLs, linking back to the primary Person node.

---

## 7. Quality & Regression Tests

### Automated Check Script (`npm run verify:seo`)
Located at [scripts/verify-seo.mjs](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/scripts/verify-seo.mjs). It performs static build-time validation:
* Confirms all visual assets exist under `/public`.
* Checks configuration files are present.
* Asserts key parameters in `content/portfolio.csv` are enabled and filled.

### Playwright E2E Tests (`npm run test:e2e`)
Located at [tests/e2e/seo.spec.ts](file:///Users/veera/Documents/veerababu-sutapalli-portfolio/tests/e2e/seo.spec.ts). It tests the compiled output:
* Verifies page title, meta description, and canonical link attributes.
* Inspects and parses the JSON-LD payload to ensure valid schema structure and fields alignment.
* Confirms robots.txt and sitemap.xml respond with `200 OK` and contain correct entries.
* Asserts that exactly one `h1` exists on the homepage.
