# Step 12 Visitor Journey

## Entry And Loading

- HTML hero content renders immediately from Server Components.
- The 3D layer lazy-loads after the hero text, CTAs, and navigation are visible.
- Before WebGL is ready, show the current 2D hero/portrait layout or a static poster.
- No blank canvas is allowed.
- No blocking multi-second intro is allowed.
- If loading takes longer than 1200 ms, keep the fallback visible and fade in the scene only when ready.
- If WebGL fails, keep the current 2D page with no error noise for the visitor.
- A "skip motion" control is optional in full 3D mode and mandatory if any intro-like transition is added.

## Hero

| Element | Specification |
|---|---|
| Central subject | Neural Intelligence Core: a procedural AI core with orbiting data nodes and light connection paths. |
| Camera start | Slightly offset perspective, core behind/right of hero copy on desktop. |
| Headline | Existing HTML H1 remains primary and visible at load. |
| Primary CTA | Existing "Explore Selected Work" remains the primary CTA. |
| Secondary CTA | Resume CTA remains accessible and visible. |
| Cursor interaction | Gentle parallax of the core and nearby nodes, max 4-6 degrees rotation. |
| Touch interaction | Drag-free; use subtle device-safe parallax only if cheap and non-disorienting. |
| Ambient motion | Slow breathing pulse and low-speed node drift, paused off-screen. |
| First scroll | Camera eases closer to capability/data layers while HTML scroll remains native. |

## About And Capabilities

- The camera moves from the outer hero core into organized capability rings.
- Capability groups appear as spatial clusters: ML systems, GenAI, RAG/search, NLP, data engineering, product engineering.
- HTML capability cards remain readable in the normal document flow.
- The scene highlights the corresponding cluster as the HTML section enters view.
- No capability requires clicking a 3D object to read.

## Projects

Projects should appear as **scene nodes mirrored by semantic HTML cards**.

Desktop behavior:

- Featured projects map to larger orbit modules around the central core.
- Supporting projects map to smaller nodes in a secondary ring.
- HTML cards remain the authoritative readable content.
- Hovering/focusing a project card highlights its matching 3D node.
- Selecting a 3D node may scroll to or focus the matching semantic card, but is optional.
- Project metrics and titles remain HTML, not canvas text.

Mobile behavior:

- Project cards remain the primary experience.
- The 3D scene reduces to a small static or low-motion header visual.
- No tiny orbit nodes as primary navigation.

## Experience And Education

- Use a spatial timeline path that extends from the core toward the contact endpoint.
- Experience nodes align with the existing semantic timeline.
- Education nodes can appear as two stable anchor points, using institution assets only as small supporting marks.
- Camera path should be section-driven, not free-fly navigation.
- Keyboard users navigate the semantic timeline and receive the same content.

## Research

- Publications appear as truthful research artifacts: thin data planes, graph slices, or document shards.
- Distributed BLOOMZ/Petals research can be represented by a network topology layer.
- Life insurance risk prediction can be represented by classification bands/decision curves.
- No fake charts, fake metrics, or invented paper visuals.
- If a real figure is unavailable, use abstract procedural motifs and label them as representational.

## Contact

- Final camera position stabilizes at a clean "connection terminal" view.
- The core resolves into a calm contact endpoint, not a noisy finale.
- Email, LinkedIn, GitHub, and resume links remain normal HTML links.
- Reduced-motion and no-WebGL users see the existing contact/footer layout.
- The final state should feel complete and quiet, with a direct CTA to contact.

## Navigation Through The Page

- Native document scroll remains the source of truth.
- Header anchor links continue to work.
- Back/forward browser behavior must remain normal.
- Section activation can use IntersectionObserver.
- Avoid scroll snapping in the first prototype.
- Avoid smooth-scroll libraries until native behavior is proven insufficient.

## Baseline Strengths To Preserve

- Current content clarity.
- Current mobile responsiveness.
- Current semantic section structure.
- Existing project order and truthfulness constraints.
- Existing accessibility/focus behavior.
- Existing SEO and JSON-LD.
- Current 2D page as a complete fallback tier.

## Primary Visual Gaps To Close

- Add depth and spatial storytelling.
- Add one memorable 3D identity object.
- Add camera choreography tied to sections.
- Add restrained cursor response.
- Add project/research spatial mapping.
- Add a cinematic but readable first viewport.
