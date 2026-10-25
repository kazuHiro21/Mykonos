# Mykonos Parfums — Website Redesign

## Project
Perfume brand showcase site (single-page). Stack: HTML5 + CSS only (Google Fonts: Playfair Display, Inter). Dark theme `#020c1b`.

## Files
- `index.html` — nav, hero (background video), about, collection (2 product rows), contact, footer
- `design.css` — layout, typography, hover effects, contact styles, responsive media queries
- `Images and Videos/` — product images + 2 background videos

## Navigation anchors
`#about`, `#collection`, `#contact` (all sections have matching IDs).

## Completed
- Fixed 3 broken `img2.jpg` references (Conquer, Penthouse, California Signature) → mapped to existing images
- Added Contact section (info + form) + CONTACT nav link
- Added `preload="metadata"`, `playsinline`, and `poster` to hero/about videos for performance
- Added mobile responsive media queries (<=768px): stacked about/contact, smaller hero text, tighter padding

## Remaining roadmap
1. Verify all image/video paths load (no 404s)
2. Test on mobile / real devices
3. Optional: product detail / checkout flow (currently `#` links)
4. Optional: testimonials / newsletter section
5. Lint/format check if tooling added

## Notes
- Previous session timed out; no prior plan doc existed. This file is the planning record going forward.
- "Second thing" from earlier conversation is intentionally ignored per request.
