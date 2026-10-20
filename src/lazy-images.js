/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { rootMargin: '200px', threshold: 0 };
  (P.q = P.q || []).push(['lazy', DEF]);
  function O(k) { return P.cfg ? P.cfg('lazy', k, DEF[k]) : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }
  var SEL = 'img[data-src],img[data-srcset],source[data-srcset],[data-bg]';
  var io;

  function load(el) {
    if (el._l) return;
    el._l = 1;
    var U = function (u) { return P.url ? P.url(u, { schemes: ['http:', 'https:', 'blob:', 'data:'] }) : u; };
    /* srcset is a list of "url descriptor" candidates: every URL is checked */
    var SS = function (v) {
      return String(v || '').split(',').map(function (c) { c = c.trim().split(/\s+/); var u = U(c[0]); return u ? [u].concat(c.slice(1)).join(' ') : ''; }).filter(Boolean).join(', ');
    };
    if (el.tagName === 'SOURCE') { el.srcset = SS(el.dataset.srcset); return; }
    if (el.dataset.bg) {
      var bg = U(el.dataset.bg);
      if (!bg) { E('lazy:error', { element: el }, el); return; }
      el.style.backgroundImage = 'url("' + bg.replace(/[\\"\n\r]/g, function (c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase(); }) + '")';
      el.classList.add('is-loaded');
      E('lazy:load', { element: el }, el);
      return;
    }
    var pic = el.parentNode && el.parentNode.tagName === 'PICTURE' ? el.parentNode : null;
    if (pic) [].forEach.call(pic.querySelectorAll('source[data-srcset]'), load);
    el.addEventListener('load', function () { el.classList.add('is-loaded'); E('lazy:load', { element: el }, el); }, { once: true });
    el.addEventListener('error', function () { E('lazy:error', { element: el }, el); }, { once: true });
    if (el.dataset.srcset) el.srcset = SS(el.dataset.srcset);
    if (el.dataset.src) { var s = U(el.dataset.src); if (s) el.src = s; else E('lazy:error', { element: el }, el); }
  }
  P.Lazy = {
    load: load,
    init: function (r) {
      var l = [].slice.call((r || document).querySelectorAll(SEL)).filter(function (e) { return !e._l && e.tagName !== 'SOURCE'; });
      if (!('IntersectionObserver' in window)) { l.forEach(load); return; }
      io = io || new IntersectionObserver(function (a) {
        a.forEach(function (x) { if (x.isIntersecting) { load(x.target); io.unobserve(x.target); } });
      }, { rootMargin: O('rootMargin'), threshold: O('threshold') });
      l.forEach(function (i) { io.observe(i); });
    },
    destroy: function () { io && io.disconnect(); io = null; }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Lazy.init(); });
})();
