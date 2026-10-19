/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    speed: 70, deleteSpeed: 35, pause: 1600, startDelay: 400, loop: true, cursor: true,
    cursorChar: '', separator: '|', jitter: 0.35, shuffle: false
  };
  (P.q = P.q || []).push(['typewriter', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('typewriter', k, DEF[k], el, 'typewriter') : DEF[k]; }
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
  function parse(el) {
    var v = el.getAttribute('data-typewriter') || '', w;
    if (v.charAt(0) === '[') { try { w = JSON.parse(v); } catch (e) { w = []; } }
    else if (v) w = v.split(O('separator', el));
    else w = [el.textContent];
    return w.map(function (s) { return String(s).trim(); }).filter(Boolean);
  }

  function build(el) {
    if (el._tw) return el._tw;
    var words = parse(el);
    if (!words.length) return null;
    var out = document.createElement('span'), cur = null;
    out.className = 'psy-tw__text';
    out.setAttribute('aria-hidden', 'true');
    if (O('cursor', el)) {
      cur = document.createElement('span');
      cur.className = 'psy-tw__cursor';
      cur.setAttribute('aria-hidden', 'true');
      if (O('cursorChar', el)) cur.textContent = O('cursorChar', el);
    }
    el.textContent = '';
    el.appendChild(out);
    if (cur) el.appendChild(cur);
    el.setAttribute('aria-label', words.join(', '));
    el.classList.add('psy-tw');

    if (P.reduced ? P.reduced() : matchMedia('(prefers-reduced-motion: reduce)').matches) {
      out.textContent = words[0];
      return el._tw = { el: el, start: function () {}, stop: function () {}, set: function () {}, destroy: function () { el._tw = null; } };
    }

    var wi = 0, ci = 0, del = false, tm = 0, on = false, visible = true, io;
    function wait(ms) { if (on && visible) tm = setTimeout(tick, ms); }
    function jitter(ms) { return ms * (1 + (Math.random() * 2 - 1) * O('jitter', el)); }
    function tick() {
      tm = 0;
      if (!on) return;
      var w = words[wi];
      if (!del) {
        ci++;
        out.textContent = w.slice(0, ci);
        if (cur) cur.classList.add('is-busy');
        if (ci >= w.length) {
          if (cur) cur.classList.remove('is-busy');
          E('typewriter:word', { word: w, index: wi }, el);
          if (!O('loop', el) && wi === words.length - 1) { on = false; return; }
          del = true;
          wait(O('pause', el));
          return;
        }
        wait(jitter(O('speed', el)));
        return;
      }
      ci--;
      out.textContent = w.slice(0, ci);
      if (cur) cur.classList.add('is-busy');
      if (ci <= 0) {
        del = false;
        wi = O('shuffle', el) ? Math.floor(Math.random() * words.length) : (wi + 1) % words.length;
        wait(280);
        return;
      }
      wait(O('deleteSpeed', el));
    }
    function start() { if (on) return; on = true; wait(O('startDelay', el)); }
    function stop() { on = false; clearTimeout(tm); tm = 0; }

    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (a) {
        visible = a[0].isIntersecting;
        if (visible && on && !tm) wait(200);
        else if (!visible) { clearTimeout(tm); tm = 0; }
      });
      io.observe(el);
    }
    start();
    return el._tw = {
      el: el, start: start, stop: stop,
      set: function (w) { stop(); words = w.slice(); wi = ci = 0; del = false; out.textContent = ''; start(); },
      destroy: function () { stop(); io && io.disconnect(); el._tw = null; }
    };
  }

  P.Typewriter = {
    init: function (r) { return all(r, '[data-typewriter]').map(build); },
    get: function (el) { return (typeof el === 'string' ? document.querySelector(el) : el)._tw || null; },
    destroy: function (r) { all(r, '[data-typewriter]').forEach(function (e) { e._tw && e._tw.destroy(); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Typewriter.init(); });
})();
