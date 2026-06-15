# Step 12 Reference Fidelity Audit

## Status

No external user-supplied 3D reference screenshots, recordings, or URLs were found in the repository. A missing-inputs note was created at `docs/reference-inputs-needed.md`.

This audit therefore separates:

- **Verified inputs:** current production site screenshots, existing portfolio assets, project evidence docs, Lighthouse reports, and installed project architecture.
- **Unavailable inputs:** the specific external visual references mentioned in the Step 12 request.
- **Permitted inference:** a premium cinematic AI/ML art direction that fits the portfolio domain.
- **Not permitted:** claiming close visual fidelity to references that are not present.

## Search Coverage

Commands and searches covered:

- Repository file inventory for images, videos, PDFs, Markdown, and text.
- Keyword search for `reference`, `inspiration`, `cinematic`, `3D`, `interactive`, `WebGL`, `Three.js`, `hero`, `camera`, `scroll`, `motion`, `animation`, and `scene`.
- Portfolio evidence docs under `docs/portfolio-assets/`.
- Existing responsive screenshots under `docs/responsive-evidence/`.
- Existing Lighthouse artifacts under `docs/lighthouse/`.

## Located Visual Inputs

| Input | Type | Role in Step 12 | Reference fidelity value |
|---|---|---|---|
| `docs/3d-redesign/baseline/*.png` | New production screenshots | Baseline for current layout and fallback tier | High for current-site preservation, not external reference fidelity |
| `docs/responsive-evidence/*.png` | Existing responsive screenshots | Prior responsive QA evidence | High for regression comparison |
| `public/assets/profile/*.webp` | Portrait imagery | Human identity and fallback hero media | High for content truthfulness |
| `public/assets/projects/*/cover.*` | Project cover assets | Project-specific visual motifs | Medium for section art direction |
| `public/assets/education/*` | Education images/logos | Education detail support | Low for 3D concept, useful for asset ownership notes |
| `docs/portfolio-assets/*.md` | Evidence notes | Truthfulness and asset provenance | High for content mapping |
| `docs/lighthouse/*.json` | Performance evidence | Baseline for 3D performance budgets | High for implementation gating |

## Current Production Baseline Captures

Stored under `docs/3d-redesign/baseline/`.

| Capture | Purpose |
|---|---|
| `initial-390x844.png` | Mobile initial viewport |
| `initial-768x1024.png` | Tablet initial viewport |
| `initial-1440x900.png` | Desktop initial viewport |
| `initial-1920x1080.png` | Wide desktop initial viewport |
| `full-home-390x844.png` | Mobile full homepage |
| `full-home-768x1024.png` | Tablet full homepage |
| `full-home-1440x900.png` | Desktop full homepage |
| `full-home-1920x1080.png` | Wide desktop full homepage |
| `mobile-navigation-390x844.png` | Mobile navigation open state |
| `projects-1440x900.png` | Projects section |
| `experience-1440x900.png` | Experience section |
| `research-1440x900.png` | Research section |
| `contact-footer-1440x900.png` | Contact/footer section |

## Current Strengths To Preserve

- Clear semantic structure with one visible H1 and logical section order.
- Recruiter-readable content without requiring interaction.
- Strong dark visual system with restrained orange accent.
- Stable responsive layout on mobile, tablet, and desktop.
- Existing project data from `content/portfolio.csv`.
- SEO architecture: Metadata API, JSON-LD, robots, sitemap, OG assets.
- Accessibility baseline: keyboard-accessible mobile menu, focus return, Axe coverage.
- Static fallback quality: the current 2D site already works without WebGL.

## Current Visual Gaps

- Flat composition with limited perceived depth.
- No central interactive 3D identity.
- No camera system or spatial scroll story.
- Limited cursor response beyond standard hover states.
- Conventional vertical section sequence.
- Project cards do not feel like part of one spatial system.
- No cinematic transitions between research, projects, experience, and contact.
- No explicit low-power 3D tier because 3D is not implemented yet.

## Reference Feature Matrix

Because external references are missing, the following matrix records only verified current-site observations.

| Dimension | Current site | Desired Step 13+ direction |
|---|---|---|
| Overall style | Clean, dark, editorial, recruiter-readable | Cinematic AI systems space layered behind semantic content |
| Background | Flat charcoal with subtle surfaces | Deep field with controlled grid, nodes, and volumetric-feeling light |
| Palette | Charcoal, white, muted gray, orange accent | Preserve palette, add restrained cyan/blue data highlights only as secondary accents |
| Typography | Geist, strong uppercase hero, readable cards | Preserve font stack and hierarchy; do not make text part of canvas only |
| 3D subject | None | Central AI intelligence core with connected data/research modules |
| Camera behavior | None | Scroll-linked but gentle camera path; no forced intro |
| Mouse behavior | Standard hover | Low-amplitude parallax and raycast hover on nonessential scene elements |
| Scroll behavior | Native vertical sections | Native scroll remains; 3D camera follows section progress |
| Loading | Normal page load | HTML content visible first; canvas lazy-loads progressively |
| Cursor | Native cursor | Native cursor retained; no forced custom cursor |
| Particles | None | Sparse instanced particles, capped per tier |
| Lighting | CSS glow behind portrait | Minimal 3D emissive/core lighting, no heavy shadow pipeline initially |
| Project presentation | Cards with real covers and metrics | Semantic cards stay; scene mirrors projects as selectable nodes/modules |
| Mobile behavior | Simplified readable single column | Mobile uses simplified/static 3D or poster; no dense orbit interaction |
| Reproduce | Clarity, accessibility, strong content, dark palette | Add spatial depth without hiding content |
| Do not copy/add | Blank canvas, long intro, inaccessible canvas-only content | Avoid heavy post-processing, forced smooth scroll, or unreadable text in 3D |

## Fidelity Conclusion

Step 12 can define a strong cinematic 3D direction, but Step 13 must treat it as an original portfolio concept until the user supplies actual references. The fallback layer must remain the current semantic 2D site.
