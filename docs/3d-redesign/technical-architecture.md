# Step 12 Technical Architecture

## Current Architecture Observations

- Next.js `16.2.9` App Router.
- React `19.2.4`.
- Most components are Server Components.
- Only `src/components/navigation/mobile-navigation.tsx` is currently a Client Component.
- Content is build-time CSV-driven via `content/portfolio.csv`.
- Production is Vercel Git integration on `main`.
- Existing `motion` dependency is present but no current source file imports it.
- Current Lighthouse performance is already low, so 3D must not enter the critical semantic HTML path.

## Installed Next.js Guidance Reviewed

Local installed docs reviewed before writing this architecture:

- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`
- `node_modules/next/dist/docs/01-app/02-guides/production-checklist.md`
- `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`
- `node_modules/next/dist/docs/03-architecture/accessibility.md`

Relevant constraints:

- Server Components are default and should remain the default.
- Client Component boundaries should stay narrow because imports under `"use client"` enter the client bundle.
- Lazy loading applies to Client Components and browser-only libraries.
- `ssr: false` belongs inside Client Components when disabling prerendering for browser-only code.
- Production work should preserve accessibility, font/image optimization, static assets, metadata, and Lighthouse measurement.

## External Package Documentation Checked

- React Three Fiber official docs: `https://r3f.docs.pmnd.rs/getting-started/introduction`
- Three.js official docs: `https://threejs.org/docs/`
- GSAP ScrollTrigger official docs: `https://gsap.com/docs/v3/Plugins/ScrollTrigger/`

Important package note: the React Three Fiber docs state that `@react-three/fiber@9` pairs with React 19. Step 13 must verify exact versions before installation.

## Stack Evaluation

| Technology | Purpose | Bundle/client impact | SSR behavior | Compatibility | Decision |
|---|---|---|---|---|---|
| Three.js | WebGL renderer and geometry core | Essential 3D cost | Browser-only runtime | Standard base for R3F | Essential for Step 13 |
| React Three Fiber | React renderer for Three.js | Adds declarative scene layer | Client-only canvas island | Use v9 for React 19 per official docs | Essential for Step 13 prototype |
| Drei | Helpers for R3F | Can grow bundle if imported broadly | Client-only helpers | Use selective imports only | Optional, avoid in first prototype unless needed |
| GSAP | Animation engine | Additional runtime | Client-only | Works broadly but adds another motion system | Reject for Step 13 |
| GSAP ScrollTrigger | Scroll animation orchestration | Adds scroll abstraction and complexity | Client-only | Powerful but unnecessary initially | Reject for Step 13 |
| Existing `motion` package | HTML micro-interactions | Already installed, currently unused in source | Client components only where used | Can animate HTML if needed | Optional for HTML only, not 3D camera |
| Lenis | Smooth scrolling | Adds scroll hijacking risk | Client-only | Not needed for native anchors | Reject for Step 13 |
| Theatre.js | Timeline authoring | Heavy authoring/runtime concept | Client-only | Useful for complex cinematic timelines | Reject until scene direction is stable |
| Post-processing libraries | Bloom, depth, grain | Expensive GPU/main-thread risk | Client-only | Useful later | Reject for Step 13; optional later behind budget |
| Custom GLSL | Precise visual identity | Low runtime if simple, high complexity | Client-only shader code | Good for later materials | Optional after prototype |
| Compressed GLTF/GLB | Real models | Asset pipeline cost | Loaded client-side | Use only after procedural proof | Optional later |
| Web Workers | Off-main-thread prep | Complexity and bundling concerns | Browser-only | Useful for heavy generation | Optional later |
| OffscreenCanvas | Rendering off main thread | Compatibility/complexity risk | Browser-only | Not required for prototype | Reject for Step 13 |

## Selected Smallest Viable Stack

Step 13 should use:

1. `three`
2. `@react-three/fiber@9`
3. Native scroll plus IntersectionObserver
4. CSS variables and existing Tailwind/CSS for HTML layers
5. Existing Playwright/Lighthouse tooling for validation

Avoid in Step 13:

- GSAP
- ScrollTrigger
- Lenis
- Theatre.js
- Physics engines
- Post-processing
- Large GLB assets
- Audio

## Proposed Directory Structure

```text
src/components/3d/
  canvas/
    CinematicCanvas.client.tsx
    CanvasErrorBoundary.client.tsx
    CanvasFallback.tsx
  scenes/
    NeuralCoreScene.client.tsx
    NeuralCoreSceneLite.client.tsx
  objects/
    IntelligenceCore.client.tsx
    DataNodeField.client.tsx
    ProjectNode.client.tsx
    ResearchPlane.client.tsx
  interactions/
    SceneScrollController.client.tsx
    ScenePointerController.client.tsx
  fallback/
    StaticHeroPoster.tsx
src/hooks/3d/
  useWebGLSupport.ts
  useReducedMotion.ts
  useDeviceTier.ts
  useSectionProgress.ts
src/lib/3d/
  capability.ts
  scene-config.ts
  performance-budget.ts
public/assets/3d/
  posters/
  textures/
  models/
```

## Server And Client Boundaries

| Area | Boundary |
|---|---|
| `src/app/page.tsx` | Remains Server Component. |
| Existing semantic sections | Remain Server Components unless already interactive. |
| 3D canvas shell | Client Component island only. |
| Three/R3F imports | Only inside `*.client.tsx` modules. |
| Scene data | Passed as compact serializable props from Server Components. |
| Fallback content | Server-rendered HTML and static assets. |
| Capability detection | Client hook inside the canvas island. |

## Loading Architecture

- Render semantic hero immediately.
- Render a `StaticHeroPoster` or existing portrait/fallback behind the hero.
- Mount a small client wrapper after hydration.
- Detect reduced motion, WebGL support, viewport, device memory, and coarse pointer.
- Dynamically import the 3D scene only for eligible Tier A/Tier B devices.
- Keep fallback visible until canvas reports ready.
- If scene errors, unmount canvas and retain fallback.

## State Architecture

- No global 3D state store in Step 13.
- Use local React state and refs inside the canvas island.
- Use IntersectionObserver to publish section progress.
- Use requestAnimationFrame only when scene is visible, tab is visible, and motion is allowed.
- Pause when `document.visibilityState === "hidden"`.
- Dispose geometries/materials/textures on unmount.

## Step 13 Lab Boundary

Step 13 should not replace the production homepage. It should create either:

- an isolated lab route such as `/3d-lab`, or
- a feature-flagged component disabled by default on production.

Recommended: `/3d-lab` for prototype work, excluded from navigation and robots if needed.

## Implementation Risks

| Risk | Mitigation |
|---|---|
| Main-thread cost worsens Lighthouse | Lazy-load 3D after semantic content; strict budgets; compare before/after. |
| Canvas becomes content dependency | Keep all text, links, and project data in HTML. |
| Mobile overheats or janks | Simplified Tier B scene and Tier C fallback. |
| React client boundary grows too wide | Keep R3F imports in one client island. |
| Scroll hijacking hurts usability | Use native scroll and section progress only. |
| Asset pipeline bloats repo | Start procedural; add compressed assets later only when needed. |
