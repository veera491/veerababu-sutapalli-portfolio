# Step 12 Testing Strategy

## Test Layers

| Area | Tooling | Purpose |
|---|---|---|
| Static validation | Existing content/asset/SEO scripts | Preserve current build gates. |
| Type safety | `npx tsc --noEmit` | Catch client/server boundary typing issues. |
| Linting | `npm run lint` | Catch accessibility and code issues. |
| Playwright local | Existing E2E suite | Responsive, navigation, SEO, Axe regressions. |
| Playwright live | Existing live suite | Production health and crawl checks. |
| 3D prototype Playwright | New Step 13 tests | WebGL/fallback/reduced-motion behavior. |
| Visual regression | Screenshots under `docs/3d-redesign/baseline/` | Compare current vs prototype states. |
| Lighthouse | Existing reports plus new prototype run | Compare performance against Step 12 baseline. |
| Manual GPU/device | Real devices | Validate thermal, frame pacing, touch comfort. |

## Required Step 13 Tests

### WebGL-Supported Desktop

- Lab route loads semantic HTML immediately.
- Canvas becomes visible only after ready.
- No blank canvas before ready.
- Hero H1 and CTAs remain HTML.
- Camera responds to scroll progress.
- Pointer parallax stays subtle.
- Scene pauses when off-screen.

### WebGL-Disabled Fallback

- Simulate disabled WebGL where feasible.
- Fallback content remains fully usable.
- No console crash.
- No empty hero.

### Reduced Motion

- Emulate `prefers-reduced-motion: reduce`.
- Full animated scene does not mount.
- Static fallback/poster appears.
- Native scroll remains normal.

### Mobile Viewport

- 390 by 844 viewport has no horizontal overflow.
- Mobile uses Tier B or Tier C.
- Mobile menu remains accessible.
- No tiny canvas-only controls.

### Tablet And Desktop

- 768 by 1024, 1440 by 900, and 1920 by 1080 screenshots captured.
- Content does not overlap the canvas.
- Section transitions remain understandable.

### Keyboard Navigation

- Header links, CTAs, project links, resume, and contact links remain keyboard accessible.
- No keyboard trap in canvas.
- Focus indicators remain visible.

### Failure And Cleanup

- Scene import failure shows fallback.
- Asset failure shows fallback or omits optional asset.
- Route change/unmount disposes geometry/material/texture resources.
- Hidden tab pauses animation.
- Canvas off-screen pauses animation.

### Lighthouse Comparison

Run Lighthouse on:

- Current production baseline.
- Step 13 lab route or feature-flagged page.

Record:

- Performance.
- Accessibility.
- Best Practices.
- SEO.
- LCP.
- CLS.
- TBT.
- Speed Index.
- Total transfer.
- Main-thread time.
- 3D chunk size.

## Manual QA

Manual checks should include:

- Desktop Chrome/Safari if available.
- Mobile Safari or iOS simulator where possible.
- Android Chrome if available.
- Trackpad and mouse.
- Touch-only navigation.
- Reduced motion enabled at OS level.
- Battery saver/low power mode where available.

## Acceptance For Step 13

Step 13 cannot be considered complete until:

- Prototype is isolated from production homepage.
- No-WebGL and reduced-motion fallbacks pass.
- Playwright screenshots show nonblank canvas or intentional fallback.
- Lighthouse comparison is documented.
- Bundle and asset sizes are documented.
- Current production checks still pass.
