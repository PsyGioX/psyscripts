/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { themes: ['light', 'dark'], storageKey: 'psy-theme', follow: true, initial: '', updateMeta: true };
  (P.q = P.q || []).push(['theme', DEF]);
  function O(k) { return P.cfg ? P.cfg('theme', k, DEF[k]) : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }

  var d = document.documentElement, m = matchMedia('(prefers-color-scheme: dark)'), touched = false;
  function store() { try { return localStorage.getItem(O('storageKey')); } catch (e) { return null; } }
  function themes() { return O('themes'); }
  function system() { return m.matches && themes().indexOf('dark') > -1 ? 'dark' : themes()[0]; }
  function initial() {
    var s = store();
    if (s && themes().indexOf(s) > -1) return s;
    if (O('initial') && themes().indexOf(O('initial')) > -1) return O('initial');
    return O('follow') ? system() : themes()[0];
  }
  function get() { return d.getAttribute('data-theme'); }
  function set(t, save, silent) {
    if (themes().indexOf(t) < 0) return;
    var prev = get();
    d.setAttribute('data-theme', t);
    if (save) { touched = true; try { localStorage.setItem(O('storageKey'), t); } catch (e) {} }
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', t !== themes()[0]); });
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      var on = b.dataset.themeSet === t;
      b.setAttribute('aria-pressed', on);
      b.classList.toggle('is-active', on);
    });
    if (O('updateMeta')) {
      var c = getComputedStyle(d).getPropertyValue('--psy-bg').trim(), mt = document.querySelector('meta[name=theme-color]');
      if (c && mt) mt.setAttribute('content', c);
    }
    if (!silent && prev !== t) E('theme:change', { theme: t, previous: prev });
  }
  function toggle() {
    var l = themes(), i = l.indexOf(get());
    set(l[(i + 1) % l.length], true);
  }

  P.Theme = {
    get: get,
    set: function (t) { set(t, true); },
    toggle: toggle,
    list: function () { return themes().slice(); },
    system: system,
    clear: function () {
      try { localStorage.removeItem(O('storageKey')); } catch (e) {}
      touched = false;
      set(initial());
    }
  };

  set(initial(), false, true);
  if (m.addEventListener) m.addEventListener('change', function () { if (!store() && O('follow')) set(system()); });
  if (P.on) P.on('config', function () { if (!touched && !store()) set(initial()); });
  document.addEventListener('DOMContentLoaded', function () { set(get(), false, true); });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-theme-toggle]')) { toggle(); return; }
    var b = e.target.closest('[data-theme-set]');
    if (b) set(b.dataset.themeSet, true);
  });
})();
