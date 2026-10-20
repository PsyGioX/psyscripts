/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { langs: 'en', default: '', path: 'locales/{lang}.json', storageKey: 'psy-lang', detect: true, crossOrigin: false, rtl: '^(ar|he|fa|ur)\\b' };
  (P.q = P.q || []).push(['i18n', DEF]);
  var H = document.documentElement;
  function O(k) { return P.cfg ? P.cfg('i18n', k, DEF[k], H, 'i18n') : (H.getAttribute('data-i18n-' + k) || DEF[k]); }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }
  function list(v) { return (Array.isArray(v) ? v : String(v).split(',')).map(function (s) { return String(s).trim(); }).filter(Boolean); }

  var L = ['en'], DEF_LANG = 'en', PATH = [DEF.path], RTL = /^(ar|he|fa|ur)\b/;
  var cache = {}, extra = {}, dict = {}, fb = {}, cur = 'en';

  function conf() {
    L = list(O('langs'));
    DEF_LANG = O('default') || L[0];
    PATH = list(O('path'));
    try { RTL = new RegExp(String(O('rtl')).slice(0, 200)); } catch (e) { RTL = /^(ar|he|fa|ur)\b/; }
  }
  /* dictionaries come from JSON: copy own, non-prototype keys only */
  function clean(o) {
    var r = {};
    if (o && typeof o === 'object') Object.keys(o).forEach(function (k) { if (k !== '__proto__' && k !== 'constructor' && k !== 'prototype') r[k] = o[k]; });
    return r;
  }
  function pick(c) {
    if (!c) return;
    c = String(c).toLowerCase();
    for (var i = 0; i < L.length; i++) if (L[i].toLowerCase() === c) return L[i];
    c = c.split('-')[0];
    for (i = 0; i < L.length; i++) if (L[i].toLowerCase() === c) return L[i];
  }
  function stored() { try { return localStorage.getItem(O('storageKey')); } catch (e) { return null; } }
  function detect() {
    var q = new URLSearchParams(location.search).get('lang');
    var n = navigator.languages || [navigator.language];
    var r = pick(q) || pick(stored());
    if (!r && O('detect')) for (var i = 0; !r && i < n.length; i++) r = pick(n[i]);
    return r || pick(H.lang) || DEF_LANG;
  }
  function load(l) {
    return cache[l] || (cache[l] = Promise.all(PATH.map(function (p) {
      var u = p.replace('{lang}', encodeURIComponent(l)), a;
      try { a = new URL(u, document.baseURI); } catch (e) { return {}; }
      /* locale files are code-adjacent data: same-origin only unless data-i18n-cross-origin is set */
      if (a.origin !== location.origin && !O('crossOrigin')) return {};
      return fetch(a.href, { credentials: 'same-origin', referrerPolicy: 'no-referrer' }).then(function (r) { return r.ok ? r.json() : {}; }).then(clean).catch(function () { return {}; });
    })).then(function (a) { return Object.assign.apply(null, [{}].concat(a)); }));
  }
  function fmtN(v) { return typeof v === 'number' ? new Intl.NumberFormat(cur).format(v) : v; }
  function tr(k, v) {
    var s = k in dict ? dict[k] : fb[k];
    if (s == null) return null;
    if (typeof s === 'object') s = s[new Intl.PluralRules(cur).select(+(v && v.n) || 0)] || s.other || '';
    return String(s).replace(/\{(\w+)\}/g, function (m, x) { return v && v[x] != null ? fmtN(v[x]) : m; });
  }
  function vars(el) {
    var v = {};
    try { if (el.dataset.i18nVars) v = JSON.parse(el.dataset.i18nVars); } catch (e) {}
    if (el.dataset.i18nCount != null) v.n = +el.dataset.i18nCount;
    return v;
  }
  function apply(root) {
    (root || document).querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-attr]').forEach(function (el) {
      var v = vars(el), s;
      if (el.dataset.i18n && (s = tr(el.dataset.i18n, v)) != null) el.textContent = s;
      /* data-i18n-html is sanitized (allow-list) by SafeHTML; without it the string is inserted as plain text — never as raw HTML */
      if (el.dataset.i18nHtml && (s = tr(el.dataset.i18nHtml, v)) != null) { if (P.Sanitize) P.Sanitize.set(el, s); else el.textContent = s; }
      if (el.dataset.i18nAttr) el.dataset.i18nAttr.split(';').forEach(function (p) {
        var i = p.indexOf(':');
        if (i > 0 && (s = tr(p.slice(i + 1).trim(), v)) != null) el.setAttribute(p.slice(0, i).trim(), s);
      });
    });
  }
  function mark() {
    document.querySelectorAll('[data-lang-set]').forEach(function (b) {
      var on = b.dataset.langSet === cur;
      b.setAttribute('aria-pressed', on);
      b.classList.toggle('is-active', on);
    });
    var nx = L[(L.indexOf(cur) + 1) % L.length].toUpperCase();
    document.querySelectorAll('[data-lang-toggle]').forEach(function (b) { b.textContent = nx; });
  }
  function set(l, save) {
    l = pick(l) || DEF_LANG;
    return Promise.all([load(l), load(DEF_LANG)]).then(function (r) {
      dict = Object.assign({}, r[0], clean(extra[l]));
      fb = Object.assign({}, r[1], clean(extra[DEF_LANG]));
      cur = l;
      H.lang = l;
      H.dir = RTL.test(l) ? 'rtl' : 'ltr';
      if (save) try { localStorage.setItem(O('storageKey'), l); } catch (e) {}
      apply();
      mark();
      E('lang', { lang: l });
      return l;
    });
  }

  P.I18n = {
    t: function (k, v) { var s = tr(k, v); return s == null ? k : s; },
    has: function (k) { return k in dict || k in fb; },
    setLang: function (l) { return set(l, 1); },
    toggle: function () { return set(L[(L.indexOf(cur) + 1) % L.length], 1); },
    add: function (lang, d) {
      extra[lang] = Object.assign(extra[lang] || {}, clean(d));
      if (lang === cur) dict = Object.assign({}, dict, d);
      if (lang === DEF_LANG) fb = Object.assign({}, fb, d);
      if (lang === cur) apply();
    },
    apply: apply,
    number: function (n, o) { return new Intl.NumberFormat(cur, o).format(n); },
    date: function (d, o) { return new Intl.DateTimeFormat(cur, o).format(d); }
  };
  Object.defineProperty(P.I18n, 'langs', { get: function () { return L.slice(); } });
  Object.defineProperty(P.I18n, 'lang', { get: function () { return cur; } });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang-toggle],[data-lang-set]');
    if (!b) return;
    e.preventDefault();
    b.hasAttribute('data-lang-toggle') ? P.I18n.toggle() : P.I18n.setLang(b.dataset.langSet);
  });
  document.addEventListener('DOMContentLoaded', function () { conf(); set(detect()); });
})();
