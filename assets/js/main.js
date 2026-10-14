/* STUDIO|BD v2 interactions. Requires gsap, ScrollTrigger and Lenis (loaded before this file). */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  if (!hasGsap) return;
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mod = (a, n) => ((a % n) + n) % n;
  const wrapD = (d, n) => mod(d + n / 2, n) - n / 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (el) => (lenis ? lenis.scrollTo(el, { duration: 1.4 }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
  const lock = (on) => { if (lenis) on ? lenis.stop() : lenis.start(); document.documentElement.style.overflow = on ? 'hidden' : ''; };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = a.hasAttribute('data-top') ? document.body : $(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    if (menuOpen) closeMenu(() => scrollTo(t)); else scrollTo(t);
  });

  /* ---------- Nav theme + hide on scroll ---------- */
  const nav = $('.nav');
  $$('[data-nav]').forEach((sec) => ScrollTrigger.create({
    trigger: sec, start: 'top 40px', end: 'bottom 40px',
    onToggle: (s) => { if (s.isActive) nav.dataset.navTheme = sec.dataset.nav; },
  }));
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => nav.classList.toggle('is-hidden', !menuOpen && s.direction === 1 && s.scroll() > 160) });

  /* ---------- Menu ---------- */
  const menu = $('#menu'), menuBtn = $('.menu-btn');
  let menuOpen = false;
  function openMenu() {
    menuOpen = true; menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); nav.dataset.navTheme = 'dark'; nav.classList.remove('is-hidden'); lock(true);
    gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: reduce ? 0 : 0.7, ease: 'expo.inOut' });
    gsap.fromTo($$('.menu__nav a', menu), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: 'expo.out', delay: reduce ? 0 : 0.25 });
    $('a', menu).focus();
  }
  function closeMenu(after) {
    menuOpen = false; menuBtn.setAttribute('aria-expanded', 'false'); lock(false);
    gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: reduce ? 0 : 0.6, ease: 'expo.inOut', onComplete: () => { menu.hidden = true; ScrollTrigger.refresh(); after && after(); } });
    menuBtn.focus();
  }
  menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));

  /* ---------- Videos play only when visible ---------- */
  const io = new IntersectionObserver((es) => es.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; if (!reduce) v.play().catch(() => {}); } else if (!v.paused) v.pause();
  }), { rootMargin: '200px 0px' });
  $$('video[data-autoplay]').forEach((v) => io.observe(v));

  /* ---------- Two-tone headlines rise line by line ---------- */
  if (!reduce) $$('.mix').forEach((h) => {
    if (h.closest('.hero')) return;
    gsap.from($$('.line > span', h), { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 88%' } });
  });

  /* ---------- Intro statement lights up word by word ---------- */
  $$('[data-words]').forEach((p) => {
    p.innerHTML = p.textContent.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
    const ws = $$('.w', p);
    if (reduce) { ws.forEach((w) => (w.style.opacity = 1)); return; }
    ScrollTrigger.create({ trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: (s) => { const k = s.progress * ws.length; ws.forEach((w, i) => (w.style.opacity = clamp(0.18 + (k - i) * 0.82, 0.18, 1))); } });
  });

  /* ---------- Hero: name settles + statue lens ---------- */
  const hero = $('.hero');
  if (hero) {
    const name = $('.hero__name', hero), title = $('.hero__title', hero), media = $('[data-lens]', hero);
    const fit = () => {
      const kw = name.style.getPropertyValue('--w'), kg = name.style.getPropertyValue('--g');
      name.style.setProperty('--w', 62); name.style.setProperty('--g', 820); name.style.fontSize = '100px';
      name.style.fontSize = (100 * title.clientWidth / name.getBoundingClientRect().width) * 0.998 + 'px';
      if (kw) name.style.setProperty('--w', kw); if (kg) name.style.setProperty('--g', kg);
    };
    const L = { x: 0, y: 0, r: 0 }; let home = { x: 0, y: 0 }, pointerIn = false;
    const radius = () => Math.max(90, Math.min(media.clientWidth, media.clientHeight) * 0.19);
    const apply = () => { media.style.setProperty('--lx', L.x + 'px'); media.style.setProperty('--ly', L.y + 'px'); media.style.setProperty('--lr', L.r + 'px'); };
    const face = () => { const W = media.clientWidth, H = media.clientHeight, s = Math.max(W / 1800, H / 1344), dw = 1800 * s, dh = 1344 * s; return { x: (W - dw) * 0.5 + dw * 0.505, y: (H - dh) * 0.28 + dh * 0.27 }; };
    const placeHome = () => { home = face(); if (!pointerIn) { L.x = home.x; L.y = home.y; } if (L.r) L.r = radius(); apply(); };
    const openLens = () => {
      placeHome();
      if (reduce) { L.r = radius(); apply(); return; }
      gsap.to(L, { r: radius(), duration: 0.9, ease: 'expo.out', onUpdate: apply });
      if (!fine) {
        const W = media.clientWidth, H = media.clientHeight;
        gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 2.6, ease: 'sine.inOut', onUpdate: apply } })
          .to(L, { x: home.x - W * 0.18, y: home.y + H * 0.12 }).to(L, { x: home.x + W * 0.16, y: home.y + H * 0.22 }).to(L, { x: home.x, y: home.y });
      }
    };
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      fit();
      if (reduce) { openLens(); return; }
      const s = { w: 125, g: 120 }, set = () => { name.style.setProperty('--w', s.w); name.style.setProperty('--g', s.g); };
      set();
      gsap.timeline({ delay: 0.15 })
        .fromTo($$('.hero__img', hero), { scale: 1.06 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0)
        .to(s, { w: 62, g: 820, duration: 1.7, ease: 'expo.inOut', onUpdate: set }, 0)
        .fromTo([$('.hero__meta', hero), nav], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.2)
        .add(openLens, 1.3);
      ScrollTrigger.refresh();
    });
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fit(); placeHome(); }, 120); });
    if (fine) {
      const xTo = gsap.quickTo(L, 'x', { duration: 0.55, ease: 'power3', onUpdate: apply }), yTo = gsap.quickTo(L, 'y', { duration: 0.55, ease: 'power3', onUpdate: apply });
      media.addEventListener('pointermove', (e) => { pointerIn = true; const r = media.getBoundingClientRect(); xTo(e.clientX - r.left); yTo(e.clientY - r.top); });
      media.addEventListener('pointerleave', () => { pointerIn = false; xTo(home.x); yTo(home.y); });
    }
  }

  /* ---------- Notched frames (Lando-style cut corner around the label) ---------- */
  function drawNotch(el) {
    const svg = $('.notch', el), label = el.querySelector('.item__label, .film-card__label');
    if (!svg || !label) return;
    const W = el.clientWidth, H = el.clientHeight, r = 14, n = 40, s = 30, lw = label.offsetWidth + 40;
    const x1 = W - lw, y1 = H - n;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    $('path', svg).setAttribute('d', [
      `M ${r} .5`, `H ${W - r}`, `Q ${W - .5} .5 ${W - .5} ${r}`, `V ${y1 - r}`, `Q ${W - .5} ${y1} ${W - r} ${y1}`,
      `H ${x1}`, `C ${x1 - s * .5} ${y1} ${x1 - s * .5} ${H - .5} ${x1 - s} ${H - .5}`,
      `H ${r}`, `Q .5 ${H - .5} .5 ${H - r}`, `V ${r}`, `Q .5 .5 ${r} .5`, 'Z'].join(' '));
  }
  const notched = $$('.item, .film-card');
  const ro = new ResizeObserver((es) => es.forEach((e) => drawNotch(e.target)));
  notched.forEach((el) => ro.observe(el));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => notched.forEach(drawNotch));

  /* ---------- Website panels: earlier panels sink as the next one stacks on top ---------- */
  if (!reduce && matchMedia('(min-width: 721px)').matches) {
    const sites = $$('.site');
    sites.forEach((s, i) => {
      const next = sites[i + 1];
      if (!next) return;
      gsap.to($('.site__body', s), { scale: 0.95, filter: 'brightness(.7)', ease: 'none',
        scrollTrigger: { trigger: next, start: 'top 75%', end: 'top 15%', scrub: true } });
    });
  }

  /* ---------- Generic draggable carousel ---------- */
  function carousel({ area, n, render, onIndex, step, wrap = true, keys = area, signal }) {
    const o = signal ? { signal } : undefined;
    const st = { pos: 0, idx: 0 };
    let tw = null;
    const setIdx = (p) => { const k = wrap ? mod(Math.round(p), n) : clamp(Math.round(p), 0, n - 1); if (k !== st.idx) { st.idx = k; onIndex && onIndex(k); } };
    const go = (target, dur = 0.9) => {
      if (!wrap) target = clamp(target, 0, n - 1);
      tw && tw.kill();
      setIdx(target);
      tw = gsap.to(st, { pos: target, duration: reduce ? 0 : dur, ease: 'expo.out', onUpdate: () => render(st.pos) });
    };
    let down = null;
    area.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      down = { x: e.clientX, pos: st.pos, t: performance.now(), lx: e.clientX, lt: performance.now(), v: 0, moved: false, id: e.pointerId };
      tw && tw.kill();
    }, o);
    area.addEventListener('pointermove', (e) => {
      if (!down || e.pointerId !== down.id) return;
      const dx = e.clientX - down.x;
      if (!down.moved && Math.abs(dx) > 6) { down.moved = true; area.setPointerCapture(e.pointerId); }
      if (!down.moved) return;
      const now = performance.now();
      down.v = (e.clientX - down.lx) / Math.max(1, now - down.lt); down.lx = e.clientX; down.lt = now;
      let p = down.pos - dx / step();
      if (!wrap) p = clamp(p, -0.35, n - 0.65);
      st.pos = p; render(st.pos); setIdx(p);
    }, o);
    const up = (e) => {
      if (!down || e.pointerId !== down.id) return;
      const d = down; down = null;
      if (!d.moved) return;
      area.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true });
      go(Math.round(st.pos - clamp(d.v * 260 / step(), -3, 3)));
    };
    area.addEventListener('pointerup', up, o); area.addEventListener('pointercancel', up, o);
    keys.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.round(st.pos) + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.round(st.pos) - 1); }
    }, o);
    render(0); onIndex && onIndex(0);
    return { st, go, next: () => go(Math.round(st.pos) + 1), prev: () => go(Math.round(st.pos) - 1), render: () => render(st.pos) };
  }
  const wire = (root, c) => { const p = $('[data-prev]', root), x = $('[data-next]', root); p && p.addEventListener('click', c.prev); x && x.addEventListener('click', c.next); };

  /* ---------- Social: post carousel with the album floating either side ---------- */
  const post = $('[data-post]');
  if (post) {
    const data = JSON.parse($('#social-data').textContent);
    const cards = $$('.post-card', post), video = $('.post__media video', post), dots = $$('.post__dotsbar i', post);
    const n = data.length; let cur = 0, soundOn = false;
    const place = (instant) => cards.forEach((c, j) => {
      const d = wrapD(j - cur, n), ad = Math.abs(d), pw = c.offsetWidth;
      gsap.to(c, { duration: instant || reduce ? 0 : 1, ease: 'expo.out',
        x: d * pw * (ad > 1 ? 0.92 : 1.02), y: ad * 14, rotate: d * 5, scale: ad === 0 ? 0.86 : 1 - ad * 0.12,
        opacity: ad === 0 ? 0 : ad > 1.5 ? 0.45 : 0.9, zIndex: 10 - ad });
    });
    const show = (k) => {
      cur = mod(k, n); const s = data[cur];
      video.src = s.video + '.mp4'; video.poster = s.video + '.jpg'; video.muted = !soundOn;
      if (inView) video.play().catch(() => {});
      $('.post__title', post).textContent = s.title + '.'; $('.post__text', post).textContent = s.caption; $('.post__likes', post).textContent = s.likes;
      dots.forEach((d, i) => d.classList.toggle('on', i === cur));
      place();
    };
    let inView = false;
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) { video.preload = 'auto'; video.play().catch(() => {}); } else video.pause(); }).observe(video);
    $('.post__nav--next', post).addEventListener('click', () => show(cur + 1));
    $('.post__nav--prev', post).addEventListener('click', () => show(cur - 1));
    cards.forEach((c, j) => c.addEventListener('click', () => show(j)));
    const sb = $('.post__sound', post);
    sb.addEventListener('click', () => {
      soundOn = !soundOn; video.muted = !soundOn; video.play().catch(() => {});
      sb.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
      sb.innerHTML = soundOn ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10zM17 10l4 4M21 10l-4 4"/></svg>';
    });
    video.addEventListener('ended', () => show(cur + 1));
    dots[0].classList.add('on'); place(true);
    addEventListener('resize', () => place(true));
  }

  /* ---------- Worlds: editorial carousel ---------- */
  const ed = $('[data-editorial]');
  if (ed) {
    const slides = $$('.ed__slide', ed), n = slides.length, count = $('[data-count]', ed.parentElement);
    const c = carousel({ area: ed, n, step: () => slides[0].offsetWidth * 1.1,
      render: (pos) => slides.forEach((s, i) => {
        const d = wrapD(i - pos, n), ad = Math.abs(d), w = s.offsetWidth;
        const x = Math.sign(d) * (ad <= 1 ? ad * w * 1.22 : w * 1.22 + (ad - 1) * w * 0.95);
        gsap.set(s, { x, y: Math.min(ad, 1) * w * 0.16, scale: ad <= 1 ? 1 - ad * 0.28 : 0.72, zIndex: 50 - Math.round(ad * 10), opacity: ad > 2.6 ? 0 : 1 });
        const t = $('.ed__title', s); t.style.opacity = clamp(1 - ad * 0.55, 0.35, 1);
      }),
      onIndex: (k) => { count.textContent = String(k + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); },
    });
    slides.forEach((s, i) => s.addEventListener('click', () => { const d = wrapD(i - c.st.pos, n); if (Math.abs(d) > 0.4) c.go(Math.round(c.st.pos + d)); }));
    wire(ed.parentElement, c);
    addEventListener('resize', c.render);
  }

  /* ---------- Faces: fanned cards ---------- */
  const fan = $('[data-fan]');
  if (fan) {
    const cards = $$('.fan__card', fan), n = cards.length, cap = $('.fan__caption');
    const c = carousel({ area: fan, n, step: () => cards[0].offsetWidth * 0.55,
      render: (pos) => cards.forEach((el, i) => {
        const d = wrapD(i - pos, n), ad = Math.abs(d), w = el.offsetWidth;
        gsap.set(el, { x: d * w * 0.5, y: ad * w * 0.05, rotate: d * 7.5, scale: 1 - Math.min(ad, 3) * 0.05, zIndex: 100 - Math.round(ad * 10), opacity: ad > 3.6 ? 0 : 1 });
      }),
      onIndex: (k) => { cap.textContent = cards[k].dataset.title; },
    });
    cards.forEach((el, i) => el.addEventListener('click', () => { const d = wrapD(i - c.st.pos, n); if (Math.abs(d) > 0.4) c.go(Math.round(c.st.pos + d)); }));
    wire(fan.parentElement, c);
    addEventListener('resize', c.render);
  }

  /* ---------- Reel: inset frame opens to full-bleed ---------- */
  if (!reduce && matchMedia('(min-width: 721px)').matches && $('.reel')) {
    gsap.fromTo('.reel__video', { clipPath: 'inset(20% 26% round 28px)' }, { clipPath: 'inset(0% 0% round 0px)', ease: 'none',
      scrollTrigger: { trigger: '.reel', start: 'top top', end: 'bottom bottom', scrub: true } });
  }

  /* ---------- Film player ---------- */
  const player = $('#player'), pv = $('video', player);
  let lastFocus = null;
  const closePlayer = () => { pv.pause(); pv.removeAttribute('src'); pv.load(); player.hidden = true; lock(false); lastFocus && lastFocus.focus(); };
  $$('[data-film]').forEach((b) => b.addEventListener('click', () => {
    lastFocus = b; player.hidden = false; lock(true);
    $('#player-title').textContent = b.dataset.title;
    pv.src = b.dataset.film; pv.muted = false; pv.play().catch(() => {});
    gsap.fromTo(player, { opacity: 0 }, { opacity: 1, duration: reduce ? 0 : 0.35 });
    $('.ov__close', player).focus();
  }));
  $('.ov__close', player).addEventListener('click', closePlayer);
  player.addEventListener('click', (e) => { if (e.target === player) closePlayer(); });

  /* ---------- Collection overlay: depth coverflow or 3D cylinder ---------- */
  const ov = $('#ov');
  if (ov) {
    const coll = JSON.parse($('#coll-data').textContent);
    const stage = $('.ov__stage', ov), track = $('.ov__track', ov), count = $('[data-count]', ov);
    let car = null, cards = [], data = null, opener = null, ac = null;
    const sizeCards = () => {
      const H = stage.clientHeight, W = stage.clientWidth;
      const ch = Math.min(H * (data.mode === 'arc' ? 0.74 : 0.84), W * 0.9 / 0.75), cw = ch * 0.75;
      track.style.setProperty('--ch', ch + 'px'); track.style.setProperty('--cw', cw + 'px');
      return { W, cw };
    };
    const renderDepth = (pos) => {
      const { cw } = sizeCards();
      cards.forEach((el, i) => {
        const d = i - pos, ad = Math.abs(d), sx = Math.sign(d);
        const x = sx * (ad <= 1 ? ad * cw * 0.82 : cw * 0.82 + (ad - 1) * cw * 0.17);
        const rot = -sx * (Math.min(ad, 1) * 58 + Math.max(0, ad - 1) * 7);
        const z = -(Math.min(ad, 1) * 200 + Math.max(0, ad - 1) * 60);
        gsap.set(el, { x, z, rotateY: clamp(rot, -84, 84), zIndex: 100 - Math.round(ad * 10), opacity: ad > 7 ? 0 : 1, filter: `brightness(${1 - Math.min(ad, 4) * 0.12})` });
      });
    };
    const renderArc = (pos) => {
      const { W } = sizeCards(), R = Math.max(W * 0.78, 600), n = cards.length;
      cards.forEach((el, i) => {
        const d = wrapD(i - pos, n), a = d * 0.34;
        gsap.set(el, { x: Math.sin(a) * R, z: (Math.cos(a) - 1) * R, rotateY: a * 57.3, rotateZ: d * 2.2, y: Math.abs(d) * 10,
          zIndex: 100 - Math.round(Math.abs(d) * 10), opacity: Math.abs(a) > 1.45 ? 0 : 1, filter: `brightness(${1 - Math.min(Math.abs(d), 4) * 0.13})` });
      });
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); if (e.key === 'Tab') { const f = $$('button', ov).filter((b) => b.offsetParent); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } } };
    function open(k, btn) {
      data = coll[k]; opener = btn;
      ov.className = 'ov ov--' + data.mode; ov.hidden = false; lock(true);
      $('.ov__tag', ov).textContent = data.tag; $('.ov__title', ov).textContent = data.name; $('.ov__text', ov).textContent = data.text;
      track.innerHTML = data.items.map((it, i) => `<div class="ov__card" data-i="${i}"><img src="${it.s}" alt="${data.name}, image ${i + 1}" draggable="false"></div>`).join('');
      cards = $$('.ov__card', track);
      ac && ac.abort(); ac = new AbortController();
      const render = data.mode === 'arc' ? renderArc : renderDepth;
      car = carousel({ area: stage, keys: ov, signal: ac.signal, n: cards.length, wrap: data.mode === 'arc', render, step: () => parseFloat(track.style.getPropertyValue('--cw')) * (data.mode === 'arc' ? 0.9 : 0.6),
        onIndex: (i) => {
          count.textContent = String(i + 1).padStart(2, '0') + '/' + String(cards.length).padStart(2, '0');
          [i - 1, i, i + 1].forEach((j) => { const c = cards[mod(j, cards.length)]; if (c) $('img', c).src = data.items[mod(j, cards.length)].l; });
        } });
      cards.forEach((el, i) => el.addEventListener('click', () => { const d = data.mode === 'arc' ? wrapD(i - car.st.pos, cards.length) : i - car.st.pos; if (Math.abs(d) > 0.4) car.go(Math.round(car.st.pos + d)); }));
      document.addEventListener('keydown', onKey);
      if (!reduce) {
        gsap.fromTo($('.ov__panel', ov), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
        const start = data.mode === 'arc' ? 0 : Math.floor((cards.length - 1) / 2);
        car.st.pos = data.mode === 'arc' ? -3 : cards.length - 1; render(car.st.pos); car.go(start, 1.4);
      }
      else if (data.mode !== 'arc') car.go(Math.floor((cards.length - 1) / 2), 0);
      $('.ov__close', ov).focus();
    }
    function close() {
      ov.hidden = true; lock(false); document.removeEventListener('keydown', onKey); ac && ac.abort(); car = null; track.innerHTML = ''; opener && opener.focus();
    }
    const prevB = $('.ov__ctrl [data-prev]', ov), nextB = $('.ov__ctrl [data-next]', ov);
    prevB.addEventListener('click', () => car && car.prev()); nextB.addEventListener('click', () => car && car.next());
    $('.ov__close', ov).addEventListener('click', close);
    $$('[data-coll]').forEach((b) => b.addEventListener('click', () => open(+b.dataset.coll, b)));
    addEventListener('resize', () => { if (!ov.hidden && car) car.render(); });
  }

  /* ---------- Light: WebGL strip that bends at the edges and ripples with speed ---------- */
  const bend = $('[data-bend]');
  if (bend) initBend(bend);
  function initBend(root) {
    const canvas = $('.bend__canvas', root), items = $$('.bend__item', root), titleEl = $('.bend__title', root), countEl = $('.bend__count', root);
    const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
    if (!gl) return;
    const vs = `attribute vec2 a; uniform vec4 r; uniform vec2 res; uniform float vel; varying vec2 uv; varying float e;
      void main(){ vec2 p = r.xy + a * r.zw; float xn = p.x / res.x * 2.0 - 1.0; float b = xn * xn; e = b;
        float cy = res.y * 0.5; p.y = cy + (p.y - cy) * (1.0 + 0.32 * b * b + 0.06 * b);
        p.y += sin((a.x - 0.5) * 3.14159) * vel * 0.9 + sign(xn) * b * b * 20.0 * (a.y - 0.5);
        vec2 c = p / res * 2.0 - 1.0; gl_Position = vec4(c.x, -c.y, 0.0, 1.0); uv = a; }`;
    const fs = `precision mediump float; uniform sampler2D t; uniform vec4 cv; uniform vec2 sz; varying vec2 uv; varying float e;
      void main(){ vec2 q = uv * cv.xy + cv.zw; vec4 col = texture2D(t, q);
        vec2 px = (0.5 - abs(uv - 0.5)) * sz; float rr = 8.0; vec2 dd = max(vec2(rr) - px, 0.0); float m = 1.0 - smoothstep(rr - 1.0, rr, length(dd));
        col.rgb *= 1.0 - 0.45 * e * e; gl_FragColor = vec4(col.rgb, m); }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    let prog;
    try { prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return; } catch (err) { return; }
    gl.useProgram(prog);
    const SX = 32, SY = 8, verts = [];
    for (let j = 0; j < SY; j++) for (let i = 0; i < SX; i++) {
      const x0 = i / SX, x1 = (i + 1) / SX, y0 = j / SY, y1 = (j + 1) / SY;
      verts.push(x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1);
    }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(aLoc); gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
    const U = (n) => gl.getUniformLocation(prog, n), uR = U('r'), uRes = U('res'), uVel = U('vel'), uCv = U('cv'), uSz = U('sz');
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const tex = items.map((fig) => {
      const t = { tex: gl.createTexture(), ready: false, ar: 0.75 };
      const im = new Image(); im.decoding = 'async';
      im.onload = () => { gl.bindTexture(gl.TEXTURE_2D, t.tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        t.ar = im.naturalWidth / im.naturalHeight; t.ready = true; dirty = true; };
      im.src = $('img', fig).currentSrc || $('img', fig).src;
      return t;
    });
    root.classList.add('has-gl'); root.tabIndex = 0;
    root.setAttribute('aria-label', 'Light and Shadow images. Use the arrow keys to move.');
    const n = items.length, S = { x: 0, target: 0, vel: 0 };
    let W = 0, H = 0, dpr = 1, iw = 0, ih = 0, gap = 18, dirty = true, visible = false, idle = 0, lastIdx = -1;
    const resize = () => { dpr = Math.min(2, devicePixelRatio || 1); W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * dpr; canvas.height = H * dpr; ih = H - 150; iw = ih * 0.75; gap = Math.max(12, W * 0.012); dirty = true; };
    resize(); addEventListener('resize', resize);
    const stepW = () => iw + gap;
    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, W * dpr, H * dpr); gl.uniform1f(uVel, clamp(S.vel, -40, 40) * dpr);
      const L = n * stepW();
      for (let i = 0; i < n; i++) {
        const t = tex[i]; if (!t.ready) continue;
        const x = mod(i * stepW() - S.x + L / 2, L) - L / 2 + (W - iw) / 2;
        if (x > W + iw || x < -iw * 2) continue;
        gl.bindTexture(gl.TEXTURE_2D, t.tex);
        const qa = 0.75; let sx = 1, sy = 1; if (t.ar > qa) sx = qa / t.ar; else sy = t.ar / qa;
        gl.uniform4f(uCv, sx, sy, (1 - sx) / 2, (1 - sy) / 2);
        gl.uniform4f(uR, x * dpr, ((H - ih) / 2) * dpr, iw * dpr, ih * dpr); gl.uniform2f(uSz, iw * dpr, ih * dpr);
        gl.drawArrays(gl.TRIANGLES, 0, SX * SY * 6);
      }
      const k = mod(Math.round(S.x / stepW()), n);
      if (k !== lastIdx) { lastIdx = k; titleEl.textContent = items[k].dataset.title; countEl.textContent = String(k + 1).padStart(2, '0') + '/' + String(n).padStart(2, '0'); }
    };
    let drag = null;
    canvas.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, t: S.target }; canvas.setPointerCapture(e.pointerId); idle = 0; });
    canvas.addEventListener('pointermove', (e) => { if (drag) { S.target = drag.t - (e.clientX - drag.x) * 1.3; idle = 0; } });
    const end = () => { if (!drag) return; drag = null; S.target = Math.round(S.target / stepW()) * stepW(); };
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
    root.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); S.target += e.deltaX; idle = 0; clearTimeout(root._snap); root._snap = setTimeout(() => (S.target = Math.round(S.target / stepW()) * stepW()), 160); } }, { passive: false });
    root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); S.target = (Math.round(S.target / stepW()) + (e.key === 'ArrowRight' ? 1 : -1)) * stepW(); idle = 0; } });
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(root);
    gsap.ticker.add(() => {
      if (!visible) return;
      if (!reduce && !drag) { idle++; if (idle > 240) S.target += 0.35; }
      const prev = S.x;
      S.x += (S.target - S.x) * (reduce ? 1 : 0.085);
      S.vel += ((S.x - prev) - S.vel) * 0.25;
      if (Math.abs(S.x - prev) > 0.01 || Math.abs(S.vel) > 0.01 || dirty) { dirty = false; draw(); }
    });
  }

  /* Keep ScrollTrigger in sync as lazy media settles. */
  let rt2; new ResizeObserver(() => { clearTimeout(rt2); rt2 = setTimeout(() => ScrollTrigger.refresh(), 200); }).observe(document.body);
})();
