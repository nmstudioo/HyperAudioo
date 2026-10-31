'use strict';
/* HyperAudio docs reader.
   A small, dependency-free Markdown renderer for the repository documents.
   Supports: headings, paragraphs, lists, tables, fenced code, blockquotes and
   GitHub alerts, links, images, emphasis, and a safe whitelist of the inline
   and block HTML that GitHub renders (<div align>, <sub>, <b>, <br> …).
   Anything outside the whitelist is escaped, never executed. */
(() => {

/* == Escaping and entities == */
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', copy: '©', reg: '®', middot: '·', bull: '•', mdash: '—', ndash: '–', hellip: '…', times: '×', rarr: '→', larr: '←', deg: '°', plusmn: '±', micro: 'µ' };
const unent = s => s.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') {
    const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1);
    return n > 0 && n < 0x110000 && !(n >= 0xd800 && n < 0xe000) ? String.fromCodePoint(n) : m;
  }
  return ENT[e.toLowerCase()] ?? m;
});

/* == Paths and links == */
const REPO = 'https://github.com/nmstudioo/HyperAudioo/blob/main/';
const XI = '<svg class="i xs" aria-hidden="true"><use href="#i-ext"/></svg>';
const icon = (id, c = 'xs') => `<svg class="i ${c}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const isUrl = u => /^(https?|mailto):/i.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u);
const resolve = (u, base) => {
  try {
    const p = decodeURIComponent(new URL(u.split('#')[0].split('?')[0], 'http://x/' + base).pathname.slice(1));
    return /(^|\/)\.\.(\/|$)/.test(p) ? '' : p;
  } catch { return ''; }
};
const docPath = (u, base) => {
  if (/^[a-z][a-z0-9+.-]*:|^#/i.test(u)) return '';
  const p = resolve(u, base);
  return /\.md$/i.test(p) ? p : '';
};

/* == Inline == */
const INLINE_TAGS = 'b|strong|i|em|u|sub|sup|small|mark|kbd|code|del|s';

function inline(t, base) {
  const st = [], hold = h => `\0${st.push(h) - 1}\0`;
  // code spans first, so nothing inside them is interpreted
  t = t.replace(/(`+)([\s\S]*?[^`])\1(?!`)/g, (_, a, c) => hold(`<code>${esc(c.trim())}</code>`));
  // images
  t = t.replace(/!\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g, (m, alt, u) => {
    if (/^https:/i.test(u)) return hold(`<img src="${esc(u)}" alt="${esc(alt)}" loading="lazy" decoding="async">`);
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return alt;
    const p = resolve(u, base);
    return p ? hold(`<img src="${esc(p)}" alt="${esc(alt)}" loading="lazy" decoding="async">`) : alt;
  });
  // links
  t = t.replace(/\[([^\]]+)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/g, (m, x, u) => {
    if (!isUrl(u)) return x;
    const d = docPath(u, base), ext = /^https?:/i.test(u);
    const href = d ? REPO + d : ext || /^(mailto:|#)/i.test(u) ? u : REPO + resolve(u, base);
    return hold(`<a href="${esc(href)}"${d ? ` data-doc="${esc(d)}"` : ''}${ext ? ' rel="noopener" target="_blank"' : ''}>${inline(x, base)}${ext ? XI : ''}</a>`);
  });
  // whitelisted inline HTML: only balanced, attribute-free pairs survive
  t = t.replace(/<br\s*\/?>/gi, () => hold('<br>'));
  const pair = new RegExp(`<(${INLINE_TAGS})>([\\s\\S]*?)<\\/\\1>`, 'gi');
  for (let n = 0; n < 3 && pair.test(t); n++) {
    pair.lastIndex = 0;
    t = t.replace(pair, (m, tg, c) => hold(`<${tg.toLowerCase()}>`) + c + hold(`</${tg.toLowerCase()}>`));
  }
  // bare URLs
  t = t.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:])/g, (m, a, u) => a + hold(`<a href="${esc(u)}" rel="noopener" target="_blank">${esc(u)}${XI}</a>`));
  t = esc(unent(t));
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^\w])__([^_]+)__(?!\w)/g, '$1<strong>$2</strong>');
  t = t.replace(/(^|[^\w*])\*([^*\s][^*]*?)\*(?![\w*])/g, '$1<em>$2</em>').replace(/(^|[^\w])_([^_\s][^_]*?)_(?![\w])/g, '$1<em>$2</em>');
  t = t.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return t.replace(/\0(\d+)\0/g, (_, i) => st[i]);
}

/* == Tables == */
function cells(r) {
  r = r.trim().replace(/^\|/, '').replace(/\|$/, '');
  const o = [];
  let c = '', k = false;
  for (let i = 0; i < r.length; i++) {
    const ch = r[i];
    if (ch === '`') k = !k;
    if (ch === '\\' && r[i + 1] === '|') { c += '|'; i++; }
    else if (ch === '|' && !k) { o.push(c.trim()); c = ''; }
    else c += ch;
  }
  o.push(c.trim());
  return o;
}

/* == Diagrams: linear Mermaid flowcharts become a native node chain == */
function flowchart(src) {
  const lines = src.split('\n').map(s => s.trim()).filter(Boolean);
  if (!/^(flowchart|graph)\s+(LR|TD|TB|RL|BT)\b/i.test(lines[0] || '')) return '';
  const nodes = new Map(), out = new Map(), inn = new Map();
  const edge = /^(\w+)(?:\[(?:"([^"]*)"|([^\]]*))\])?\s*-->\s*(?:\|[^|]*\|\s*)?(\w+)(?:\[(?:"([^"]*)"|([^\]]*))\])?\s*;?$/;
  for (const l of lines.slice(1)) {
    const m = edge.exec(l);
    if (!m) return '';
    const [, a, a1, a2, b, b1, b2] = m;
    for (const [id, lab] of [[a, a1 ?? a2], [b, b1 ?? b2]]) if (!nodes.has(id) || lab) nodes.set(id, lab ?? nodes.get(id) ?? id);
    if (out.has(a) || inn.has(b)) return '';
    out.set(a, b); inn.set(b, a);
  }
  const start = [...nodes.keys()].find(k => !inn.has(k));
  if (!start) return '';
  const chain = [];
  for (let k = start; k; k = out.get(k)) { chain.push(k); if (chain.length > 12) return ''; }
  if (chain.length !== nodes.size) return '';
  const li = chain.map((k, i) => {
    const [h, ...rest] = nodes.get(k).split(/<br\s*\/?>/i).map(s => s.trim());
    return `<li${i === 0 || i === chain.length - 1 ? ' class="end"' : ''}><b>${esc(unent(h))}</b>${rest.length ? `<small>${esc(unent(rest.join(' ')))}</small>` : ''}</li>`;
  }).join('');
  return `<figure class="flow" role="group" aria-label="Signal flow"><ol>${li}</ol></figure>`;
}

const ALERT_ICON = { note: 'book', tip: 'check', important: 'scroll', warning: 'alert', caution: 'alert' };
const ALERT_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i;
const alertBox = (kind, inner) => `<aside class="alert ${kind}" role="note"><p class="alert-t">${icon(ALERT_ICON[kind], 'xs')}${kind}</p>${inner}</aside>`;

/* == Markdown == */
function md(src, base = '') {
  const L = src.replace(/\r\n?/g, '\n').split('\n'), o = [];
  const blank = l => !l.trim(),
    fence = /^\s*(```+|~~~+)\s*([\w-]*)\s*$/,
    head = /^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/,
    hr = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/,
    li = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/,
    sep = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/,
    htmlBlk = /^\s*<(div|p|center)\b([^>]*)>/i,
    ind = l => l.match(/^\s*/)[0].replace(/\t/g, '    ').length;
  const brk = (l, n) => fence.test(l) || head.test(l) || hr.test(l) || /^\s{0,3}>/.test(l) || li.test(l) || htmlBlk.test(l) || (l.includes('|') && n != null && sep.test(n));

  function list(ls) {
    const i0 = ind(ls[0]), gs = [];
    for (const l of ls) {
      const m = li.exec(l);
      if (m && ind(l) < i0 + 2) {
        const ol = /\d/.test(m[2]);
        if (!gs.length || gs[gs.length - 1].ol != ol) gs.push({ ol, items: [] });
        gs[gs.length - 1].items.push({ t: m[3], s: [] });
      } else {
        const its = gs[gs.length - 1].items, it = its[its.length - 1];
        if (m || ind(l) >= i0 + 2 || blank(l) || it.s.length) it.s.push(l);
        else it.t += ' ' + l.trim();
      }
    }
    return gs.map(g => {
      const tag = g.ol ? 'ol' : 'ul';
      return `<${tag}>${g.items.map(it => {
        const s = it.s.map(x => x.slice(Math.min(i0 + 2, ind(x)))).filter((x, i, a) => x.trim() || i < a.length - 1);
        const inner = s.length ? (li.test(s[0]) ? list(s.filter(x => x.trim())) : md(s.join('\n'), base)) : '';
        return `<li>${inline(it.t, base)}${inner}</li>`;
      }).join('')}</${tag}>`;
    }).join('');
  }

  const codeBlock = (lang, code) => {
    if (lang === 'mermaid') { const f = flowchart(code); if (f) return f; }
    return `<figure class="codeblk"><figcaption><span>${esc(lang || 'text')}</span><button type="button" data-copy aria-label="Copy code">${icon('copy')}<span>Copy</span></button></figcaption><pre tabindex="0"><code>${esc(code)}</code></pre></figure>`;
  };

  let i = 0;
  while (i < L.length) {
    const l = L[i];
    let m;
    if (blank(l)) { i++; continue; }

    if ((m = fence.exec(l))) {
      const c = [], q = m[1][0], lang = (m[2] || '').toLowerCase();
      i++;
      while (i < L.length && !new RegExp('^\\s*' + q + '{3,}\\s*$').test(L[i])) c.push(L[i++]);
      i++;
      o.push(codeBlock(lang, c.join('\n')));
      continue;
    }
    if ((m = head.exec(l))) { o.push(`<h${m[1].length}>${inline(m[2], base)}</h${m[1].length}>`); i++; continue; }
    if (hr.test(l)) { o.push('<hr>'); i++; continue; }

    if ((m = htmlBlk.exec(l))) {
      // <div align="center"> … </div> and friends: keep alignment, render the inside as Markdown
      let depth = 0;
      const buf = [];
      while (i < L.length) {
        const ln = L[i++];
        buf.push(ln);
        depth += (ln.match(/<(div|p|center)\b[^>]*>/gi) || []).length - (ln.match(/<\/(div|p|center)>/gi) || []).length;
        if (depth <= 0) break;
      }
      const al = /align\s*=\s*["']?(center|right|left)/i.exec(m[2]);
      const a = al ? al[1].toLowerCase() : m[1].toLowerCase() === 'center' ? 'center' : '';
      const inner = buf.join('\n').replace(/^\s*<(div|p|center)\b[^>]*>/i, '').replace(/<\/(div|p|center)>\s*$/i, '');
      o.push(`<div class="hblk${a ? ' a-' + a : ''}">${md(inner, base)}</div>`);
      continue;
    }

    if (/^( {4}|\t)/.test(l)) {
      const c = [];
      while (i < L.length && (/^( {4}|\t)/.test(L[i]) || (blank(L[i]) && /^( {4}|\t)/.test(L[i + 1] || '')))) c.push(L[i++].replace(/^( {4}|\t)/, ''));
      o.push(codeBlock('', c.join('\n')));
      continue;
    }

    if (/^\s{0,3}>/.test(l)) {
      const c = [];
      while (i < L.length && !blank(L[i])) c.push(L[i++].replace(/^\s{0,3}>\s?/, ''));
      const a = ALERT_RE.exec(c[0]);
      if (a) c.shift();
      const inner = md(c.join('\n'), base);
      o.push(a ? alertBox(a[1].toLowerCase(), inner) : `<blockquote>${inner}</blockquote>`);
      continue;
    }

    if (l.includes('|') && i + 1 < L.length && sep.test(L[i + 1]) && L[i + 1].includes('-')) {
      const h = cells(l), al = cells(L[i + 1]).map(x => /^:-+:$/.test(x) ? ' class="c"' : /-:$/.test(x) ? ' class="r"' : '');
      i += 2;
      const rows = [];
      while (i < L.length && !blank(L[i]) && L[i].includes('|')) rows.push(cells(L[i++]));
      o.push(`<div class="tbl" tabindex="0"><table><thead><tr>${h.map((x, j) => `<th${al[j] || ''}>${inline(x, base)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${h.map((_, j) => `<td${al[j] || ''}>${inline(r[j] || '', base)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }

    if (li.test(l)) {
      const c = [];
      while (i < L.length) {
        if (blank(L[i])) {
          let j = i;
          while (j < L.length && blank(L[j])) j++;
          if (j < L.length && (li.test(L[j]) || ind(L[j]) >= 2) && ind(L[j]) >= ind(c[0] || '')) { c.push(L[i]); i++; continue; }
          break;
        }
        if (c.length && !li.test(L[i]) && ind(L[i]) < 2 && brk(L[i], L[i + 1])) break;
        c.push(L[i++]);
      }
      o.push(list(c));
      continue;
    }

    // paragraph (also tolerates an alert marker written without the leading ">")
    const p = [l];
    i++;
    while (i < L.length && !blank(L[i]) && !brk(L[i], L[i + 1])) p.push(L[i++]);
    const bare = ALERT_RE.exec(p[0].trim());
    if (bare && p.length > 1) {
      o.push(alertBox(bare[1].toLowerCase(), md(p.slice(1).join('\n'), base)));
      continue;
    }
    o.push(`<p>${p.map((x, j) => inline(x.trim(), base) + (j < p.length - 1 && /( {2,}|\\)$/.test(x) ? '<br>' : '')).join(' ')}</p>`);
  }
  return o.join('');
}

/* == Reader == */
const R = document.getElementById('reader');
if (R && R.showModal) {
  const body = document.getElementById('readerBody'), pathEl = document.getElementById('readerPath'),
    gh = document.getElementById('readerGh'), cache = {};
  let cur = '', depth = 0;

  const slug = (t, n) => (t.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') || 'section') + '-' + n;

  // "On this page": a collapsible outline for longer documents
  function outline() {
    const hs = [...body.querySelectorAll('h2')];
    if (hs.length < 3) return;
    hs.forEach((h, n) => { h.id = slug(h.textContent, n); });
    const d = document.createElement('details');
    d.className = 'toc';
    d.innerHTML = `<summary>${icon('list', 'xs')}<span>On this page</span><b>${hs.length}</b>${icon('chev', 'xs chev')}</summary><ol>${hs.map(h => `<li><a href="#${h.id}" data-jump="${h.id}">${esc(h.textContent)}</a></li>`).join('')}</ol>`;
    const first = body.querySelector('h1');
    first ? first.after(d) : body.prepend(d);
  }

  const put = h => {
    body.innerHTML = h;
    outline();
    body.classList.remove('fade');
    void body.offsetWidth;
    body.classList.add('fade');
    progress();
  };

  const progress = () => {
    const max = body.scrollHeight - body.clientHeight;
    R.style.setProperty('--rp', max > 0 ? Math.min(1, body.scrollTop / max).toFixed(4) : 0);
  };
  body.addEventListener('scroll', () => requestAnimationFrame(progress), { passive: true });

  const hashDoc = () => {
    let h = '';
    try { h = decodeURIComponent(location.hash); } catch {}
    const m = /^#read\/(.+)$/.exec(h);
    return m ? docPath(m[1], '') : '';
  };

  async function show(p) {
    cur = p;
    pathEl.textContent = p;
    gh.href = REPO + p;
    if (!R.open) R.showModal();
    body.scrollTop = 0;
    body.setAttribute('aria-busy', 'true');
    body.innerHTML = '<p class="lbl">Loading…</p>';
    try {
      if (!cache[p]) {
        const r = await fetch(p);
        if (!r.ok) throw Error('HTTP ' + r.status);
        cache[p] = md(await r.text(), p);
      }
      if (cur == p) put(cache[p]);
    } catch (e) {
      if (cur == p) put(`<p class="lbl">Could not load ${esc(p)} (${esc(e.message)})</p><p><a href="${REPO + esc(p)}" rel="noopener">Open on GitHub${XI}</a></p>`);
    } finally {
      if (cur == p) body.removeAttribute('aria-busy');
    }
  }

  function open(p) {
    history.pushState(null, '', '#read/' + p);
    depth++;
    show(p);
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-doc]');
    if (a && !e.button && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      const p = docPath(a.dataset.doc, '');
      if (p) open(p);
      return;
    }
    const j = e.target.closest('a[data-jump]');
    if (j) {
      e.preventDefault();
      const t = document.getElementById(j.dataset.jump);
      if (t) {
        const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
        body.scrollTo({ top: t.offsetTop - 16, behavior: calm ? 'auto' : 'smooth' });
        j.closest('details').open = false;
      }
      return;
    }
    const c = e.target.closest('[data-copy]');
    if (c) {
      const code = c.closest('.codeblk').querySelector('code').textContent;
      const done = ok => {
        const s = c.querySelector('span');
        s.textContent = ok ? 'Copied' : 'Failed';
        c.classList.toggle('done', ok);
        setTimeout(() => { s.textContent = 'Copy'; c.classList.remove('done'); }, 1400);
      };
      (typeof copyText === 'function' ? copyText(code) : navigator.clipboard.writeText(code).then(() => true, () => false)).then(done);
    }
  });

  document.getElementById('readerClose').addEventListener('click', () => R.close());
  R.addEventListener('click', e => { if (e.target == R) R.close(); });
  R.addEventListener('close', () => {
    const d = depth;
    depth = 0;
    if (hashDoc()) {
      if (d) history.go(-d);
      else history.replaceState(null, '', location.pathname + location.search);
    }
  });
  addEventListener('popstate', () => {
    const p = hashDoc();
    if (p) show(p);
    else if (R.open) { depth = 0; R.close(); }
  });
  const p0 = hashDoc();
  if (p0) show(p0);
}

/* exposed for offline testing */
if (typeof window !== 'undefined') window.__md = md;
})();
