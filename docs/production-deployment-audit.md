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

---

## Live Endpoint Verifier

Script: `scripts/verify-live-production.mjs`
Command: `npm run verify:live`
Checks: homepage, HTTPS, canonical, og:url, og:image, robots, sitemap, brand assets, security headers.

---

## Lighthouse Results

> **Status:** Pending — Lighthouse audit will be run after the first successful Vercel deployment.
>
> Minimum targets:
> | Category | Target |
> |---|---|
> | Performance | ≥ 85 |
> | Accessibility | ≥ 95 |
> | Best Practices | ≥ 90 |
> | SEO | ≥ 95 |

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

`1ed3ef41d870b7eeaac329f72e8831304489685a`

Pushed to `origin/main` on 2026-06-15.

---

## Limitations Requiring External Actions

1. **Vercel Analytics dashboard** — Owner must enable Web Analytics in project settings
2. **Vercel Speed Insights dashboard** — Owner must enable Speed Insights in project settings
3. **Google Search Console** — Owner must create URL-prefix property and complete HTML tag verification
4. **Bing Webmaster Tools** — Owner must create property and complete meta tag verification
5. **Lighthouse CI** — Not yet integrated as a blocking CI step; can be added as Step 12 work
6. **CSP** — Deferred; requires auditing all inline scripts, Vercel Analytics, Speed Insights, Google Fonts, and JSON-LD before adding a strict policy

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
| Changes committed | ✅ (pending push) |
| Changes pushed | Pending |
| Vercel deploys | Pending |
| Live homepage 200 | Pending live verification |
| Live canonical correct | Pending live verification |
| Live robots correct | Pending live verification |
| Live sitemap correct | Pending live verification |
| Live Playwright tests | Pending live verification |
| Lighthouse audit | Pending |
