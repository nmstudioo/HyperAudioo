/* HyperAudio enhancements.
   Progressive and defensive: the page works without this file. Independent of script.js. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
const secs = $$('main .sec'), links = $$('.nav a[href^="#"]');

/* == Signature: the page is a 20 Hz → 20 kHz sweep ==
   Scroll position maps to frequency on a log scale. The bar shows progress,
   the readout shows where on the sweep you are and which section you are in. */
const bar = document.createElement('div');
bar.id = 'sweep';
bar.setAttribute('aria-hidden', 'true');
const rd = document.createElement('div');
rd.id = 'read';
rd.setAttribute('aria-hidden', 'true');
rd.title = 'J / K: next or previous section. T: theme.';
rd.innerHTML = '<span>§<b id="rdN">00</b></span><b id="rdF">20 Hz</b>';
document.body.append(bar, rd);
const rdN = $('#rdN', rd), rdF = $('#rdF', rd);
const fmt = f => f < 1000 ? Math.round(f) + ' Hz' : (f < 10000 ? (f / 1000).toFixed(2) : (f / 1000).toFixed(1)) + ' kHz';

let cur = -1, tick = false;
const update = () => {
  tick = false;
  const h = document.documentElement, max = h.scrollHeight - innerHeight,
    p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  bar.style.setProperty('--p', p.toFixed(4));
  rdF.textContent = fmt(20 * Math.pow(1000, p));
};
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
addEventListener('resize', update, { passive: true });
update();

/* == Scrollspy: the section crossing the upper third of the viewport is current == */
const setCur = s => {
  if (!s) return;
  cur = secs.indexOf(s);
  const n = $('.sec-h .lbl', s);
  rdN.textContent = n ? n.textContent.trim() : String(cur + 1).padStart(2, '0');
  links.forEach(a => a.getAttribute('href') === '#' + s.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  const on = $('.nav a[aria-current="true"]');
  if (on && innerWidth < 900) {
    const nav = on.parentElement;
    nav.scrollTo({ left: on.offsetLeft - nav.clientWidth / 2 + on.offsetWidth / 2, behavior: calm() ? 'auto' : 'smooth' });
  }
};
if ('IntersectionObserver' in window && secs.length) {
  const vis = new Set(), io = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target));
    const pick = secs.filter(s => vis.has(s)).pop();
    if (pick) setCur(pick);
    else if (scrollY < innerHeight * .4) { cur = -1; rdN.textContent = '00'; links.forEach(a => a.removeAttribute('aria-current')); }
  }, { rootMargin: '-30% 0px -60% 0px' });
  secs.forEach(s => io.observe(s));
}

/* == Keyboard: j / k move between sections, t toggles theme == */
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
  const t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  if (typing || $('dialog[open]')) return;
  const k = e.key.toLowerCase();
  if (k === 'j' || k === 'k') {
    const i = Math.min(secs.length - 1, Math.max(0, cur + (k === 'j' ? 1 : -1)));
    secs[i] && secs[i].scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' });
    e.preventDefault();
  } else if (k === 't') {
    const b = $('#themeBtn');
    b && b.click();
  }
});

/* == Warm the cache for docs so the reader opens instantly == */
const warmed = new Set(), warm = a => {
  const p = a.dataset.doc;
  if (!p || warmed.has(p)) return;
  warmed.add(p);
  const l = document.createElement('link');
  l.rel = 'prefetch';
  l.href = p;
  document.head.append(l);
};
$$('[data-doc]').forEach(a => {
  a.addEventListener('pointerenter', () => warm(a), { once: true, passive: true });
  a.addEventListener('focus', () => warm(a), { once: true });
});

/* == Figures: tap a chart to inspect it full size == */
const figs = $$('.x-fig');
if (figs.length && window.HTMLDialogElement) {
  const dlg = document.createElement('dialog');
  dlg.className = 'zoom';
  dlg.setAttribute('aria-label', 'Image viewer');
  dlg.innerHTML = '<form method="dialog"><p></p><button class="round" value="close" aria-label="Close image"><svg class="i" aria-hidden="true"><use href="#i-close"/></svg></button></form><img alt="">';
  document.body.append(dlg);
  const big = $('img', dlg), cap = $('p', dlg);
  figs.forEach(f => {
    const img = $('img', f);
    if (!img) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Enlarge: ' + (img.alt || 'figure'));
    img.replaceWith(b);
    b.append(img);
    b.addEventListener('click', () => {
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      cap.textContent = img.alt;
      dlg.showModal();
    });
  });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
}

/* == Integrity hashes: tap a row to copy == */
$$('[data-h]').forEach(b => b.addEventListener('click', () => {
  const v = b.dataset.h, s = b.firstElementChild, o = s.textContent;
  const ok = () => {
    s.textContent = 'Copied';
    b.classList.add('done');
    setTimeout(() => { s.textContent = o; b.classList.remove('done'); }, 1400);
  };
  const copy = typeof copyText === 'function' ? copyText(v) : navigator.clipboard.writeText(v).then(() => true, () => false);
  copy.then(good => good && ok());
}));
})();
