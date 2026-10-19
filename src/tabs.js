/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { activation: 'auto', orientation: 'horizontal', hash: false, animate: true };
  (P.q = P.q || []).push(['tabs', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('tabs', k, DEF[k], el) : DEF[k]; }
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

  function build(root) {
    if (root._t) return root._t;
    var own = function (el) { return el.closest('[data-tabs]') === root; };
    var tabs = [].filter.call(root.querySelectorAll('[data-tab]'), own);
    var panels = [].filter.call(root.querySelectorAll('[data-panel]'), own);
    var list = [].filter.call(root.querySelectorAll('[role=tablist]'), own)[0];
    var manual = O('activation', root) === 'manual';
    var vertical = O('orientation', root) === 'vertical';
    var useHash = O('hash', root);
    var uid = Math.random().toString(36).slice(2, 7), cur = -1, offs = [];

    root.classList.toggle('is-vertical', vertical);
    root.classList.toggle('no-anim', !O('animate', root));
    if (list) list.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
    tabs.forEach(function (t, i) {
      t.setAttribute('role', 'tab');
      t.id = t.id || 'tab-' + uid + '-' + i;
      var p = panels[i];
      if (p) {
        p.setAttribute('role', 'tabpanel');
        p.id = p.id || 'panel-' + uid + '-' + i;
        p.setAttribute('aria-labelledby', t.id);
        t.setAttribute('aria-controls', p.id);
      }
    });

    function go(i, focus, silent) {
      if (i < 0 || i >= tabs.length) return;
      var prev = cur;
      cur = i;
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        if (panels[j]) panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (useHash && tabs[i].dataset.tabId && !silent) history.replaceState(null, '', '#' + tabs[i].dataset.tabId);
      if (!silent && prev !== i) E('tabs:change', { index: i, previous: prev, tab: tabs[i], panel: panels[i] }, root);
    }
    tabs.forEach(function (t, i) {
      function click() { go(i); }
      function key(e) {
        var nx = vertical ? 'ArrowDown' : 'ArrowRight', pv = vertical ? 'ArrowUp' : 'ArrowLeft';
        var n = e.key === nx ? i + 1 : e.key === pv ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (n === null) return;
        e.preventDefault();
        n = (n + tabs.length) % tabs.length;
        if (manual) { tabs[n].focus(); } else go(n, true);
      }
      t.addEventListener('click', click);
      t.addEventListener('keydown', key);
      offs.push(function () { t.removeEventListener('click', click); t.removeEventListener('keydown', key); });
    });

    var s = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
    if (useHash && location.hash) {
      var h = tabs.findIndex(function (t) { return t.dataset.tabId === location.hash.slice(1); });
      if (h > -1) s = h;
    }
    go(s < 0 ? 0 : s, false, true);

    var inst = {
      el: root, tabs: tabs, panels: panels,
      go: function (i) { go(i); },
      next: function () { go((cur + 1) % tabs.length); },
      prev: function () { go((cur - 1 + tabs.length) % tabs.length); },
      destroy: function () { offs.forEach(function (f) { f(); }); root._t = null; }
    };
    Object.defineProperty(inst, 'index', { get: function () { return cur; } });
    return root._t = inst;
  }

  P.Tabs = {
    init: function (r, o) {
      return all(r, '[data-tabs]').map(function (root) {
        if (o && !root._t) P.opts ? P.opts(root, o) : (root._po = o);
        return build(root);
      });
    },
    get: function (el) { return (typeof el === 'string' ? document.querySelector(el) : el)._t || null; },
    destroy: function (r) { all(r, '[data-tabs]').forEach(function (root) { root._t && root._t.destroy(); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Tabs.init(); });
})();
