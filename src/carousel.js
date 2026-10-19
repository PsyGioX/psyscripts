/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    autoplay: 0, loop: true, pauseOnHover: true, dots: true, arrows: true, perView: 1,
    breakpoints: {}, gap: 16, labelSlide: 'Slide {n}', labelRegion: 'Carousel'
  };
  (P.q = P.q || []).push(['carousel', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('carousel', k, DEF[k], el) : DEF[k]; }
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
  function reduced() { return P.reduced ? P.reduced() : matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function build(c) {
    if (c._c) return c._c;
    var tr = c.querySelector('[data-track]'), sl = [].slice.call(tr.children), dots = c.querySelector('[data-dots]');
    var prevB = c.querySelector('[data-prev]'), nextB = c.querySelector('[data-next]');
    var i = 0, tm = 0, timer = 0, playing = false, pv = 1;
    var offs = [];
    function on(t, ev, fn, o) { t.addEventListener(ev, fn, o); offs.push(function () { t.removeEventListener(ev, fn, o); }); }

    tr.tabIndex = 0;
    tr.setAttribute('role', 'region');
    tr.setAttribute('aria-roledescription', 'carousel');
    tr.setAttribute('aria-label', O('labelRegion', c));
    sl.forEach(function (s, k) {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', (k + 1) + ' / ' + sl.length);
    });
    c.style.setProperty('--psy-gap', O('gap', c) + 'px');

    function perView() {
      var v = O('perView', c);
      if (c.hasAttribute('data-multi') && !c.hasAttribute('data-per-view')) v = innerWidth >= 760 ? 2 : 1;
      var bp = O('breakpoints', c), keys = Object.keys(bp || {}).map(Number).sort(function (a, b) { return a - b; });
      keys.forEach(function (w) { if (innerWidth >= w) v = bp[w]; });
      return Math.max(1, Math.min(sl.length, +v || 1));
    }
    function pages() { return Math.max(1, sl.length - pv + 1); }
    function buildDots() {
      if (!dots) return;
      dots.innerHTML = '';
      dots.hidden = !O('dots', c) || pages() < 2;
      for (var k = 0; k < pages(); k++) {
        (function (k) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', O('labelSlide', c).replace('{n}', k + 1));
          b.onclick = function () { go(k); };
          dots.appendChild(b);
        })(k);
      }
    }
    function layout() {
      pv = perView();
      c.style.setProperty('--psy-slides', pv);
      var hide = !O('arrows', c) || pages() < 2;
      if (prevB) prevB.hidden = hide;
      if (nextB) nextB.hidden = hide;
      buildDots();
      mark();
    }
    function go(n, silent) {
      var max = pages() - 1;
      n = O('loop', c) ? (n + pages()) % pages() : Math.max(0, Math.min(max, n));
      i = n;
      tr.scrollTo({ left: sl[n].offsetLeft - tr.offsetLeft, behavior: reduced() || silent ? 'auto' : 'smooth' });
      return n;
    }
    function mark() {
      var n = 0, m = 1e9;
      sl.forEach(function (s, k) {
        var d = Math.abs(s.offsetLeft - tr.offsetLeft - tr.scrollLeft);
        if (d < m) { m = d; n = k; }
      });
      n = Math.min(n, pages() - 1);
      var changed = n !== i || !c._mk;
      i = n;
      c._mk = 1;
      if (dots) [].forEach.call(dots.children, function (b, k) { b.setAttribute('aria-current', k === n); });
      if (!O('loop', c)) {
        if (prevB) prevB.disabled = n === 0;
        if (nextB) nextB.disabled = n >= pages() - 1;
      }
      if (changed) E('carousel:change', { index: n, slide: sl[n] }, c);
    }
    function play() {
      var ms = +c.dataset.autoplay || O('autoplay', c);
      if (!ms || playing || reduced()) return;
      playing = true;
      timer = setInterval(function () {
        if (document.hidden || (O('pauseOnHover', c) && c.matches(':hover,:focus-within'))) return;
        go(i + 1);
      }, ms);
    }
    function pause() { clearInterval(timer); playing = false; }

    if (prevB) on(prevB, 'click', function () { go(i - 1); });
    if (nextB) on(nextB, 'click', function () { go(i + 1); });
    on(tr, 'scroll', function () { clearTimeout(tm); tm = setTimeout(mark, 60); }, { passive: true });
    on(tr, 'keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      if (e.key === 'Home') { e.preventDefault(); go(0); }
      if (e.key === 'End') { e.preventDefault(); go(pages() - 1); }
    });
    var rt;
    on(window, 'resize', function () { clearTimeout(rt); rt = setTimeout(function () { layout(); go(i, true); }, 120); });

    layout();
    play();
    var inst = {
      el: c, slides: sl,
      go: function (n) { return go(n); },
      next: function () { return go(i + 1); },
      prev: function () { return go(i - 1); },
      play: play, pause: pause, refresh: layout,
      destroy: function () { pause(); offs.forEach(function (f) { f(); }); c._c = null; }
    };
    Object.defineProperty(inst, 'index', { get: function () { return i; } });
    Object.defineProperty(inst, 'playing', { get: function () { return playing; } });
    return c._c = inst;
  }

  P.Carousel = {
    init: function (r, o) {
      return all(r, '[data-carousel]').map(function (c) {
        if (o && !c._c) P.opts ? P.opts(c, o) : (c._po = o);
        return build(c);
      });
    },
    get: function (el) { return (typeof el === 'string' ? document.querySelector(el) : el)._c || null; },
    destroy: function (r) { all(r, '[data-carousel]').forEach(function (c) { c._c && c._c.destroy(); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Carousel.init(); });
})();
