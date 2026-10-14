# STUDIO|BD website

A static portfolio site with no framework and no build server. Open `index.html` locally with any static server, or deploy the folder as-is to GitHub Pages.

## Editing content
All text, project order and image choices live in **`tools/data.mjs`**. After editing, regenerate the pages:

```bash
node tools/build.mjs
```

This rewrites `index.html`, `404.html` and `work/*/index.html`.

- **Contact email:** set `email` in `tools/data.mjs` (currently empty, so the site shows "Email address to be added").
- **Add images:** drop a `name.webp` (≈1800px) and `name-s.webp` (≈720px) into `assets/media/<folder>/`, add `{ "file": "<folder>/name.webp", "w": …, "h": … }` to `assets/media/manifest.json`, then reference it as `'<folder>/name'`.
- **Add videos:** `name.mp4` (H.264, faststart) plus a `name.jpg` poster in the same folder. Reference them in a `video` block.

## Structure
```
index.html            home: hero lens, intro, work list, reel, lab, about, contact
work/<slug>/          one case study per project
assets/css/style.css  the whole design system (tokens at the top)
assets/js/main.js     interactions: Lenis smooth scroll, GSAP, lens, previews, page wipe
assets/media/         optimised copies of the originals (originals untouched)
tools/                build script, content data and DESIGN.md (design rationale)
```

## Local preview
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Credits
Typeface: Archivo by Omnibus-Type (SIL Open Font License). Motion: GSAP and Lenis.
