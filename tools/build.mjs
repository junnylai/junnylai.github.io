// Static generator for the single-page STUDIO|BD site. Usage: node tools/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, websites, social, worlds, films, filmsNote, collection, light, faces } from './data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const M = path.join(root, 'assets/media');
const manifest = JSON.parse(fs.readFileSync(path.join(M, 'manifest.json'), 'utf8'));
const dims = {};
for (const k in manifest) for (const it of manifest[k]) dims[it.file.replace(/\.webp$/, '')] = [it.w, it.h];

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const exists = (rel) => fs.existsSync(path.join(M, rel));
const P = 'assets/media/';

function size(src) {
  if (dims[src]) return dims[src];
  // Fall back to reading the WebP header for files outside the manifest (cut-outs, screenshots).
  const buf = fs.readFileSync(path.join(M, src + '.webp'));
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (chunk === 'VP8L') { const b = buf.readUInt32LE(21); return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)]; }
  throw new Error('Cannot size ' + src);
}

function img(src, { alt = '', sizes = '100vw', eager = false, cls = '', small = false } = {}) {
  const [w, h] = size(src);
  const hasS = exists(src + '-s.webp');
  const file = small && hasS ? `${P}${src}-s.webp` : `${P}${src}.webp`;
  const srcset = hasS && !small ? ` srcset="${P}${src}-s.webp 720w, ${P}${src}.webp ${w}w" sizes="${sizes}"` : '';
  return `<img${cls ? ` class="${cls}"` : ''} src="${file}"${srcset} width="${w}" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" draggable="false">`;
}

const icon = {
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-3.1-6.3A8 8 0 0 1 20 12zM20 20l-3.2-1.6"/></svg>',
  repost: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h13l-3-3M20 15H7l3 3"/></svg>',
  send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/></svg>',
  save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  out: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10zM17 10l4 4M21 10l-4 4"/></svg>',
  dots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>',
};

// Two-tone headline: first line sans, second line serif.
const mix = (a, b, tag = 'h2', cls = '') => `<${tag} class="mix${cls ? ' ' + cls : ''}"><span class="line"><span class="mix__s">${a}</span></span><span class="line"><span class="mix__f">${b}</span></span></${tag}>`;
const logo = '<span class="logo__f">STUDIO</span><span class="logo__bar">|</span><span class="logo__s">BD</span>';
const notch = '<svg class="notch" aria-hidden="true"><path/></svg>';

// ---------------- Sections ----------------
const nav = `<header class="nav" data-nav-theme="dark">
  <a class="logo" href="#top" aria-label="STUDIO|BD, back to top">${logo}</a>
  <div class="nav__right">
    <a class="pill pill--signal" href="mailto:${site.email}">Enquiries</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="sr">Open menu</span><i></i><i></i></button>
  </div>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <nav class="menu__nav" aria-label="Sections">
    <a href="#websites"><span class="mix__s">Websites</span></a>
    <a href="#social"><span class="mix__f">Social</span></a>
    <a href="#films"><span class="mix__s">Films</span></a>
    <a href="#collection"><span class="mix__f">Collection</span></a>
    <a href="#light"><span class="mix__s">Light</span></a>
    <a href="#faces"><span class="mix__f">Faces</span></a>
    <a href="#contact"><span class="mix__s">Contact</span></a>
  </nav>
  <p class="menu__foot"><a href="mailto:${site.email}">${site.email}</a><span>${esc(site.handle)}</span></p>
</div>`;

const hero = `<section class="hero" id="top" data-nav="dark">
  <div class="hero__media" data-lens>
    ${img('about/portrait-02', { cls: 'hero__img', alt: 'BD holding a laptop, studio portrait', eager: true })}
    ${img('about/portrait-03', { cls: 'hero__img hero__statue', alt: '', eager: true })}
    <span class="hero__ring" aria-hidden="true"></span>
  </div>
  <div class="hero__fore">
    <div class="hero__meta">
      <p class="hero__tag"><span class="mix__s">AI-native</span> <span class="mix__f">brand content</span></p>
      <p class="hero__hint"><span class="hint-fine">Move across the portrait to see the render.</span><span class="hint-coarse">The same pose, rendered in marble.</span></p>
    </div>
    <h1 class="hero__title" aria-label="STUDIO|BD"><span class="hero__name" aria-hidden="true">STUDIO|BD</span></h1>
  </div>
</section>`;

const intro = `<section class="intro light" data-nav="light">
  ${mix('Directed by hand.', 'Rendered by AI.', 'h2', 'mix--xl')}
  <p class="intro__statement" data-words>I direct brand content and render it with AI: campaign images, product films, digital humans and the websites that hold them. Your product, anywhere you can picture it, finished to the standard your brand already expects.</p>
  <ul class="services">
    <li><h3>Campaign imagery</h3><p>Key visuals and full shoots without a set. Products on models, in landscapes, under any light.</p></li>
    <li><h3>Product and brand films</h3><p>Short cinematic films and social cuts, built shot by shot with a consistent product and cast.</p></li>
    <li><h3>Digital humans</h3><p>Recurring AI characters who keep their face and style across a whole campaign.</p></li>
    <li><h3>Brand websites</h3><p>Design, development and content direction for brand flagships, led end to end.</p></li>
  </ul>
</section>`;

const sites = `<section class="sites" id="websites" data-nav="dark">
  <div class="sec-head">${mix('Three brands,', 'built end to end.')}<p class="sec-head__p">Brand design, visual direction, content and code for three Shenzhen furniture brands.</p></div>
  <div class="sites__stack">
  ${websites.map((w, i) => `<article class="site" style="--i:${i}">
    <div class="site__tab"><span>${esc(w.name)}</span></div>
    <div class="site__body">
      <div class="site__info">
        <h3 class="site__name">${esc(w.name)}</h3>
        <p class="site__kind">${esc(w.kind)}</p>
        <p class="site__text">${esc(w.text)}</p>
        ${w.quote ? `<blockquote class="site__quote">${esc(w.quote)}</blockquote>` : ''}
        <dl class="site__facts"><div><dt>My role</dt><dd>${esc(w.role)}</dd></div></dl>
        <a class="pill pill--light" href="${w.url}" target="_blank" rel="noopener">Visit ${esc(w.domain)} ${icon.out}</a>
      </div>
      <div class="site__media">
        <div class="browser"><div class="browser__bar"><span class="browser__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser__url">${esc(w.domain)}</span></div>
          <div class="browser__screen"><video src="${P}${w.video}.mp4" poster="${P}${w.video}.jpg" muted loop playsinline preload="none" data-autoplay aria-label="${esc(w.name)} website walkthrough"></video></div>
        </div>
        ${w.phone ? `<div class="site__phone">${img(w.phone, { alt: `${w.name} on mobile`, sizes: '220px' })}</div>` : ''}
        ${w.shot ? `<div class="site__shot">${img(w.shot, { alt: `${w.name} website, product scene`, sizes: '320px' })}</div>` : ''}
      </div>
    </div>
  </article>`).join('\n')}
  </div>
</section>`;

const socialSec = `<section class="social light" id="social" data-nav="light">
  <div class="sec-head">${mix('Made for', 'the feed.')}<p class="sec-head__p">Four social films for Huayi Space. Change post and the rest of the album moves around it.</p></div>
  <div class="post-stage" data-post>
    <div class="post-stage__deck">${social.map((s, i) => `<button class="post-card" type="button" data-i="${i}" aria-label="Show ${esc(s.title)}"><img src="${P}${s.video}.jpg" alt="" loading="lazy" draggable="false"></button>`).join('')}</div>
    <article class="post" aria-live="polite">
      <header class="post__head"><span class="post__avatar" aria-hidden="true">H</span><span class="post__who"><b>huayispace</b><small>Shenzhen, China</small></span><span class="post__dots">${icon.dots}</span></header>
      <div class="post__media">
        <video muted loop playsinline preload="none" poster="${P}${social[0].video}.jpg" src="${P}${social[0].video}.mp4"></video>
        <button class="post__nav post__nav--prev" type="button" aria-label="Previous post">${icon.prev}</button>
        <button class="post__nav post__nav--next" type="button" aria-label="Next post">${icon.next}</button>
        <button class="post__sound" type="button" aria-label="Turn sound on">${icon.mute}</button>
        <span class="post__dotsbar" aria-hidden="true">${social.map(() => '<i></i>').join('')}</span>
      </div>
      <footer class="post__foot">
        <div class="post__actions"><span class="post__like">${icon.heart}<b class="post__likes">${social[0].likes}</b></span>${icon.comment}${icon.repost}${icon.send}<span class="post__save">${icon.save}</span></div>
        <p class="post__caption"><b>huayispace</b> <span class="post__title">${esc(social[0].title)}.</span> <span class="post__text">${esc(social[0].caption)}</span></p>
      </footer>
    </article>
  </div>
  <script type="application/json" id="social-data">${JSON.stringify(social.map((s) => ({ ...s, video: P + s.video })))}</script>
</section>`;

const worldsSec = `<section class="worlds" id="worlds" data-nav="dark">
  <p class="worlds__bg" aria-hidden="true">Studies<br>in place</p>
  <div class="worlds__head">${mix('One sofa,', 'seven worlds.')}<p class="sec-head__p">An AI campaign for Huayi Space. The bouclé, the walnut trim and the cushions survive every scene.</p></div>
  <div class="ed" data-editorial tabindex="0" aria-roledescription="carousel" aria-label="Sofa campaign">
    ${worlds.map((w, i) => `<figure class="ed__slide" data-i="${i}">${img(w.src, { alt: `Huayi Space sofa, ${w.title.join(' ')}`, sizes: '40vw' })}<figcaption class="ed__title"><span>${esc(w.title[0])}</span><span>${esc(w.title[1])}</span></figcaption></figure>`).join('')}
  </div>
  <div class="ctrl ctrl--dark"><button class="ctrl__b" type="button" data-prev aria-label="Previous world">${icon.prev}</button><span class="ctrl__count" data-count>01/0${worlds.length}</span><button class="ctrl__b" type="button" data-next aria-label="Next world">${icon.next}</button></div>
</section>`;

const filmsSec = `<section class="films" id="films" data-nav="dark">
  <div class="reel" aria-label="Reel">
    <div class="reel__sticky">
      <video class="reel__video" src="${P}reel/reel.mp4" poster="${P}reel/reel.jpg" muted loop playsinline preload="none" data-autoplay aria-label="Showreel of AI films"></video>
      <div class="reel__caption">${mix('Reel', '2026', 'h2', 'mix--reel')}<p class="reel__text">Cuts from Ride at Dawn, the E8 film study and the BAODAN cat food film.</p></div>
    </div>
  </div>
  <div class="films__row">
    ${films.map((f) => `<button class="film-card" type="button" data-film="${P}${f.video}.mp4" data-title="${esc(f.title)}">
      <span class="film-card__frame"><img src="${P}${f.video}.jpg" alt="" loading="lazy" draggable="false"><span class="film-card__play">${icon.play}</span></span>
      ${notch}<span class="film-card__label"><b>${esc(f.title)}</b><em>${esc(f.length)}</em></span>
    </button>`).join('')}
  </div>
  <p class="films__note">${esc(filmsNote)}</p>
</section>`;

const pad = (k) => String(k).padStart(2, '0');
const collSec = `<section class="coll" id="collection" data-nav="dark">
  <div class="sec-head">${mix('The', 'collection.')}<p class="sec-head__p">Products I have rendered into whole campaigns. Throw the card to see the next one, or open a campaign to see every frame.</p></div>
  <div class="deck" data-deck aria-roledescription="carousel" aria-label="Campaign collection">
    <div class="deck__ghost" aria-hidden="true"><img src="${P}${collection[0].cover}-s.webp" alt=""></div>
    <div class="deck__copy">
      <p class="deck__count"><span data-cur>01</span> / ${pad(collection.length)}<span class="deck__rule" aria-hidden="true"></span></p>
      <div class="deck__text" aria-live="off">
        <h3 class="deck__title">${esc(collection[0].name)}</h3>
        <p class="deck__lead">${esc(collection[0].text)}</p>
        <p class="deck__who"><img class="deck__avatar" src="${P}${collection[0].cover}-s.webp" alt="" width="44" height="44"><span><b>${esc(collection[0].tag)}</b><small>${collection[0].items.length} images</small></span></p>
      </div>
      <div class="deck__ctrl">
        <button class="ctrl__b" type="button" data-prev aria-label="Previous campaign">${icon.prev}</button>
        <button class="ctrl__b deck__next" type="button" data-next aria-label="Next campaign"><svg class="deck__ring" viewBox="0 0 56 56" aria-hidden="true"><circle class="t" cx="28" cy="28" r="26"/><circle class="p" cx="28" cy="28" r="26"/></svg>${icon.next}</button>
        <button class="pill pill--light deck__open" type="button" data-open>Open campaign</button>
        <span class="deck__meta"><span class="deck__hint"><span aria-hidden="true">&#8592;&#8594;</span> Drag the card</span><button class="deck__pause" type="button" aria-pressed="false">Pause</button></span>
      </div>
    </div>
    <div class="deck__stack">
      ${collection.map((c, i) => `<button class="deck__card" type="button" data-i="${i}" aria-label="Open the ${esc(c.name)} campaign"${i ? ' tabindex="-1" aria-hidden="true"' : ''}>${img(c.cover, { alt: '', sizes: '(min-width: 900px) 30vw, 72vw', eager: false })}</button>`).join('\n      ')}
    </div>
  </div>
  <script type="application/json" id="coll-data">${JSON.stringify(collection.map((c) => ({ name: c.name, tag: c.tag, mode: c.mode, text: c.text, cover: P + c.cover + '-s.webp', items: c.items.map((s) => { const [w, h] = size(s); return { s: P + s + (exists(s + '-s.webp') ? '-s' : '') + '.webp', l: P + s + '.webp', w, h }; }) })))}</script>
</section>`;

const lightSec = `<section class="light-sec" id="light" data-nav="dark">
  <div class="sec-head">${mix('Light and', 'shadow.')}<p class="sec-head__p">One model, one pair of red sunglasses, thirteen lighting setups. Drag the strip.</p></div>
  <div class="bend" data-bend>
    <p class="bend__title" aria-live="polite">${esc(light[0][1])}</p>
    <canvas class="bend__canvas" aria-hidden="true"></canvas>
    <div class="bend__list" tabindex="0" aria-label="Light and Shadow images">${light.map(([s, t], i) => `<figure class="bend__item" data-title="${esc(t)}">${img(s, { alt: t, small: true })}</figure>`).join('')}</div>
    <p class="bend__count" aria-hidden="true">01/${String(light.length).padStart(2, '0')}</p>
  </div>
</section>`;

const facesSec = `<section class="faces light" id="faces" data-nav="light">
  <div class="sec-head">${mix('Meet the', 'faces.')}<p class="sec-head__p">Four AI characters, each held across dozens of scenes, outfits and camera angles.</p></div>
  <div class="fan" data-fan tabindex="0" aria-roledescription="carousel" aria-label="Digital humans">
    ${faces.map(([s, t], i) => `<figure class="fan__card" data-i="${i}" data-title="${esc(t)}">${img(s, { alt: t, sizes: '28vw' })}</figure>`).join('')}
  </div>
  <p class="fan__caption" aria-live="polite">${esc(faces[0][1])}</p>
  <div class="ctrl"><button class="ctrl__b" type="button" data-prev aria-label="Previous face">${icon.prev}</button><button class="ctrl__b" type="button" data-next aria-label="Next face">${icon.next}</button></div>
</section>`;

const about = `<section class="about" id="about" data-nav="dark">
  ${mix('A studio of', 'one, plus machines.')}
  <div class="about__grid">
    <div class="about__text">
      <p class="about__lead">STUDIO|BD is run by BD, a brand visual marketer working where social content meets generative AI.</p>
      <p>I have led brand design, websites and content for three Shenzhen furniture brands, directing the team that produced them. Alongside client work I run self-initiated studies, an automotive film series, a superbike film and a house brand called BAODAN, to find out what the tools can hold up to before a client needs it.</p>
    </div>
    <ol class="steps">
      <li><h3>Brief</h3><p>We agree the product, the audience and where the brand should feel at home.</p></li>
      <li><h3>World</h3><p>I design the look: references, light, cast and palette, with a first frame for sign-off.</p></li>
      <li><h3>Render</h3><p>Images and shots are generated, selected, retouched and graded to match your real product.</p></li>
      <li><h3>Deliver</h3><p>Finals in every format you need, plus source frames for your team.</p></li>
    </ol>
  </div>
</section>`;

const brands = ['Huayi Space', 'Gemrein', 'Hothing', 'BAODAN', 'Huayi Space', 'Gemrein', 'Hothing', 'BAODAN'];
const footer = `<footer class="foot" id="contact" data-nav="dark">
  <div class="foot__panel">
    <div class="foot__bump" aria-hidden="true"></div>
    <div class="foot__head">${mix('Always rendering', 'the next one.')}</div>
    <div class="foot__cols">
      <div class="foot__col"><p class="foot__label">Sections</p><ul><li><a href="#websites">Websites</a></li><li><a href="#social">Social</a></li><li><a href="#films">Films</a></li><li><a href="#collection">Collection</a></li><li><a href="#faces">Faces</a></li></ul></div>
      <div class="foot__col foot__col--r"><p class="foot__label">Contact</p><ul><li><a href="mailto:${site.email}">Email</a></li><li><span>${esc(site.handle)}</span></li><li><a href="#top" data-top>Back to top</a></li></ul></div>
    </div>
    <div class="foot__marquee" aria-hidden="true"><div class="foot__track">${[...brands, ...brands].map((b, i) => `<span class="${i % 2 ? 'mix__f' : 'mix__s'}">${b}</span>`).join('')}</div></div>
    <div class="foot__portrait">${img('cut/bd-profile', { alt: 'BD in profile', sizes: '40vw' })}</div>
    <a class="pill pill--signal foot__cta" href="mailto:${site.email}">Business enquiries ${icon.out}</a>
  </div>
  <div class="foot__base"><p>© 2026 ${logo}. Every image and film on this site was made with generative AI.</p><p><a href="mailto:${site.email}">${site.email}</a></p></div>
</footer>`;

const overlays = `<div class="ov" id="ov" role="dialog" aria-modal="true" aria-labelledby="ov-title" hidden>
  <div class="ov__panel">
    <span class="ov__tag"></span>
    <button class="ov__close" type="button" aria-label="Close">${icon.close}</button>
    <div class="ov__stage"><div class="ov__track"></div><div class="ov__frost ov__frost--l"></div><div class="ov__frost ov__frost--r"></div></div>
    <div class="ov__info"><h2 class="ov__title" id="ov-title"></h2><p class="ov__text"></p></div>
    <div class="ctrl ctrl--dark ov__ctrl"><button class="ctrl__b" type="button" data-prev aria-label="Previous image">${icon.prev}</button><span class="ctrl__count" data-count></span><button class="ctrl__b" type="button" data-next aria-label="Next image">${icon.next}</button></div>
  </div>
</div>
<div class="player" id="player" role="dialog" aria-modal="true" aria-labelledby="player-title" hidden>
  <h2 class="sr" id="player-title">Film</h2>
  <button class="ov__close" type="button" aria-label="Close film">${icon.close}</button>
  <video controls playsinline></video>
</div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>STUDIO|BD: AI-native brand content</title>
<meta name="description" content="${esc(site.description)}">
<meta property="og:title" content="STUDIO|BD: AI-native brand content">
<meta property="og:description" content="${esc(site.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${site.url}/">
<meta property="og:image" content="${site.url}/assets/media/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#000000">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/Archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/InstrumentSerif-R.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/vendor/lenis.css">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${nav}
<main id="main">
${hero}
${intro}
${sites}
${socialSec}
${worldsSec}
${filmsSec}
${collSec}
${lightSec}
${facesSec}
${about}
</main>
${footer}
${overlays}
<script src="assets/vendor/gsap.min.js" defer></script>
<script src="assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="assets/vendor/lenis.min.js" defer></script>
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;

const notFound = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found: STUDIO|BD</title>
<style>html{color-scheme:dark}body{margin:0;min-height:100svh;display:grid;place-content:center;gap:24px;padding:24px;background:#000;color:#DEDBD5;font:18px/1.5 system-ui,sans-serif}h1{font-size:clamp(40px,8vw,96px);line-height:.9;margin:0;font-weight:800}a{color:inherit}</style></head>
<body><h1>This page wasn't rendered.</h1><p><a href="/">Go to the homepage</a></p></body></html>`;

fs.writeFileSync(path.join(root, 'index.html'), html);
fs.writeFileSync(path.join(root, '404.html'), notFound);
console.log('Built index.html and 404.html');
