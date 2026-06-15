# Production Deployment Audit — Veerababu Sutapalli Portfolio

**Audit Date:** 2026-06-15
**Auditor:** Automated engineering pipeline (Step 11)

---

## Production URL

`https://veerababu-sutapalli.vercel.app`

---

## Vercel Configuration

| Setting | Value |
|---|---|
| Deployment method | Vercel Git integration (auto-deploy on push) |
| Production branch | `main` |
| Git remote | `https://github.com/veera491/veerababu-sutapalli-portfolio.git` |
| Required env var | `NEXT_PUBLIC_SITE_URL=https://veerababu-sutapalli.vercel.app` |
| Optional env var | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token>` |
| Optional env var | `NEXT_PUBLIC_BING_SITE_VERIFICATION=<token>` |

---

## Canonical URL

`https://veerababu-sutapalli.vercel.app`

Enforced in:
- `src/lib/metadata.ts` (`metadataBase` and `alternates.canonical`)
- `src/app/robots.ts` (sitemap URL)
- `src/app/sitemap.ts` (homepage URL)
- `src/components/seo/json-ld.tsx` (schema URLs)

---

## Route Inventory

| Route | Type | Description |
|---|---|---|
| `/` | Static | Portfolio homepage |
| `/_not-found` | Static | 404 error page |
| `/robots.txt` | Static | Crawler directives |
| `/sitemap.xml` | Static | Homepage sitemap entry |

---

## Vercel Analytics Integration

| Status | Details |
|---|---|
| Code | ✅ Integrated — `<Analytics />` in `src/app/layout.tsx` |
| Package | `@vercel/analytics` |
| Dashboard | ⚠️ Requires owner to enable Web Analytics in Vercel project settings |
| Event visibility | Cannot confirm without dashboard access — pending activation |

---

## Speed Insights Integration

| Status | Details |
|---|---|
| Code | ✅ Integrated — `<SpeedInsights />` in `src/app/layout.tsx` |
| Package | `@vercel/speed-insights` |
| Dashboard | ⚠️ Requires owner to enable Speed Insights in Vercel project settings |

---

## Security Headers

Applied via `next.config.ts` to all routes (`source: '/(.*)'`):

| Header | Value | Status |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `X-Frame-Options` | `DENY` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | ✅ |
| `Content-Security-Policy` | Not yet added | ⏳ Deferred — requires full script/font/analytics audit |

---

## CI Workflow

| Setting | Value |
|---|---|
| File | `.github/workflows/portfolio-ci.yml` |
| Triggers | Push to `main`, pull requests to `main` |
| Node version | 24 |
| Concurrency | Cancel stale runs |
| Steps | checkout → Node 24 → npm ci → Playwright Chromium → check:full → check:production |
| Secrets required | None (uses synthetic `portfolio.example.test` origin) |
| Deployment | Remains on Vercel Git integration (not triggered from CI) |

---

## Live Playwright Coverage

Suite: `tests/e2e/live-production.spec.ts`
Config: `playwright.live.config.ts`
Script: `npm run test:e2e:live`

Coverage: 30 acceptance criteria including HTTP 200, HTTPS, canonical, og:url, og:image, Twitter meta, H1, JSON-LD, no leakage, robots, sitemap, 404, favicon, Apple touch icon, no failed assets, Axe a11y, mobile overflow, mobile nav, security headers.

Latest result on 2026-06-15: **PASS** — 22/22 Playwright tests passed against `https://veerababu-sutapalli.vercel.app`.

---

## Live Endpoint Verifier

Script: `scripts/verify-live-production.mjs`
Command: `npm run verify:live`
Checks: homepage, HTTPS, canonical, og:url, og:image, robots, sitemap, brand assets, security headers.

Latest result on 2026-06-15 at `2026-06-15T19:04:22.969Z`: **PASS**.

---

## Lighthouse Results

Lighthouse was run against the production URL on 2026-06-15 with Lighthouse `13.4.0` and installed Chrome. Reports are committed under `docs/lighthouse/`.

| Report | Performance | Accessibility | Best Practices | SEO | Agentic Browsing |
|---|---:|---:|---:|---:|---:|
| Mobile default — `docs/lighthouse/production-lighthouse.report.html` / `.json` | 38 | 98 | 96 | 100 | 100 |
| Desktop preset — `docs/lighthouse/production-lighthouse-desktop.report.html` / `.json` | 44 | 98 | 96 | 100 | 100 |

Key mobile metrics:

| Metric | Value |
|---|---:|
| First Contentful Paint | 4.1 s |
| Largest Contentful Paint | 4.5 s |
| Speed Index | 9.5 s |
| Total Blocking Time | 13,050 ms |
| Cumulative Layout Shift | 0 |
| Time to Interactive | 19.5 s |
| Initial server response | 90 ms |
| Total byte weight | 475 KiB |

Key desktop metrics:

| Metric | Value |
|---|---:|
| First Contentful Paint | 1.0 s |
| Largest Contentful Paint | 2.6 s |
| Speed Index | 6.5 s |
| Total Blocking Time | 4,350 ms |
| Cumulative Layout Shift | 0 |
| Time to Interactive | 6.7 s |
| Initial server response | 90 ms |
| Total byte weight | 671 KiB |

Target status:

| Category | Target | Mobile | Desktop | Status |
|---|---:|---:|---:|---|
| Performance | ≥ 85 | 38 | 44 | Missed — follow-up optimization required |
| Accessibility | ≥ 95 | 98 | 98 | Passed |
| Best Practices | ≥ 90 | 96 | 96 | Passed |
| SEO | ≥ 95 | 100 | 100 | Passed |

Performance notes: server response and payload size are healthy, while Lighthouse reports high main-thread work and Total Blocking Time. This should be treated as a dedicated performance-hardening follow-up before adding Lighthouse as a blocking CI gate.

---

## Webmaster Verification Preparation

### Google Search Console
- Property type: URL prefix
- URL: `https://veerababu-sutapalli.vercel.app`
- Verification method: HTML meta tag
- Environment variable: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- Status: ⚠️ Pending — account-side action required

### Bing Webmaster Tools
- URL: `https://veerababu-sutapalli.vercel.app`
- Verification method: `msvalidate.01` meta tag
- Environment variable: `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- Status: ⚠️ Pending — account-side action required

### Sitemap Submission URL
```
https://veerababu-sutapalli.vercel.app/sitemap.xml
```

Submit after verification is confirmed in each webmaster tool.

---

## Icon Builder Portability

**Outcome B:** Generated PNGs are committed to Git. The `build-icons.mjs` script uses macOS-only `sips` and is documented as manual-only. It is not called by any CI, build, or check script.

Committed assets:
- `public/favicon.svg` (SVG source — always editable)
- `public/icon.png` (180×180 PNG)
- `public/apple-touch-icon.png` (180×180 PNG)
- `public/assets/og-image.png` (1200×630 PNG)

---

## Deployment Commit SHA

Primary production feature commit:

`1ed3ef41d870b7eeaac329f72e8831304489685a`

Documentation recovery commit:

`b915f1005816042eedfa0054f15c21f55268fe23`

Pushed to `origin/main` on 2026-06-15.

---

## Limitations Requiring External Actions

1. **Vercel Analytics dashboard** — Owner must enable Web Analytics in project settings
2. **Vercel Speed Insights dashboard** — Owner must enable Speed Insights in project settings
3. **Google Search Console** — Owner must create URL-prefix property and complete HTML tag verification
4. **Bing Webmaster Tools** — Owner must create property and complete meta tag verification
5. **Lighthouse performance remediation** — Performance score is below target; optimize main-thread work/TBT before making Lighthouse blocking
6. **Lighthouse CI** — Not yet integrated as a blocking CI step; defer until performance baseline is stable
7. **CSP** — Deferred; requires auditing all inline scripts, Vercel Analytics, Speed Insights, Google Fonts, and JSON-LD before adding a strict policy

---

## Final Production Status

| Requirement | Status |
|---|---|
| Repository diff reconciled | ✅ |
| No secrets committed | ✅ |
| Test artifacts ignored | ✅ |
| check:full passes | ✅ |
| check:production passes | ✅ |
| Vercel Analytics integration | ✅ (code) |
| Speed Insights integration | ✅ (code) |
| Security headers | ✅ |
| GitHub Actions CI | ✅ |
| Changes committed | ✅ Normal commits only |
| Changes pushed | ✅ Pushed normally to `origin/main` |
| Vercel deploys | ✅ Production URL verified |
| Live homepage 200 | ✅ |
| Live canonical correct | ✅ |
| Live robots correct | ✅ |
| Live sitemap correct | ✅ |
| Live Playwright tests | ✅ 22/22 passed |
| Lighthouse audit | ✅ Completed and documented; performance follow-up required |
