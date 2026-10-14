/* STUDIO|BD interactions. Requires gsap, ScrollTrigger and Lenis (loaded before this file). */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce && hasGsap && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToTarget = (el) => {
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- Page wipe + internal links ---------- */
  const wipe = document.querySelector('.wipe');
  if (root.classList.contains('is-arriving')) {
    try { sessionStorage.removeItem('wipe'); } catch (e) {}
    if (hasGsap && !reduce) {
      gsap.fromTo(wipe, { scaleY: 1, transformOrigin: 'top' }, {
        scaleY: 0, duration: 0.8, ease: 'expo.inOut', delay: 0.05,
        onComplete: () => root.classList.remove('is-arriving'),
      });
    } else root.classList.remove('is-arriving');
  }
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && wipe) { if (hasGsap) gsap.set(wipe, { scaleY: 0 }); root.classList.remove('is-arriving'); }
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === '_blank') return;
    if (a.hasAttribute('data-top')) { e.preventDefault(); scrollToTarget(document.body); return; }
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    const samePage = url.pathname === location.pathname || (url.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, ''));
    if (samePage && url.hash) {
      const t = document.querySelector(url.hash);
      if (t) { e.preventDefault(); scrollToTarget(t); history.replaceState(null, '', url.hash); }
      return;
    }
    if (!hasGsap || reduce || !wipe) return;
    e.preventDefault();
    gsap.fromTo(wipe, { scaleY: 0, transformOrigin: 'bottom' }, {
      scaleY: 1, duration: 0.6, ease: 'expo.inOut',
      onComplete: () => { try { sessionStorage.setItem('wipe', '1'); } catch (err) {} location.href = a.href; },
    });
  });

  // Arriving at index.html#work from a case page.
  if (location.hash && lenis) {
    const t = document.querySelector(location.hash);
    if (t) requestAnimationFrame(() => lenis.scrollTo(t, { immediate: true }));
  }

  /* ---------- Nav colour follows the section under it ---------- */
  const navEl = document.querySelector('.nav');
  if (navEl && hasGsap) {
    document.querySelectorAll('[data-nav]').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: 'top 36px', end: 'bottom 36px',
        onToggle: (self) => { if (self.isActive) navEl.dataset.navTheme = sec.dataset.nav; },
      });
    });
  }

  if (navEl && hasGsap) {
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => navEl.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 140),
    });
  }

  /* ---------- Videos: play only when visible ---------- */
  const vids = [...document.querySelectorAll('video[data-autoplay]')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (v.preload === 'none') v.preload = 'auto';
        if (!reduce || v.dataset.userPlay) v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });
  vids.forEach((v) => io.observe(v));

  document.querySelectorAll('[data-sound]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const film = btn.closest('.film');
      const v = film.querySelector('video');
      v.dataset.userPlay = '1';
      v.muted = false; v.loop = false; v.currentTime = 0; v.controls = true;
      v.preload = 'auto';
      v.play().catch(() => {});
      film.classList.add('is-playing');
      v.focus({ preventScroll: true });
    });
  });

  /* ---------- Hero: name settles + statue lens ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const name = hero.querySelector('.hero__name');
    const title = hero.querySelector('.hero__title');
    const media = hero.querySelector('[data-lens]');

    const fit = () => {
      const keepW = name.style.getPropertyValue('--w'), keepG = name.style.getPropertyValue('--g');
      name.style.setProperty('--w', 62); name.style.setProperty('--g', 820);
      name.style.fontSize = '100px';
      const w = name.getBoundingClientRect().width;
      name.style.fontSize = (100 * title.clientWidth / w) * 0.998 + 'px';
      if (keepW) name.style.setProperty('--w', keepW);
      if (keepG) name.style.setProperty('--g', keepG);
    };
    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
      fit();
      if (hasGsap && !reduce) {
        const s = { w: 125, g: 120 };
        const set = () => { name.style.setProperty('--w', s.w); name.style.setProperty('--g', s.g); };
        set();
        gsap.timeline({ delay: 0.15 })
          .fromTo(hero.querySelectorAll('.hero__img'), { scale: 1.06 }, { scale: 1, duration: 2, ease: 'expo.out' }, 0)
          .to(s, { w: 62, g: 820, duration: 1.7, ease: 'expo.inOut', onUpdate: set }, 0)
          .fromTo([hero.querySelector('.hero__meta'), navEl], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.2)
          .add(() => openLens(), 1.3);
      } else openLens(true);
      if (hasGsap) ScrollTrigger.refresh();
    });
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { fit(); placeHome(); }, 120); });

    // Lens state in px within .hero__media
    const L = { x: 0, y: 0, r: 0 };
    const radius = () => Math.max(90, Math.min(media.clientWidth, media.clientHeight) * 0.19);
    const apply = () => {
      media.style.setProperty('--lx', L.x + 'px');
      media.style.setProperty('--ly', L.y + 'px');
      media.style.setProperty('--lr', L.r + 'px');
    };
    // Face position: image is object-fit cover with object-position 50% 28%; the face sits near (50%, 27%) of the source.
    const facePoint = () => {
      const W = media.clientWidth, H = media.clientHeight, iw = 1800, ih = 1344;
      const s = Math.max(W / iw, H / ih), dw = iw * s, dh = ih * s;
      const ox = (W - dw) * 0.5, oy = (H - dh) * 0.28;
      return { x: ox + dw * 0.505, y: oy + dh * 0.27 };
    };
    let home = { x: 0, y: 0 };
    const placeHome = () => { home = facePoint(); if (!pointerIn) { L.x = home.x; L.y = home.y; } if (L.r) L.r = radius(); apply(); };
    let pointerIn = false;

    function openLens(instant) {
      placeHome();
      if (!hasGsap || instant) { L.r = radius(); apply(); return; }
      gsap.to(L, { r: radius(), duration: 0.9, ease: 'expo.out', onUpdate: apply });
      if (!fine && !reduce) drift();
    }
    function drift() {
      // Touch devices: the lens wanders around the head and shoulders.
      const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 2.6, ease: 'sine.inOut', onUpdate: apply } });
      const W = media.clientWidth, H = media.clientHeight;
      tl.to(L, { x: home.x - W * 0.18, y: home.y + H * 0.12 })
        .to(L, { x: home.x + W * 0.16, y: home.y + H * 0.22 })
        .to(L, { x: home.x, y: home.y });
    }

    if (fine && hasGsap) {
      const xTo = gsap.quickTo(L, 'x', { duration: 0.55, ease: 'power3', onUpdate: apply });
      const yTo = gsap.quickTo(L, 'y', { duration: 0.55, ease: 'power3', onUpdate: apply });
      media.addEventListener('pointerenter', () => { pointerIn = true; });
      media.addEventListener('pointermove', (e) => {
        pointerIn = true;
        const r = media.getBoundingClientRect();
        xTo(e.clientX - r.left); yTo(e.clientY - r.top);
      });
      media.addEventListener('pointerleave', () => { pointerIn = false; xTo(home.x); yTo(home.y); });
    }
  }

  /* ---------- Work list: floating preview ---------- */
  const preview = document.querySelector('.work__preview');
  if (preview && fine && hasGsap) {
    const pimg = preview.querySelector('img');
    const list = document.querySelector('.work__list');
    const px = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
    const py = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
    const links = list.querySelectorAll('a[data-preview]');
    links.forEach((a) => { const i = new Image(); i.src = a.dataset.preview; });
    let shown = false;
    const pos = (e) => {
      const w = preview.offsetWidth, h = preview.offsetHeight;
      const x = Math.min(innerWidth - w - 16, e.clientX + 28), y = Math.min(innerHeight - h - 16, Math.max(16, e.clientY - h / 2));
      if (!shown) { gsap.set(preview, { x, y }); } else { px(x); py(y); }
    };
    links.forEach((a) => {
      a.addEventListener('pointerenter', (e) => {
        pimg.src = a.dataset.preview;
        pos(e);
        if (!shown) { shown = true; gsap.fromTo(preview, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' }); }
      });
    });
    list.addEventListener('pointermove', pos);
    list.addEventListener('pointerleave', () => { shown = false; gsap.to(preview, { autoAlpha: 0, scale: 0.92, duration: 0.25 }); });
  }

  /* ---------- Reel: inset frame opens to full-bleed ---------- */
  const reel = document.querySelector('.reel');
  if (reel && hasGsap && !reduce && matchMedia('(min-width: 801px)').matches) {
    gsap.fromTo('.reel__video', { clipPath: 'inset(18% 24%)' }, {
      clipPath: 'inset(0% 0%)', ease: 'none',
      scrollTrigger: { trigger: reel, start: 'top top', end: 'bottom bottom', scrub: true },
    });
  }

  /* Keep ScrollTrigger in sync as lazy media settles. */
  if (hasGsap) {
    let t; new ResizeObserver(() => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 200); }).observe(document.body);
  }
})();
