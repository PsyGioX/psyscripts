/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
/* SafeHTML — allow-list HTML sanitizer.
   The input is parsed by DOMParser (an inert document: no scripts run, nothing loads), then a NEW tree is built from
   allowed nodes only. The result is returned as a DocumentFragment and inserted without re-parsing, which rules out
   mutation-XSS. Works with Trusted Types (CSP: require-trusted-types-for 'script'; trusted-types psyscripts). */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    tags: 'a,abbr,b,bdi,blockquote,br,caption,cite,code,dd,del,div,dl,dt,em,h1,h2,h3,h4,h5,h6,hr,i,img,ins,kbd,li,mark,ol,p,pre,q,s,samp,small,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,time,tr,u,ul,var,wbr',
    attrs: 'class,title,lang,dir,alt,width,height,colspan,rowspan,scope,datetime,loading,decoding',
    drop: 'script,style,iframe,frame,frameset,object,embed,applet,svg,math,template,noscript,form,input,button,textarea,select,option,link,meta,base,audio,video,source,canvas,dialog,title,head',
    links: true, images: false, data: false, schemes: 'http:,https:,mailto:,tel:', maxLength: 200000, maxDepth: 40
  };
  (P.q = P.q || []).push(['sanitize', DEF]);
  function O(k) { return P.cfg ? P.cfg('sanitize', k, DEF[k]) : DEF[k]; }
  function E(n, d, el) { if (P.emit) return P.emit(n, d, el); return true; }
  function set(v) { var o = {}; String(v).split(',').forEach(function (x) { x = x.trim().toLowerCase(); if (x) o[x] = 1; }); return o; }
  var cache = {};
  function lists() {
    var key = [O('tags'), O('attrs'), O('drop'), O('schemes')].join('|');
    return cache[key] || (cache = {}, cache[key] = { tags: set(O('tags')), attrs: set(O('attrs')), drop: set(O('drop')), schemes: String(O('schemes')).split(',').map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean) });
  }
  var stats, cur = null;
  function Q(k) { return cur && cur[k] != null ? cur[k] : O(k); }

  function clean(src, dst, L, depth, doc) {
    for (var n = src.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) { dst.appendChild(doc.createTextNode(n.nodeValue)); continue; }
      if (n.nodeType !== 1) continue;                                   /* comments, PIs, CDATA: dropped */
      var t = n.localName;
      if (L.drop[t]) { stats.removed++; continue; }                     /* dangerous element: dropped together with its content */
      if (depth > Q('maxDepth')) { stats.removed++; continue; }
      if (t === 'img' && !Q('images')) { stats.removed++; continue; }
      if (t === 'a' && !Q('links')) { clean(n, dst, L, depth + 1, doc); continue; }
      if (!L.tags[t]) { stats.unwrapped++; clean(n, dst, L, depth + 1, doc); continue; }   /* unknown element: text kept, tag removed */
      var o = doc.createElement(t), i, a, nm, v;
      for (i = 0; i < n.attributes.length; i++) {
        a = n.attributes[i]; nm = a.name.toLowerCase(); v = a.value;
        if (/^on/.test(nm) || nm === 'style' || nm === 'id' || nm === 'name' || nm === 'srcdoc' || nm === 'formaction') { stats.attrs++; continue; }
        if (nm === 'href' && t === 'a') {
          var h = P.url ? P.url(v, { schemes: L.schemes }) : '';
          if (h || v.charAt(0) === '#') o.setAttribute('href', v.charAt(0) === '#' ? v : h); else stats.attrs++;
          continue;
        }
        if (nm === 'src' && t === 'img') {
          var u = P.url ? P.url(v, { schemes: ['http:', 'https:', 'data:'] }) : '';
          if (u) o.setAttribute('src', u); else stats.attrs++;
          continue;
        }
        if (nm === 'target' && t === 'a') { if (v === '_blank') o.setAttribute('target', '_blank'); continue; }
        if (L.attrs[nm] || (Q('data') && /^data-[\w-]+$/.test(nm)) || /^aria-[\w-]+$/.test(nm) || nm === 'role' && /^(note|presentation|list|listitem|img)$/.test(v)) o.setAttribute(nm, v);
        else stats.attrs++;
      }
      if (t === 'a' && o.getAttribute('target') === '_blank') o.setAttribute('rel', 'noopener noreferrer');
      if (t === 'a' && o.hasAttribute('href') && /^https?:/i.test(o.getAttribute('href')) && !o.hasAttribute('rel')) o.setAttribute('rel', 'noopener');
      if (t === 'img') { if (!o.hasAttribute('alt')) o.setAttribute('alt', ''); o.setAttribute('referrerpolicy', 'no-referrer'); if (!o.hasAttribute('loading')) o.setAttribute('loading', 'lazy'); }
      dst.appendChild(o);
      clean(n, o, L, depth + 1, doc);
    }
  }

  /* html string → DocumentFragment (owned by the current document, safe to insert directly) */
  function fragment(html, opt) {
    stats = { removed: 0, unwrapped: 0, attrs: 0 };
    cur = opt || null;
    html = String(html == null ? '' : html);
    if (html.length > Q('maxLength')) html = html.slice(0, Q('maxLength'));
    var parsed = new DOMParser().parseFromString('<!doctype html><body>' + html, 'text/html');
    var frag = document.createDocumentFragment(), L = lists();
    if (opt && (opt.tags || opt.attrs)) {
      L = { tags: opt.tags ? set(opt.tags) : L.tags, attrs: opt.attrs ? set(opt.attrs) : L.attrs, drop: L.drop, schemes: L.schemes };
    }
    try { clean(parsed.body, frag, L, 0, document); } finally { cur = null; }
    if (stats.removed || stats.attrs) E('sanitize:removed', { removed: stats.removed, attributes: stats.attrs, unwrapped: stats.unwrapped });
    return frag;
  }
  function toHTML(frag) { var d = document.createElement('div'); d.appendChild(frag); return d.innerHTML; }
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  P.Sanitize = {
    fragment: fragment,
    /* string result — for APIs that require a string. Prefer set()/fragment(): re-parsing a string is what mutation-XSS relies on. */
    html: function (s, o) { return toHTML(fragment(s, o)); },
    set: function (el, s, o) { el.textContent = ''; el.appendChild(fragment(s, o)); return el; },
    text: esc,
    url: function (u, schemes) { return P.url ? P.url(u, schemes ? { schemes: schemes } : null) : ''; },
    last: function () { return stats ? { removed: stats.removed, attributes: stats.attrs, unwrapped: stats.unwrapped } : null; },
    /* declarative: <div data-safe-html="&lt;b&gt;text&lt;/b&gt;"> — the attribute value is sanitized and rendered */
    init: function (r) {
      [].forEach.call((r || document).querySelectorAll('[data-safe-html]'), function (el) {
        if (el._sh) return;
        el._sh = 1;
        P.Sanitize.set(el, el.getAttribute('data-safe-html'));
      });
    },
    destroy: function () {}
  };
  document.addEventListener('DOMContentLoaded', function () { P.Sanitize.init(); });
})();
