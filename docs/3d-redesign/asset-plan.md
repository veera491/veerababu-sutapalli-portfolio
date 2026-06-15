# Step 12 Visual Asset Plan

## Asset Strategy

Start procedural. Add external or generated assets only when a prototype proves the need and licensing is clear.

## Required Assets

| Asset | Source | Ownership/licensing | Format | Estimated size | Desktop | Mobile | Fallback | Procedural? |
|---|---|---|---|---:|---|---|---|---|
| Neural core geometry | Original implementation | Project-owned | Procedural BufferGeometry | 0 asset bytes | Yes | Simplified | Static poster/current hero | Yes |
| Data nodes | Original implementation | Project-owned | Instanced geometry | 0 asset bytes | Yes | Reduced count | None | Yes |
| Connection lines | Original implementation | Project-owned | Curves/line geometry | 0 asset bytes | Yes | Reduced count | None | Yes |
| Section clusters | Original implementation | Project-owned | Procedural transforms/config | 0 asset bytes | Yes | Simplified | HTML sections | Yes |
| Project node metadata | Existing CSV | Project-owned content | JSON/props from CSV | Minimal | Yes | Yes | HTML cards | No extra asset |
| Project covers | Existing committed assets | Project-owned/derived, already audited | SVG/WebP | Existing | Optional as HTML textures later | Avoid as texture initially | HTML images | Existing |
| Research artifact planes | Existing evidence docs/project covers | Use only truthful visuals | SVG/WebP/KTX2 later | <= 100 KiB each | Later | Avoid initially | HTML research cards | Partly |
| Environment map | Original generated gradient or none | Project-owned | Tiny HDR/KTX2 or CSS-like shader | <= 80 KiB | Optional later | No | Solid background | Prefer procedural |
| Particle texture | Original small sprite | Project-owned | PNG/WebP/KTX2 | <= 8 KiB | Optional | Optional | None | Can be shader point |
| Static fallback poster | Generated from original scene or CSS/SVG | Project-owned | WebP/PNG | <= 80 KiB | Yes | Yes | Current 2D hero | Could be generated |
| Icons | Existing lucide/react or CSS | Existing package licenses | SVG components | Existing | HTML only | HTML only | HTML only | No |
| Sound | None | n/a | n/a | 0 | No | No | n/a | No |

## Asset Rules

- Do not use unlicensed reference assets.
- Do not use scraped 3D models.
- Do not bake fake project metrics into textures.
- Prefer KTX2/Basis if image textures become necessary.
- Prefer compressed GLB/GLTF only after procedural prototype passes.
- Keep all public assets under `public/assets/3d/`.
- Document source, ownership, and compression for every asset added.
- Avoid sound unless the user explicitly requests it and it is opt-in.

## Step 13 Asset Scope

Step 13 should require no large external assets.

Allowed:

- Procedural core geometry.
- Procedural nodes/lines.
- One small static fallback poster if generated.

Not allowed in Step 13:

- Large GLB/GLTF imports.
- HDR environment maps.
- Video textures.
- Audio.
- Unlicensed reference-derived images.
- Heavy project texture atlas.
