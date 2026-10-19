/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { speed: 0.2, axis: 'y', disableBelow: 0 };
  (P.q = P.q || []).push(['parallax', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('parallax', k, DEF[k], el, 'parallax') : DEF[k]; }
  var els = [], tk;

  function upd() {
    tk = 0;
    var h = innerHeight, w = innerWidth;
    els.forEach(function (e) {
      if (w < O('disableBelow', e)) { e.style.transform = ''; return; }
      var r = e.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) return;
      var k = parseFloat(e.dataset.parallax);
      if (isNaN(k)) k = O('speed', e);
      var off = (r.top + r.height / 2 - h / 2) * k;
      e.style.transform = O('axis', e) === 'x' ? 'translate3d(' + (-off).toFixed(1) + 'px,0,0)' : 'translate3d(0,' + (-off).toFixed(1) + 'px,0)';
    });
  }
  function req() { tk || (tk = requestAnimationFrame(upd)); }

  P.Parallax = {
    init: function (r) {
      if (P.reduced ? P.reduced() : matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      els = [].slice.call((r || document).querySelectorAll('[data-parallax]'));
      els.forEach(function (e) { e.style.willChange = 'transform'; });
      if (els.length) upd();
    },
    update: upd,
    destroy: function () { els.forEach(function (e) { e.style.transform = ''; e.style.willChange = ''; }); els = []; }
  };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  document.addEventListener('DOMContentLoaded', function () { P.Parallax.init(); });
})();
