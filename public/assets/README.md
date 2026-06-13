# Portfolio Assets

This directory serves as the root for all publicly available graphical assets, PDFs, and structural placeholders for the portfolio.

## Architecture

* **projects/**: Dedicated directory per project for covers, charts, and mobile previews.
* **publications/**: Dedicated directory per research paper for figures and covers.
* **experience/**: Organizational logos and environmental photography.
* **achievements/**: Proof-of-work documents, rank certificates, or visuals.
* **profile/**: Primary portrait photography and avatars.
* **resume/**: The primary verifiable PDF resume.
* **placeholders/**: Original lightweight SVGs used safely as graceful fallbacks when production assets are pending.

## Validation Strategy
The asset directory is strictly validated at build-time. 
* All references in `content/portfolio.csv` are cross-referenced with this filesystem.
* Missing required assets fail the build.
* Missing optional assets produce console warnings and gracefully fallback to structurally compatible SVGs in `/assets/placeholders/`.

## Naming Conventions
* Filenames must use `kebab-case`.
* Directory names must use `kebab-case`.
* Avoid whitespace or special characters.

## Size Constraints
The validation pipeline recommends:
* **Portraits**: < 700 KB
* **Projects**: < 1 MB
* **SVGs**: < 250 KB
* **PDFs**: < 5 MB
