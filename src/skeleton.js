/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { delay: 600, minDuration: 0 };
  (P.q = P.q || []).push(['skeleton', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('skeleton', k, DEF[k], el) : DEF[k]; }
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

  function done(el) {
    var wait = Math.max(0, O('minDuration', el) - (Date.now() - (el._k0 || 0)));
    setTimeout(function () {
      el.classList.remove('is-loading');
      el.removeAttribute('aria-busy');
      E('skeleton:done', { element: el }, el);
    }, wait);
  }
  function start(el) {
    el._k0 = Date.now();
    el.classList.add('is-loading');
    el.setAttribute('aria-busy', 'true');
  }

  P.Skeleton = {
    done: done,
    start: start,
    init: function (r) {
      all(r, '[data-skeleton]').forEach(function (el) {
        if (el._k) return;
        el._k = 1;
        start(el);
        if (el.dataset.skeleton === 'manual') return;
        var im = [].slice.call(el.querySelectorAll('img')), n = im.length;
        if (!n) { setTimeout(function () { done(el); }, O('delay', el)); return; }
        function one() { --n <= 0 && done(el); }
        im.forEach(function (i) {
          i.complete && i.naturalWidth ? one() : (i.addEventListener('load', one), i.addEventListener('error', one));
        });
      });
    }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Skeleton.init(); });
})();
