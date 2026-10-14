// Static site generator for STUDIO|BD. Usage: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, projects, lab } from './data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/media/manifest.json'), 'utf8'));
const dims = {};
for (const k in manifest) for (const it of manifest[k]) dims[it.file.replace(/\.webp$/, '')] = [it.w, it.h];

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const brand = (s) => esc(s).replace('STUDIO|BD', 'STUDIO<span class="bar">|</span>BD');

function sizeOf(src) {
  if (dims[src]) return dims[src];
  if (/^web\/.+-d\d$/.test(src)) return [1440, 900];
  if (/^web\/.+-m\d$/.test(src)) return [860, 1864];
  throw new Error('Unknown media: ' + src);
}

function img(pre, src, { alt = '', sizes = '100vw', eager = false, cls = '' } = {}) {
  const [w, h] = sizeOf(src);
  const base = `${pre}assets/media/${src}`;
  const hasSmall = !!dims[src];
  const srcset = hasSmall ? ` srcset="${base}-s.webp 720w, ${base}.webp ${w}w" sizes="${sizes}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${base}.webp"${srcset} width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

function video(pre, src, { ratio = '16/9', sound = false, label = '' } = {}) {
  const base = `${pre}assets/media/${src}`;
  return `<div class="film" style="aspect-ratio:${ratio}">
    <video class="film__video" src="${base}.mp4" poster="${base}.jpg" muted loop playsinline preload="none" data-autoplay${label ? ` aria-label="${esc(label)}"` : ''}></video>
    ${sound ? '<button class="btn film__sound" type="button" data-sound>Play with sound</button>' : ''}
  </div>`;
}

function head(pre, title, desc) {
  const og = site.url ? `<meta property="og:image" content="${site.url}/assets/media/og.jpg">` : `<meta property="og:image" content="${pre}assets/media/og.jpg">`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
${og}
<meta name="theme-color" content="#000000">
<link rel="icon" href="${pre}assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${pre}assets/fonts/Archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${pre}assets/vendor/lenis.css">
<link rel="stylesheet" href="${pre}assets/css/style.css">
<script>try{if(sessionStorage.getItem('wipe'))document.documentElement.classList.add('is-arriving')}catch(e){}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="wipe" aria-hidden="true"></div>`;
}

function nav(pre, home) {
  const h = (id) => (home ? `#${id}` : `${pre}index.html#${id}`);
  return `<header class="nav" data-nav-theme="dark">
  <a class="nav__logo" href="${pre}index.html" aria-label="STUDIO|BD home">${brand(site.name)}</a>
  <nav aria-label="Main"><ul class="nav__links">
    <li><a href="${h('work')}">Work</a></li>
    <li><a href="${h('reel')}">Reel</a></li>
    <li><a href="${h('about')}">About</a></li>
    <li><a href="${h('contact')}">Contact</a></li>
  </ul></nav>
</header>`;
}

function contact(pre) {
  const mail = site.email
    ? `<a class="contact__mail" href="mailto:${esc(site.email)}">${esc(site.email)}</a>`
    : `<p class="contact__mail contact__mail--todo">Email address to be added</p>`;
  return `<section class="contact section" id="contact" data-nav="dark">
  <h2 class="contact__h display">Tell me about your brand.</h2>
  <div class="contact__row">
    ${mail}
    <p class="contact__note">Briefs, questions and collaborations. Find me as ${esc(site.handle)}.</p>
  </div>
  <footer class="foot">
    <p>© 2026 ${brand(site.name)}</p>
    <p>Every image and film on this site was made with generative AI.</p>
    <a href="#top" data-top>Back to top</a>
  </footer>
</section>`;
}

function foot(pre) {
  return `<script src="${pre}assets/vendor/gsap.min.js" defer></script>
<script src="${pre}assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="${pre}assets/vendor/lenis.min.js" defer></script>
<script src="${pre}assets/js/main.js" defer></script>
</body>
</html>
`;
}

// ---------- Home ----------
function home() {
  const pre = './';
  const rows = projects.map((p) => `
    <li class="work__row">
      <a href="work/${p.slug}/index.html" data-preview="${pre}assets/media/${p.preview}${dims[p.preview] ? '-s' : ''}.webp">
        <span class="work__title display">${esc(p.title)}</span>
        <span class="work__meta"><span>${esc(p.type)}</span><span class="work__short">${esc(p.short)}</span></span>
        ${img(pre, p.preview, { cls: 'work__thumb', sizes: '96px' })}
      </a>
    </li>`).join('');

  const labItems = lab.map(([src, cap]) => `<figure class="lab__item">${img(pre, src, { alt: cap, sizes: '(min-width: 1100px) 25vw, 50vw' })}<figcaption>${esc(cap)}</figcaption></figure>`).join('');

  return `${head(pre, 'STUDIO|BD: AI-native brand content', site.description)}
${nav(pre, true)}
<main id="main">
<section class="hero" id="top" data-nav="dark">
  <div class="hero__media" data-lens>
    ${img(pre, 'about/portrait-02', { cls: 'hero__img', alt: 'BD holding a laptop, studio portrait', eager: true })}
    ${img(pre, 'about/portrait-03', { cls: 'hero__img hero__statue', alt: '', eager: true })}
    <span class="hero__ring" aria-hidden="true"></span>
  </div>
  <div class="hero__fore">
    <div class="hero__meta">
      <p>AI-native brand content: campaign imagery, product films, digital humans and brand websites.</p>
      <p class="hero__hint"><span class="hint-fine">Move across the portrait to see the render.</span><span class="hint-coarse">The same pose, rendered in marble.</span></p>
    </div>
    <h1 class="hero__title" aria-label="STUDIO|BD"><span class="hero__name" aria-hidden="true">STUDIO|BD</span></h1>
  </div>
</section>

<section class="intro section light" data-nav="light">
  <p class="intro__statement">I direct brand content and render it with AI: campaign images, product films and the websites that hold them. Your product, anywhere you can picture it, finished to the standard your brand already expects.</p>
  <ul class="services">
    <li><h3>Campaign imagery</h3><p>Key visuals and full shoots without a set. Products on models, in landscapes, under any light.</p></li>
    <li><h3>Product and brand films</h3><p>Short cinematic films and social cuts, built shot by shot with a consistent product and cast.</p></li>
    <li><h3>Digital humans</h3><p>Recurring AI characters who keep their face and style across a whole campaign.</p></li>
    <li><h3>Brand websites</h3><p>Design, development and content direction for brand flagships, led end to end.</p></li>
  </ul>
</section>

<section class="work section" id="work" data-nav="dark">
  <div class="work__head"><h2 class="work__h">Selected work</h2><p class="work__count">${projects.length} projects</p></div>
  <ul class="work__list">${rows}
  </ul>
  <div class="work__preview" aria-hidden="true"><img alt=""></div>
</section>

<section class="reel" id="reel" data-nav="dark" aria-label="Reel">
  <div class="reel__sticky">
    <video class="reel__video" src="${pre}assets/media/reel/reel.mp4" poster="${pre}assets/media/reel/reel.jpg" muted loop playsinline preload="none" data-autoplay aria-label="Showreel of AI films"></video>
    <div class="reel__caption">
      <h2 class="reel__title display">Reel 2026</h2>
      <p class="reel__text">Cuts from Ride at Dawn, the E8 film study and the BAODAN cat food film.</p>
    </div>
  </div>
</section>

<section class="lab section light" id="lab" data-nav="light">
  <div class="lab__head"><h2 class="lab__h display">Lab</h2><p class="lab__text">Concepts and tests between projects. Some become campaigns, some just teach me something.</p></div>
  <div class="lab__grid">${labItems}</div>
</section>

<section class="about section" id="about" data-nav="dark">
  <div class="about__grid">
    <figure class="about__portrait">${img(pre, 'about/portrait-01', { alt: 'Portrait of BD in profile against a red backdrop', sizes: '(min-width: 900px) 40vw, 100vw' })}</figure>
    <div class="about__body">
      <h2 class="about__h display">About</h2>
      <p class="about__lead">STUDIO|BD is run by BD, a brand visual marketer working where social content meets generative AI.</p>
      <p>I have led brand design, websites and content for three Shenzhen furniture brands, Huayi Space, Gemrein and Hothing, directing the team that produced them. Alongside client work I run self-initiated studies: an automotive film series, a superbike film and a house brand called BAODAN. They exist to find out what the tools can hold up to before a client needs it.</p>
      <h3 class="about__sub">How a project runs</h3>
      <ol class="steps">
        <li><h4>Brief</h4><p>We agree the product, the audience and where the brand should feel at home.</p></li>
        <li><h4>World</h4><p>I design the look: references, light, cast and palette, with a first frame for sign-off.</p></li>
        <li><h4>Render</h4><p>Images and shots are generated, selected, retouched and graded to match your real product.</p></li>
        <li><h4>Deliver</h4><p>Finals in every format you need, plus source frames for your team.</p></li>
      </ol>
    </div>
  </div>
</section>

${contact(pre)}
</main>
${foot(pre)}`;
}

// ---------- Case pages ----------
function block(pre, b) {
  const s3 = '(min-width: 800px) 33vw, 100vw', s2 = '(min-width: 800px) 50vw, 100vw';
  switch (b.k) {
    case 'text': return `<div class="b-text"><h2>${esc(b.h)}</h2><p>${esc(b.p)}</p></div>`;
    case 'grid': return `<div class="b-grid" style="--cols:${b.cols}">${b.items.map((s) => img(pre, s, { sizes: b.cols === 3 ? s3 : s2 })).join('')}</div>`;
    case 'shots': return `<div class="b-grid b-grid--shots" style="--cols:${b.items.length}">${b.items.map((s) => `<div class="shot">${img(pre, s, { sizes: s3, alt: 'Website screenshot' })}</div>`).join('')}</div>`;
    case 'phones': return `<div class="b-phones">${b.items.map((s) => `<div class="phone">${img(pre, s, { sizes: '260px', alt: 'Mobile website screenshot' })}</div>`).join('')}</div>`;
    case 'full': return `<div class="b-full">${img(pre, b.src, {})}</div>`;
    case 'single': return `<div class="b-single">${img(pre, b.src, { sizes: '(min-width: 1000px) 60vw, 100vw' })}</div>`;
    case 'video': return `<figure class="b-video">${video(pre, b.src, { ratio: b.ratio, sound: b.sound, label: b.caption })}<figcaption>${esc(b.caption)}</figcaption></figure>`;
    case 'trio-video': return `<div class="b-grid" style="--cols:3">${b.items.map((s) => video(pre, s, { ratio: b.ratio })).join('')}</div>`;
    case 'pair-video': return `<div class="b-grid" style="--cols:2">${video(pre, b.video, { ratio: b.ratio })}${img(pre, b.image, { sizes: s2 })}</div>`;
    default: throw new Error('Unknown block ' + b.k);
  }
}

function cover(pre, p) {
  const c = p.cover;
  if (c.browser) return `<div class="case-cover case-cover--browser"><div class="browser"><div class="browser__bar"><span class="browser__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser__url">${esc(c.browser)}</span></div>${video(pre, c.video, { ratio: c.ratio, label: `${p.title} website walkthrough` })}</div></div>`;
  if (c.video) return `<figure class="case-cover b-video b-video--cover">${video(pre, c.video, { ratio: c.ratio, sound: c.sound, label: c.caption || p.title })}${c.caption ? `<figcaption>${esc(c.caption)}</figcaption>` : ''}</figure>`;
  return `<div class="case-cover case-cover--image">${img(pre, c.image, { eager: true, alt: p.title })}</div>`;
}

function casePage(p, i) {
  const pre = '../../';
  const next = projects[(i + 1) % projects.length];
  const facts = [['Type', esc(p.type)], ['Role', esc(p.role)]];
  if (p.year) facts.push(['Year', esc(p.year)]);
  if (p.live) facts.push(['Live site', `<a href="${esc(p.live)}" target="_blank" rel="noopener">${esc(p.live.replace(/^https?:\/\/(www\.)?/, '').replace(/\/(home\/)?$/, ''))}</a>`]);
  return `${head(pre, `${p.title}: STUDIO|BD`, p.lead)}
${nav(pre, false)}
<main id="main" class="case">
<section class="case-hero" data-nav="dark" id="top">
  <h1 class="case-hero__title display">${esc(p.title)}</h1>
  <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
</section>
${cover(pre, p)}
<section class="case-intro" data-nav="dark">
  <p class="case-intro__lead">${esc(p.lead)}</p>
  ${p.quote ? `<blockquote class="case-intro__quote"><p>${esc(p.quote)}</p><cite>Brand line</cite></blockquote>` : ''}
  ${p.note ? `<p class="case-intro__note">${esc(p.note)}</p>` : ''}
</section>
<div class="blocks" data-nav="dark">
${p.blocks.map((b) => block(pre, b)).join('\n')}
</div>
<a class="next" href="../${next.slug}/index.html" data-nav="dark">
  <span class="next__label">Next project</span>
  <span class="next__title display">${esc(next.title)}</span>
</a>
</main>
${foot(pre)}`;
}

// Self-contained 404 (GitHub Pages serves it from any path, so no relative assets).
function notFound() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found: STUDIO|BD</title>
<style>html{color-scheme:dark}body{margin:0;min-height:100svh;display:grid;place-content:center;gap:24px;padding:24px;background:#000;color:#DEDBD5;font:18px/1.5 system-ui,sans-serif}h1{font-size:clamp(40px,8vw,96px);line-height:.9;margin:0;font-stretch:condensed;font-weight:800}a{color:inherit}</style></head>
<body><h1>This page wasn't rendered.</h1><p><a href="${process.env.BASE || '/'}">Go to the homepage</a></p>
</body></html>`;
}

fs.writeFileSync(path.join(root, 'index.html'), home());
fs.writeFileSync(path.join(root, '404.html'), notFound());
projects.forEach((p, i) => {
  const dir = path.join(root, 'work', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), casePage(p, i));
});
console.log('Built index.html, 404.html and', projects.length, 'case pages');
