# Step 12 Performance Budget

## Existing Lighthouse Baseline

Reports:

- `docs/lighthouse/production-lighthouse.report.json`
- `docs/lighthouse/production-lighthouse-desktop.report.json`

| Baseline | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | Speed Index | Main-thread | JS execution | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile default | 38 | 98 | 96 | 100 | 4.5 s | 0 | 13,050 ms | 9.5 s | 23.5 s | 11.3 s | 475 KiB |
| Desktop preset | 44 | 98 | 96 | 100 | 2.6 s | 0 | 4,350 ms | 6.5 s | 8.7 s | 2.3 s | 671 KiB |

## Diagnosed Contributors

| Area | Evidence | Step 12 interpretation |
|---|---|---|
| Server response | 90 ms root document | Server latency is not the problem. |
| Payload size | 475 KiB mobile, 671 KiB desktop | Total transfer is not enormous, but added 3D must be tightly capped. |
| Main-thread work | 23.5 s mobile, 8.7 s desktop | Primary performance risk before adding WebGL. |
| Total Blocking Time | 13,050 ms mobile, 4,350 ms desktop | Must be reduced or at least not worsened by 3D. |
| JavaScript execution | 11.3 s mobile, 2.3 s desktop | 3D code cannot load in the critical path. |
| Unused JavaScript | Estimated 28 KiB savings | Current unused JS is modest; large new libraries would dominate. |
| Third-party scripts | Vercel analytics and speed insights present | Keep, but document dashboard dependence and watch script cost. |
| Layout shifts | CLS 0 | Preserve stable dimensions and no canvas-induced layout shift. |
| Images | Total payload healthy; project images committed | 3D should not introduce large uncompressed assets. |
| Fonts | Next font self-hosted | Preserve current font path. |

## Step 13 Initial Budgets

| Budget item | Tier A desktop | Tier B mobile/tablet | Tier C fallback |
|---|---:|---:|---:|
| Initial 3D JS in critical path | 0 KiB | 0 KiB | 0 KiB |
| Lazy 3D JS added | <= 180 KiB gzip target | <= 100 KiB gzip target | 0 KiB |
| Total compressed 3D assets | <= 250 KiB | <= 120 KiB | <= 80 KiB poster |
| Individual model size | <= 100 KiB compressed | Avoid models | None |
| Texture dimensions | <= 1024 px | <= 512 px | Static poster only |
| Texture memory | <= 24 MB | <= 8 MB | 0 MB WebGL |
| Visible triangle count | <= 60k | <= 15k | 0 |
| Draw calls | <= 80 | <= 35 | 0 |
| Dynamic lights | <= 3 | <= 1 | 0 |
| Shadow-casting lights | 0 in Step 13 | 0 | 0 |
| Particles/nodes | <= 600 instanced | <= 120 instanced | 0 |
| Device pixel ratio | min(device, 1.5) | min(device, 1.25) | n/a |
| Post-processing passes | 0 in Step 13 | 0 | 0 |
| Frame target | 55-60 fps | 30-45 fps | n/a |
| Long tasks from 3D | 0 tasks > 100 ms | 0 tasks > 100 ms | 0 |
| LCP regression | <= +100 ms | <= +100 ms | No regression |
| CLS regression | 0.00 allowed | 0.00 allowed | 0.00 |
| TBT regression | <= +150 ms | <= +100 ms | No regression |

## Runtime Rules

- No 3D JavaScript in the initial semantic HTML path.
- Lazy-load 3D after essential hero content is visible.
- Retain visible HTML hero before canvas readiness.
- Cap mobile DPR.
- Prefer procedural geometry.
- Prefer instanced meshes for nodes and particles.
- No autoplay video textures.
- No large uncompressed GLB files.
- No continuous animation when off-screen.
- Pause animation when the tab is hidden.
- No physics engine.
- No blanket post-processing pipeline.
- Preserve zero-layout-shift composition.

## Step 13 Pass/Fail Gates

Step 13 prototype passes only if:

- The production homepage remains unchanged or feature-flagged off.
- No-WebGL fallback renders usable content.
- Reduced-motion fallback renders without camera movement.
- Mobile uses the simplified Tier B or Tier C path.
- The semantic H1 and project content remain in HTML.
- No horizontal overflow appears at 390, 768, 1440, and 1920 widths.
- Prototype Lighthouse comparison is documented against this baseline.
- 3D lazy chunk and asset sizes are measured.
- No new unbounded animation loop runs when canvas is hidden.
- No generated test artifacts are committed.

## Step 14-16 Escalation Gates

| Phase | Gate |
|---|---|
| Step 14 | Add project-node interaction only if Step 13 TBT regression stays within budget. |
| Step 15 | Add richer materials or post-processing only if desktop FPS and Lighthouse remain acceptable. |
| Step 16 | Consider Lighthouse CI only after performance baseline is improved and stable. |
