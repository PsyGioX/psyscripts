/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { source: 'main', levels: 'h2,h3', numbered: false, title: '', idPrefix: '', collapsible: true, label: 'Contents' };
  (P.q = P.q || []).push(['toc', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('toc', k, DEF[k], el, 'toc') : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }
  function all(r, sel) {
    r = r || document;
    var a = [].slice.call(r.querySelectorAll(sel));
    if (r.matches && r.matches(sel)) a.unshift(r);
    return a;
  }
  function slug(t, u) {
    var s = t.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section', b = s, n = 1;
    while (u[s]) s = b + '-' + (++n);
    u[s] = 1;
    return s;
  }

  var MQ = window.matchMedia ? matchMedia('(max-width: 860px)') : { matches: false };
  var uid = 0;
  /* caption of the mobile bar: title option -> aria-label of the container (translated by I18n) -> label option */
  function caption(box) { return O('title', box) || box.getAttribute('aria-label') || O('label', box) || 'Contents'; }
  function setOpen(box, on) {
    if (!box._b || box.classList.contains('is-open') === on) return;
    box.classList.toggle('is-open', on);
    box._b.setAttribute('aria-expanded', on ? 'true' : 'false');
    E('toc:toggle', { toc: box, open: on }, box);
  }
  /* height of the sticky mobile bar is published as --psy-toc-h so scroll-padding can clear it */
  function measure() {
    var h = 0;
    [].forEach.call(document.querySelectorAll('[data-toc]'), function (b) {
      if (MQ.matches && b._b && b.hasAttribute('data-sticky')) h = Math.max(h, Math.round(b.getBoundingClientRect().height));
    });
    document.documentElement.style.setProperty('--psy-toc-h', h + 'px');
  }
  function current(box, text) { if (box._c) box._c.textContent = text || ''; }

  function build(box) {
    if (box._t) return;
    box._t = 1;
    var src = P.sel ? P.sel(O('source', box)) : null, hs = src ? P.selAll(O('levels', box), src) : [];
    var used = {}, ul = document.createElement('ul');
    [].forEach.call(document.querySelectorAll('[id]'), function (e) { used[e.id] = 1; });
    var title = O('title', box), panel = box;
    if (!box.hasAttribute('role') && box.tagName !== 'NAV') box.setAttribute('role', 'navigation');
    if (O('collapsible', box)) {
      var pid = 'psy-toc-' + (++uid), b = document.createElement('button'), l = document.createElement('span'), c = document.createElement('span'), i = document.createElement('i');
      b.type = 'button'; b.className = 'psy-toc__toggle';
      b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', pid);
      l.className = 'psy-toc__label'; l.textContent = caption(box);
      c.className = 'psy-toc__current';
      i.className = 'psy-ico psy-ico--chevron-down'; i.setAttribute('aria-hidden', 'true');
      b.appendChild(l); b.appendChild(c); b.appendChild(i);
      panel = document.createElement('div');
      panel.className = 'psy-toc__panel'; panel.id = pid;
      box.appendChild(b); box.appendChild(panel);
      box._b = b; box._l = l; box._c = c;
      b.addEventListener('click', function () { setOpen(box, !box.classList.contains('is-open')); });
    }
    if (title) {
      var t = document.createElement('p');
      t.className = 'psy-toc__title';
      t.textContent = title;
      panel.appendChild(t);
    }
    box._h = [];
    [].forEach.call(hs, function (h) {
      /* idPrefix guards against DOM clobbering (an id such as "name" or "forms" can shadow window/document properties) */
      if (!h.id) h.id = O('idPrefix', box) + slug(h.textContent, used);
      var li = document.createElement('li'), a = document.createElement('a');
      li.className = 'toc-' + h.tagName.toLowerCase();
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      ul.appendChild(li);
      box._h.push([a, h]);
    });
    ul.className = 'psy-toc__list' + (O('numbered', box) ? ' is-numbered' : '');
    panel.appendChild(ul);
    if (hs.length) current(box, hs[0].textContent);
    box.setAttribute('data-spy', '');
    P.Spy && P.Spy.init(box);
    measure();
    E('toc:ready', { toc: box, count: hs.length }, box);
  }

  /* keep the bar in sync: active section, link clicks, Escape, outside tap, language change, viewport changes */
  document.addEventListener('psy:spy:change', function (e) {
    var box = e.target && e.target.closest && e.target.closest('[data-toc]');
    if (box && e.detail && e.detail.link) current(box, e.detail.link.textContent);
  });
  document.addEventListener('click', function (e) {
    [].forEach.call(document.querySelectorAll('[data-toc].is-open'), function (b) {
      if (!b.contains(e.target) || e.target.closest('.psy-toc__panel a')) setOpen(b, false);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    [].forEach.call(document.querySelectorAll('[data-toc].is-open'), function (b) { setOpen(b, false); b._b && b._b.focus(); });
  });
  document.addEventListener('psy:lang', function () {
    /* I18n re-translates headings: refresh link texts and captions without rebuilding the list */
    setTimeout(function () {
      [].forEach.call(document.querySelectorAll('[data-toc]'), function (b) {
        (b._h || []).forEach(function (x) { x[0].textContent = x[1].textContent; });
        if (b._l) b._l.textContent = caption(b);
        var a = b.querySelector('a.is-active');
        if (a) current(b, a.textContent); else if (b._h && b._h[0]) current(b, b._h[0][1].textContent);
      });
      measure();
    }, 0);
  });
  var rt;
  function onResize() {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (!MQ.matches) [].forEach.call(document.querySelectorAll('[data-toc].is-open'), function (b) { setOpen(b, false); });
      measure();
    }, 60);
  }
  addEventListener('resize', onResize);
  addEventListener('orientationchange', onResize);

  P.TOC = {
    init: function (r) { all(r, '[data-toc]').forEach(build); },
    refresh: function (box) {
      box = box || document.querySelector('[data-toc]');
      if (!box) return;
      P.Spy && P.Spy.destroy(box);
      box.textContent = '';
      box.classList.remove('is-open');
      box._t = 0; box._b = box._l = box._c = null; box._h = [];
      build(box);
    },
    destroy: function (r) {
      all(r, '[data-toc]').forEach(function (b) { P.Spy && P.Spy.destroy(b); b.textContent = ''; b.classList.remove('is-open'); b._t = 0; b._b = b._l = b._c = null; b._h = []; });
      measure();
    }
  };
  document.addEventListener('DOMContentLoaded', function () { P.TOC.init(); });
})();
