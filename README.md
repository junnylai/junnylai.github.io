# STUDIO|BD website

A static portfolio site with no framework and no build server. Open `index.html` locally with any static server, or deploy the folder as-is to GitHub Pages.

## Editing content
The site is one long page. All text, image choices and section content live in **`tools/data.mjs`** (websites, social films, sofa worlds, films, collection story deck, light, faces). After editing, regenerate:

```bash
node tools/build.mjs
```

This rewrites `index.html` and `404.html`.

- **Contact email:** set `email` in `tools/data.mjs` (currently empty, so the site shows "Email address to be added").
- **Add images:** drop a `name.webp` (≈1800px) and `name-s.webp` (≈720px) into `assets/media/<folder>/`, add `{ "file": "<folder>/name.webp", "w": …, "h": … }` to `assets/media/manifest.json`, then reference it as `'<folder>/name'`.
- **Add videos:** `name.mp4` (H.264, faststart) plus a `name.jpg` poster in the same folder. Reference them in a `video` block.

## Structure
```
index.html            the whole site: hero lens, intro, websites, social, sofa worlds, films, collection, light, faces, about, footer
assets/css/style.css  the whole design system (tokens at the top)
assets/js/main.js     interactions: Lenis, GSAP, lens, carousels, collection overlay, WebGL light strip
assets/media/         optimised copies of the originals (originals untouched)
tools/                build script, content data and DESIGN.md (design rationale)
```

## Local preview
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Credits
Typefaces: Archivo by Omnibus-Type and Instrument Serif by Instrument (both SIL Open Font License). Motion: GSAP and Lenis.
