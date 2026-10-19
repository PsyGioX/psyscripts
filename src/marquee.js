/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { speed: 30, direction: 'left', pauseOnHover: true, gap: 16 };
  (P.q = P.q || []).push(['marquee', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('marquee', k, DEF[k], el) : DEF[k]; }
  function all(r, sel) {
    r = r || document;
    var a = [].slice.call(r.querySelectorAll(sel));
    if (r.matches && r.matches(sel)) a.unshift(r);
    return a;
  }

  function build(m) {
    if (m._m) return;
    m._m = 1;
    var t = document.createElement('div');
    t.className = 'psy-marquee__track';
    while (m.firstChild) t.appendChild(m.firstChild);
    var items = [].slice.call(t.children);
    m.style.setProperty('--psy-marq-gap', O('gap', m) + 'px');
    var w = document.createElement('div');
    w.className = 'psy-marquee__inner';
    w.appendChild(t);
    m.appendChild(w);
    /* repeat items until one track is wider than the container, then duplicate it for a seamless loop */
    var guard = 0;
    while (t.scrollWidth < m.clientWidth && guard++ < 20) {
      items.forEach(function (i) { var c = i.cloneNode(true); c.setAttribute('aria-hidden', 'true'); t.appendChild(c); });
    }
    var g = t.cloneNode(true);
    g.setAttribute('aria-hidden', 'true');
    w.appendChild(g);
    w.style.animationDuration = O('speed', m) + 's';
    if (O('direction', m) === 'right') w.style.animationDirection = 'reverse';
    m.classList.toggle('no-pause', !O('pauseOnHover', m));
    m._w = w;
  }
  P.Marquee = {
    init: function (r) { all(r, '[data-marquee]').forEach(build); },
    pause: function (m) { m._w && (m._w.style.animationPlayState = 'paused'); },
    play: function (m) { m._w && (m._w.style.animationPlayState = ''); },
    setSpeed: function (m, s) { m._w && (m._w.style.animationDuration = s + 's'); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Marquee.init(); });
})();
