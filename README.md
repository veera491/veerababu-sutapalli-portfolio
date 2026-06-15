# Veerababu Sutapalli Portfolio

A cinematic AI/ML portfolio built with Next.js App Router, driven by CSV content, and deployed to Vercel.

**Live site:** [https://veerababu-sutapalli.vercel.app](https://veerababu-sutapalli.vercel.app)

---

## Local Setup

```bash
git clone https://github.com/veera491/veerababu-sutapalli-portfolio.git
cd veerababu-sutapalli-portfolio
npm ci
cp .env.example .env.local   # Edit NEXT_PUBLIC_SITE_URL for local use
npm run dev                   # http://localhost:3000
```

---

## Verification Commands

```bash
# Full local check — validate content, assets, SEO, lint, build, E2E tests
npm run check:full

# Production-style check — uses portfolio.example.test origin, rebuilds, runs E2E
npm run check:production

# Live production verification — checks real deployed site (no local server needed)
npm run verify:live
npm run test:e2e:live

# Individual checks
npm run verify:project-assets   # Confirm all 8 project covers exist
npm run verify:seo               # Static SEO validation (local mode)
npm run lint                     # ESLint
npx tsc --noEmit                 # TypeScript
npm run build                    # Production build
npm run test:e2e                 # Playwright local E2E suite
```

---

## Deployment

Deployment is fully automated via Vercel Git integration:
- Push to `main` → Vercel triggers a production deployment automatically
- No manual `vercel` CLI commands are needed

**Required Vercel environment variable:**

```env
NEXT_PUBLIC_SITE_URL=https://veerababu-sutapalli.vercel.app
```

Set this in: Vercel Project Settings → Environment Variables → Production.

**Optional webmaster verification (set only after obtaining tokens):**

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<your-token>
NEXT_PUBLIC_BING_SITE_VERIFICATION=<your-token>
```

---

## Regenerating Brand Icons (macOS only)

The PNG assets (icon.png, apple-touch-icon.png, og-image.png) are pre-committed.
To regenerate after SVG design changes, run on macOS only:

```bash
npm run build:icons   # Requires macOS sips — never use in CI
```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Content:** CSV-driven via `content/portfolio.csv`
- **Styling:** Tailwind CSS v4, CSS custom properties
- **Testing:** Playwright, Axe
- **Analytics:** Vercel Analytics + Speed Insights
- **Deployment:** Vercel (Git integration)
