# Step 13 Build Specification

## Step 13 Objective

Build an isolated prototype for the selected **Neural Intelligence Core** concept without replacing the production homepage.

## Prototype Boundary

Preferred route:

```text
/3d-lab
```

Constraints:

- Do not add the route to primary navigation.
- Do not replace the production homepage.
- Do not change production project content.
- Do not make the canvas the only source of information.
- Keep the prototype removable if performance fails.

## Required User-Facing Prototype

The lab route should show:

- Existing header/navigation.
- A semantic HTML hero with the same H1/role/tagline/CTA content.
- A lazy-loaded 3D Neural Intelligence Core behind or beside the HTML hero.
- A fallback poster/current 2D treatment while loading.
- A reduced-motion fallback.
- A no-WebGL fallback.
- A short scroll area with 3-4 section markers: Hero, Capabilities, Projects, Contact.
- Scroll-linked camera movement through the core.
- Pointer parallax on desktop.
- Simplified or static mobile presentation.

## Scene Requirements

| Object | Requirement |
|---|---|
| Core | Procedural lattice or processor-like core, no external model required. |
| Nodes | Instanced data nodes grouped by section. |
| Lines | Low-opacity connections, capped count. |
| Lighting | Ambient plus emissive material; no shadow casting. |
| Materials | Simple standard/basic materials; no post-processing initially. |
| Camera | Perspective camera with controlled section positions. |
| Animation | Low-amplitude pulse/drift only when visible. |
| Interaction | Pointer parallax and card-to-node highlight only. |

## Package Plan

Before installing, verify exact versions compatible with React 19 and Next.js 16.

Likely packages:

```text
three
@react-three/fiber@9
```

Do not install in Step 13 unless the implementation begins. Step 12 did not install packages.

Avoid for Step 13:

```text
@react-three/drei
gsap
lenis
theatre
postprocessing
physics engines
```

`@react-three/drei` may be added later only for a specific helper with measured bundle impact.

## Component Plan

```text
src/app/3d-lab/page.tsx
src/components/3d/canvas/CinematicCanvas.client.tsx
src/components/3d/canvas/CanvasFallback.tsx
src/components/3d/canvas/CanvasErrorBoundary.client.tsx
src/components/3d/scenes/NeuralCoreScene.client.tsx
src/components/3d/objects/IntelligenceCore.client.tsx
src/components/3d/objects/DataNodeField.client.tsx
src/components/3d/interactions/SceneScrollController.client.tsx
src/hooks/3d/useWebGLSupport.ts
src/hooks/3d/useReducedMotion.ts
src/hooks/3d/useDeviceTier.ts
src/lib/3d/scene-config.ts
```

## Acceptance Criteria

### Experience

- Initial HTML content visible before canvas readiness.
- Canvas is nonblank on eligible desktop.
- Mobile does not require precise 3D interaction.
- Reduced-motion mode disables camera animation.
- WebGL failure shows fallback.
- No custom cursor.
- Native scroll and anchor behavior preserved.

### Accessibility

- One H1.
- Logical heading order.
- Keyboard navigation through all HTML controls.
- Canvas is decorative unless matched by HTML controls.
- Axe serious/critical violations remain zero.

### Performance

- 3D code lazy-loads outside the critical path.
- Step 13 records lazy 3D chunk size.
- No uncompressed large model assets.
- No post-processing.
- No shadows.
- No autoplay video textures.
- No continuous animation when tab hidden or canvas off-screen.
- LCP regression <= 100 ms on production-style build.
- CLS remains 0.
- TBT regression <= 150 ms desktop and <= 100 ms mobile target.

### Testing

Run at minimum:

```bash
npm run lint
npx tsc --noEmit
npm run verify:project-assets
npm run verify:seo
npm run test:e2e
```

Add targeted Playwright tests for:

- `/3d-lab` desktop canvas nonblank.
- `/3d-lab` reduced motion fallback.
- `/3d-lab` mobile fallback/simplified tier.
- `/3d-lab` no horizontal overflow.
- `/3d-lab` keyboard navigation.

### Documentation

Step 13 must update:

- `docs/3d-redesign/step-13-prototype-results.md`
- `docs/next-chat-handoff.md`
- `docs/walkthrough.md`

The results doc must include screenshots, bundle sizes, Lighthouse comparison, failures, and next recommendations.

## Step 13 Stop Conditions

Stop and document instead of forcing implementation if:

- React 19 compatible R3F versions cannot be installed cleanly.
- Prototype cannot preserve fallback content.
- 3D chunk exceeds budget by more than 25 percent.
- Canvas causes persistent horizontal overflow.
- TBT regression is severe.
- Accessibility regressions cannot be fixed within the prototype scope.
