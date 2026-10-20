/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  if (P.core) return;
  P.core = true;
  P.version = '2.1.0';

  var B = {};   /* built-in defaults, registered by every script */
  var G = {};   /* user configuration, set with PsyScripts.configure() */
  var H = {};   /* event handlers, set with PsyScripts.on() */
  var TOKEN_KEY = 'psy-tokens';

  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }
  var own = Object.prototype.hasOwnProperty;
  /* keys that could pollute Object.prototype are never copied (prototype-pollution guard) */
  function bad(k) { return k === '__proto__' || k === 'constructor' || k === 'prototype'; }
  function merge(t, s) {
    for (var k in s) {
      if (!own.call(s, k) || bad(k)) continue;
      if (isObj(s[k])) t[k] = merge(isObj(t[k]) && own.call(t, k) ? t[k] : {}, s[k]);
      else t[k] = s[k];
    }
    return t;
  }
  function clone(o) { return merge({}, o || {}); }
  function kebab(s) { return s.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); }); }
  function coerce(v, d) {
    if (typeof d === 'number') return v === '' || isNaN(+v) ? d : +v;
    if (typeof d === 'boolean') return v !== 'false' && v !== '0';
    if (Array.isArray(d)) {
      try { return JSON.parse(v); } catch (e) { return v.split(',').map(function (x) { return x.trim(); }).filter(Boolean); }
    }
    if (d && typeof d === 'object') { try { return JSON.parse(v); } catch (e) { return d; } }
    return v;
  }

  /* ---------- defaults queue: scripts may load before or after the core ---------- */
  function def(n, o) { B[n] = merge(B[n] || {}, o); }
  var queued = P.q || [];
  P.q = { push: function (x) { def(x[0], x[1]); } };
  queued.forEach(function (x) { def(x[0], x[1]); });

  /* ---------- configuration ---------- */
  /* priority: data-attribute  >  element options (PsyScripts.opts)  >  global configure()  >  built-in default */
  P.cfg = function (n, k, d, el, pre) {
    if (el && el.getAttribute) {
      var a = el.getAttribute('data-' + (pre ? pre + '-' : '') + kebab(k));
      if (a !== null) return coerce(a, d);
      if (el._po && el._po[k] !== undefined) return el._po[k];
    }
    var g = G[n], v = g && g[k];
    if (v === undefined) return d;
    return isObj(v) && isObj(d) ? merge(clone(d), v) : v;
  };
  P.configure = function (a, b) {
    var o = a;
    if (typeof a === 'string') { o = {}; o[a] = b; }
    for (var k in o) {
      if (!own.call(o, k) || bad(k)) continue;           /* '__proto__' / 'constructor' / 'prototype' are never configuration names */
      if (k === 'tokens') P.setTokens(o[k]);
      else if (k === 'icons') P.setIcons(o[k]);
      else G[k] = merge(G[k] || {}, o[k]);
    }
    P.emit('config', { config: P.config() });
    return P;
  };
  P.config = function (n) {
    if (n) return merge(clone(B[n]), G[n] || {});
    var all = {};
    Object.keys(B).concat(Object.keys(G)).forEach(function (k) { all[k] = P.config(k); });
    return all;
  };
  P.defaults = function (n) { return n ? clone(B[n]) : clone(B); };
  P.reset = function (n) { if (n) delete G[n]; else G = {}; P.emit('config', { config: P.config() }); return P; };
  P.opts = function (el, o) { el._po = merge(el._po || {}, o || {}); return el; };

  /* ---------- events ---------- */
  P.on = function (n, f) {
    (H[n] = H[n] || []).push(f);
    return function () { P.off(n, f); };
  };
  P.off = function (n, f) { H[n] = (H[n] || []).filter(function (x) { return x !== f; }); };
  P.emit = function (n, d, el) {
    d = d || {};
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d });
    (el || document).dispatchEvent(e);
    (H[n] || []).slice().forEach(function (f) { f.call(P, d, e); });
    (H['*'] || []).slice().forEach(function (f) { f.call(P, n, d, e); });
    return !e.defaultPrevented;
  };

  /* ---------- design tokens (colors, radius, fonts, ...) ---------- */
  var MAP = {
    accent: 'accent', primary: 'primary', onPrimary: 'on-primary', bg: 'bg', solid: 'solid',
    text: 'text', muted: 'muted', line: 'line', ink: 'ink', lav: 'lav', mint: 'mint', pink: 'pink',
    peach: 'peach', sky: 'sky', butter: 'butter', ok: 'ok', err: 'err', warn: 'warn',
    radius: 'radius', font: 'font', mono: 'mono', shadow: 'sh', border: 'bw'
  };
  var S = { base: {}, themes: {} };
  function varName(k) { return '--psy-' + (MAP[k] || kebab(k)); }
  /* a token value may never leave its declaration: no braces, semicolons, comments, HTML, escapes, @rules or external url() */
  var CSS_BAD = /[{};<>\\\u0000-\u001f]|\/\*|@import|expression\s*\(|javascript:|url\s*\(\s*['"]?\s*(?!data:image\/)/i;
  function cssOk(v) { v = String(v); return v.length < 400 && !CSS_BAD.test(v); }
  function keyOk(k) { return /^[A-Za-z][\w-]{0,40}$/.test(k) && !bad(k); }
  function decl(o) {
    return Object.keys(o).filter(function (k) { return own.call(o, k) && keyOk(k) && cssOk(o[k]); })
      .map(function (k) { return varName(k) + ':' + o[k]; }).join(';');
  }
  function render() {
    var css = '';
    if (Object.keys(S.base).length) css += 'html:root{' + decl(S.base) + '}';
    Object.keys(S.themes).forEach(function (t) {
      if (keyOk(t)) css += 'html[data-theme=' + t + ']{' + decl(S.themes[t]) + '}';
    });
    sheet('psy-tokens', css);
  }
  /* CSP-friendly: a constructed stylesheet needs neither 'unsafe-inline' nor a nonce; <style> (with nonce) is only a fallback */
  var sheets = {};
  function sheet(id, css) {
    try {
      if (window.CSSStyleSheet && document.adoptedStyleSheets && CSSStyleSheet.prototype.replaceSync) {
        var sh = sheets[id] || (sheets[id] = new CSSStyleSheet());
        sh.replaceSync(css);
        if (document.adoptedStyleSheets.indexOf(sh) < 0) document.adoptedStyleSheets = document.adoptedStyleSheets.concat(sh);
        return;
      }
    } catch (e) {}
    var st = document.getElementById(id);
    if (!st) {
      st = document.createElement('style'); st.id = id;
      var n = document.querySelector('meta[name=psy-nonce]');
      if (n) st.setAttribute('nonce', n.content);
      document.head.appendChild(st);
    }
    st.textContent = css;
  }
  P.sheet = sheet;
  P.setTokens = function (t, o) {
    for (var k in t) {
      if (!own.call(t, k) || !keyOk(k)) continue;
      if (isObj(t[k])) S.themes[k] = merge(S.themes[k] || {}, t[k]);
      else if (cssOk(t[k])) S.base[k] = t[k];
    }
    render();
    if (o && o.save) { try { localStorage.setItem(TOKEN_KEY, JSON.stringify(S)); } catch (e) {} }
    P.emit('tokens', { tokens: P.getTokens() });
    return P;
  };
  P.getTokens = function () { return clone(S); };
  P.resetTokens = function () {
    S = { base: {}, themes: {} };
    sheet('psy-tokens', '');
    var st = document.getElementById('psy-tokens');
    if (st) st.remove();
    try { localStorage.removeItem(TOKEN_KEY); } catch (e) {}
    P.emit('tokens', { tokens: P.getTokens() });
    return P;
  };
  try {
    var saved = JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null');
    if (saved && isObj(saved)) { S = { base: merge({}, saved.base), themes: merge({}, saved.themes) }; document.head ? render() : document.addEventListener('DOMContentLoaded', render); }
  } catch (e) {}

  /* ---------- icons: override any built-in icon with your own SVG ---------- */
  P.setIcons = function (m) {
    for (var k in m) {
      var v = m[k];
      if (!own.call(m, k) || !keyOk(k) || typeof v !== 'string') continue;
      if (v.charAt(0) === '<') v = 'url("data:image/svg+xml,' + encodeURIComponent(v) + '")';
      else if (!/^(url\("?data:image\/|var\(--)/i.test(v) || !cssOk(v.replace(/^url\("?data:image\/[^)]*\)$/i, 'x'))) continue;
      document.documentElement.style.setProperty('--psy-i-' + kebab(k), v);
    }
    return P;
  };

  /* ---------- security helpers (used by every script that touches the DOM with strings) ---------- */
  /* P.url(u, {schemes, base}) → absolute URL string, or '' if the scheme is not allowed. Default: http, https, relative. */
  P.url = function (u, o) {
    o = o || {};
    if (u == null) return '';
    u = String(u).trim();
    if (!u) return '';
    var ok = o.schemes || ['http:', 'https:'], a;
    try { a = new URL(u, o.base || document.baseURI); } catch (e) { return ''; }
    if (ok.indexOf(a.protocol) < 0) return '';
    if (a.protocol === 'data:' && !/^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml)[;,]/i.test(u)) return '';
    return /^[a-z][a-z0-9+.-]*:/i.test(u) || u.charAt(0) === '/' ? a.href : u;
  };
  /* Trusted Types: one policy named "psyscripts". Works with CSP  require-trusted-types-for 'script'; trusted-types psyscripts */
  var tt = null;
  try { if (window.trustedTypes && trustedTypes.createPolicy) tt = trustedTypes.createPolicy('psyscripts', { createHTML: function (s) { return s; } }); } catch (e) {}
  /* P.html(el, markup): for STATIC markup written by the library itself. Never pass user input here — use P.Sanitize.set() instead. */
  P.html = function (el, s) { el.innerHTML = tt ? tt.createHTML(s) : s; return el; };
  P.clear = function (el) { el.textContent = ''; return el; };
  /* P.sel(selector, root) → element or null; an invalid selector never throws */
  P.sel = function (q, r) { try { return (r || document).querySelector(q); } catch (e) { return null; } };
  P.selAll = function (q, r) { try { return [].slice.call((r || document).querySelectorAll(q)); } catch (e) { return []; } };
  /* P.pick(value, allowed, fallback): whitelist for values that end up in class names */
  P.pick = function (v, a, f) { return a.indexOf(v) > -1 ? v : f; };

  /* ---------- lifecycle ---------- */
  function each(fn, root) {
    Object.keys(P).forEach(function (k) {
      var m = P[k];
      if (m && typeof m === 'object' && typeof m[fn] === 'function') {
        try { m[fn](root || document); } catch (e) { console.error('[PsyScripts] ' + k + '.' + fn, e); }
      }
    });
  }
  P.init = function (root) { each('init', root); return P; };
  P.destroy = function (root) { each('destroy', root); return P; };
  P.ready = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };
  P.use = function (plugin) { plugin(P); return P; };
  P.reduced = function () { return matchMedia('(prefers-reduced-motion: reduce)').matches; };

  var mo, mt;
  P.observe = function (on) {
    if (on === false) { if (mo) mo.disconnect(); mo = null; return P; }
    if (mo || !window.MutationObserver) return P;
    mo = new MutationObserver(function () { clearTimeout(mt); mt = setTimeout(function () { P.init(document); }, 50); });
    mo.observe(document.body, { childList: true, subtree: true });
    return P;
  };

  /* ---------- define your own script ---------- */
  P.define = function (name, spec) {
    var key = '_d_' + name, mod = P[name] = P[name] || {};
    function list(root) {
      root = root || document;
      var a = [].slice.call(root.querySelectorAll(spec.selector));
      if (root.matches && root.matches(spec.selector)) a.unshift(root);
      return a;
    }
    if (spec.defaults) def(name.toLowerCase(), spec.defaults);
    mod.init = function (root) {
      list(root).forEach(function (el) {
        if (el[key]) return;
        var opt = function (k, d) { return P.cfg(name.toLowerCase(), k, d, el); };
        el[key] = spec.init(el, opt) || true;
      });
    };
    mod.destroy = function (root) {
      list(root).forEach(function (el) {
        if (!el[key]) return;
        if (spec.destroy) spec.destroy(el, el[key]);
        el[key] = null;
      });
    };
    mod.get = function (el) { return el[key] && el[key] !== true ? el[key] : null; };
    P.ready(function () { mod.init(); });
    return mod;
  };

  P.ready(function () {
    if (P.cfg('core', 'observe', false, document.documentElement, 'psy')) P.observe();
  });
})();
