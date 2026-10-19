/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    units: ['days', 'hours', 'minutes', 'seconds'], pad: true, labels: true, endText: '', hideZero: false, autostart: true
  };
  (P.q = P.q || []).push(['countdown', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('countdown', k, DEF[k], el, 'countdown') : DEF[k]; }
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

  var SIZE = { days: 864e5, hours: 36e5, minutes: 6e4, seconds: 1e3 };
  var UNIT = { days: 'day', hours: 'hour', minutes: 'minute', seconds: 'second' };

  /* "2026-12-31T00:00:00", a timestamp, or "+90" = 90 seconds from now */
  function target(v) {
    v = String(v).trim();
    if (/^\+\d+$/.test(v)) return Date.now() + parseInt(v.slice(1), 10) * 1000;
    if (/^\d{10,}$/.test(v)) return +v;
    return new Date(v).getTime();
  }
  function label(unit, n) {
    try {
      var p = new Intl.NumberFormat(document.documentElement.lang || undefined, { style: 'unit', unit: UNIT[unit], unitDisplay: 'long' }).formatToParts(n);
      for (var i = 0; i < p.length; i++) if (p[i].type === 'unit') return p[i].value;
    } catch (e) {}
    return unit;
  }

  function build(el) {
    if (el._cd) return el._cd;
    var units = O('units', el), end = target(el.getAttribute('data-countdown')), timer = 0, ended = false, nodes = {};
    if (typeof units === 'string') units = units.split(',').map(function (s) { return s.trim(); });
    if (isNaN(end)) return null;

    var custom = el.querySelectorAll('[data-cd]').length > 0;
    if (custom) {
      [].forEach.call(el.querySelectorAll('[data-cd]'), function (n) { nodes[n.dataset.cd] = n; });
      units = Object.keys(nodes);
    } else {
      el.textContent = '';
      units.forEach(function (u) {
        var box = document.createElement('div'), num = document.createElement('b'), lab = document.createElement('span');
        box.className = 'psy-cd__unit';
        num.className = 'psy-cd__num';
        lab.className = 'psy-cd__label';
        box.appendChild(num);
        if (O('labels', el)) box.appendChild(lab);
        el.appendChild(box);
        nodes[u] = num;
        num._lab = lab;
        num._box = box;
      });
    }
    el.setAttribute('role', 'timer');
    el.classList.add('psy-cd');

    function parts(ms) {
      var out = {}, rem = ms;
      units.forEach(function (u) { var v = Math.floor(rem / SIZE[u]); out[u] = v; rem -= v * SIZE[u]; });
      return out;
    }
    function render() {
      var ms = Math.max(0, end - Date.now()), p = parts(ms), hidden = true;
      units.forEach(function (u) {
        var n = nodes[u], v = p[u];
        if (!n) return;
        n.textContent = O('pad', el) && u !== 'days' ? String(v).padStart(2, '0') : String(v);
        if (n._lab) n._lab.textContent = label(u, v);
        if (n._box && O('hideZero', el)) {
          var hide = hidden && v === 0 && u !== units[units.length - 1];
          n._box.hidden = hide;
          if (v !== 0) hidden = false;
        }
      });
      el.setAttribute('aria-label', units.map(function (u) { return p[u] + ' ' + label(u, p[u]); }).join(' '));
      if (ms <= 0 && !ended) finish();
    }
    function finish() {
      ended = true;
      stop();
      el.classList.add('is-ended');
      var t = O('endText', el);
      if (t) { el.textContent = t; el.classList.add('psy-cd--text'); }
      E('countdown:end', { element: el }, el);
    }
    function start() {
      if (timer || ended) return;
      render();
      if (!ended) timer = setInterval(render, 250);
    }
    function stop() { clearInterval(timer); timer = 0; }

    var onLang = function () { render(); };
    document.addEventListener('psy:lang', onLang);
    if (O('autostart', el)) start(); else render();
    return el._cd = {
      el: el, start: start, stop: stop,
      remaining: function () { return Math.max(0, end - Date.now()); },
      set: function (t) { end = target(t); ended = false; el.classList.remove('is-ended'); start(); render(); },
      destroy: function () { stop(); document.removeEventListener('psy:lang', onLang); el._cd = null; }
    };
  }

  P.Countdown = {
    init: function (r) { return all(r, '[data-countdown]').map(build); },
    get: function (el) { return (typeof el === 'string' ? document.querySelector(el) : el)._cd || null; },
    destroy: function (r) { all(r, '[data-countdown]').forEach(function (e) { e._cd && e._cd.destroy(); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Countdown.init(); });
})();
