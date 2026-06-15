# Step 12 Accessibility And Fallbacks

## Accessibility Principle

The WebGL canvas is decorative unless an interaction has an equivalent HTML control and semantic content. The current 2D site is the accessible source of truth.

## Required Semantic Guarantees

- Exactly one semantic H1 remains.
- Heading order remains logical.
- Header navigation remains keyboard accessible.
- Project, research, experience, education, and contact content remain HTML.
- Focus-visible styling remains clear.
- Native cursor remains available.
- No keyboard trap inside canvas.
- No forced scroll hijacking.
- Touch targets stay at least 44 by 44 px.
- Color contrast must remain at least WCAG AA.
- Skip navigation should be considered before replacing the home layout.

## Canvas Accessibility

| Canvas role | Requirement |
|---|---|
| Decorative scene | `aria-hidden="true"` or equivalent wrapper treatment. |
| Interactive node | Must have matching HTML card/control. |
| Project selection | Focusing a project card can highlight the 3D node, but canvas focus is optional. |
| Labels | Use HTML labels/cards, not canvas text as the only label. |
| Keyboard | Keyboard users must complete every journey without canvas interaction. |
| Screen readers | Screen readers receive semantic page content, not a noisy list of decorative objects. |

## Three Experience Tiers

### Tier A - Full Cinematic Desktop

Eligible devices:

- Desktop viewport.
- WebGL available.
- No reduced-motion preference.
- No low-power/battery-saving signal where detectable.
- Adequate device memory/hardware concurrency if available.

Features:

- Full 3D hero core.
- Scroll-linked camera.
- Pointer parallax.
- Project node highlights.
- Sparse particles.
- No heavy post-processing in Step 13.

### Tier B - Optimized Mobile/Tablet

Eligible devices:

- Mobile or tablet viewport.
- WebGL available.
- No reduced-motion preference.

Features:

- Simplified geometry.
- Fewer particles.
- Lower DPR cap.
- Shorter camera path.
- Touch-safe interactions.
- HTML cards remain primary.
- Optional static poster if runtime budget is exceeded.

### Tier C - Accessible/Static Fallback

Used for:

- Reduced motion.
- No WebGL.
- Unsupported browser.
- Failed asset load.
- Low-power or battery-saving mode.
- Assistive technology preference where detectable.

Features:

- Current semantic 2D site.
- Static poster or current portrait treatment.
- No animated canvas.
- No lost content.
- No warning UI unless useful for debugging.

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- Do not mount the full animated scene.
- Do not run scroll-linked camera motion.
- Keep HTML content visible.
- Use a static poster or non-animated low-poly core.
- Preserve native scroll and anchor navigation.

## Error And Failure Handling

- If WebGL context creation fails, show Tier C.
- If scene import fails, show Tier C.
- If asset load fails, show Tier C or omit that asset.
- If frame rate falls below threshold for sustained time, reduce particles/DPR or switch to Tier C.
- If canvas is off-screen, pause render loop.
- If tab is hidden, pause render loop.

## Testing Requirements

- Axe scan with full scene enabled.
- Axe scan with reduced motion.
- Keyboard navigation from header through contact.
- Mobile menu focus and escape behavior unchanged.
- No-WebGL fallback test.
- Canvas failure simulation.
- Reduced-motion test.
- Horizontal overflow test.
- Live production smoke after enabling any 3D code.
