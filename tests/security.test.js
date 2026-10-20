const test = require('node:test'), assert = require('node:assert/strict'), fs = require('fs'), path = require('path');
const { load, ready, root } = require('./helpers');

test('prototype pollution via configure/setTokens is blocked', () => {
  const dom = load(); const P = ready(dom);
  P.configure(JSON.parse('{"__proto__":{"polluted":"yes"},"toast":{"__proto__":{"polluted2":"yes"}}}'));
  P.setTokens(JSON.parse('{"__proto__":{"polluted3":"yes"},"constructor":{"prototype":{"polluted4":"yes"}}}'));
  const w = dom.window;
  for (const k of ['polluted', 'polluted2', 'polluted3', 'polluted4']) { assert.equal(({})[k], undefined, k); assert.equal(w.eval('({})["' + k + '"]'), undefined, k); }
});

test('design tokens cannot break out of their CSS declaration', () => {
  const dom = load(); const P = ready(dom);
  P.setTokens({ accent: 'red;} body{display:none', 'x}body{color:red': '#000', bg: 'url(https://evil.example/x)', ink: '#111', dark: { text: '</style><script>1</script>' } });
  const css = Object.values(P.getTokens()).length && (dom.window.document.getElementById('psy-tokens') || {}).textContent || '';
  assert.ok(!/display:none|evil\.example|<script|body\{/.test(css), css);
  assert.ok(/--psy-ink:#111/.test(css), 'valid token is kept: ' + css);
});

test('P.url only lets safe schemes through', () => {
  const P = ready(load());
  for (const bad of ['javascript:alert(1)', ' java\nscript:alert(1)', 'JaVaScRiPt:1', 'vbscript:x', 'data:text/html,<script>1</script>', 'data:image/svg+xml;base64,AAAA<>'.replace('svg+xml', 'html')]) assert.equal(P.url(bad, { schemes: ['http:', 'https:', 'data:'] }), '', bad);
  assert.equal(P.url('https://a.example/x.png'), 'https://a.example/x.png');
  assert.ok(P.url('img/a.png').endsWith('img/a.png'));
  assert.ok(P.url('data:image/png;base64,AAAA', { schemes: ['data:'] }).startsWith('data:image/png'));
  assert.equal(P.url('data:image/png;base64,AAAA'), '');
});

const PAYLOADS = [
  '<script>alert(1)</script>', '<img src=x onerror=alert(1)>', '<svg><style><img src=x onerror=alert(1)></style></svg>',
  '<math><mtext><table><mglyph><style><img src=x onerror=alert(1)>', '<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
  '<a href="javascript:alert(1)">x</a>', '<a href="  JaVa\tScRiPt:alert(1)">x</a>', '<a href="jav&#x09;ascript:alert(1)">x</a>',
  '<a href="data:text/html,<script>alert(1)</script>">x</a>', '<form action="javascript:1"><button formaction="javascript:1">x</button></form>',
  '<iframe srcdoc="<script>alert(1)</script>"></iframe>', '<object data="javascript:1"></object>', '<embed src="javascript:1">',
  '<p style="position:fixed;inset:0" onclick="1">x</p>', '<div id="x" name="y" class="ok">x</div>', '<base href="https://evil.example/">',
  '<link rel=stylesheet href="https://evil.example/x.css">', '<meta http-equiv=refresh content="0;url=javascript:1">',
  '<details open ontoggle=alert(1)>', '<video><source onerror=alert(1)></video>', '<a href="//evil.example" target=_blank>x</a>',
  '<table><tr><td><svg><desc><img src=x onerror=alert(1)></desc></svg>', '<!--><img src=x onerror=alert(1)>-->', '<![CDATA[<img src=x onerror=alert(1)>]]>',
  '<p>' + '<b>'.repeat(5000) + 'deep'
];
test('Sanitize: XSS corpus produces only allow-listed output', () => {
  const dom = load(); const P = ready(dom), w = dom.window;
  const TAGS = new Set(P.config('sanitize').tags.split(','));
  for (const opt of [undefined, { images: true }, { images: true, data: true }]) for (const p of PAYLOADS) {
    const out = P.Sanitize.html(p, opt);
    const doc = new w.DOMParser().parseFromString('<!doctype html><body>' + out, 'text/html');
    for (const el of doc.body.querySelectorAll('*')) {
      assert.ok(TAGS.has(el.localName), 'tag ' + el.localName + ' from ' + p);
      for (const a of el.attributes) {
        assert.ok(!/^on|^style$|^id$|^name$|^srcdoc$|^formaction$/i.test(a.name), 'attr ' + a.name + ' from ' + p);
        if (/^(href|src)$/.test(a.name)) assert.ok(!/^\s*(javascript|vbscript|data:text)/i.test(a.value.replace(/[\s\u0000-\u001f]/g, '')), a.value);
      }
    }
    assert.ok(!/<script|onerror|onclick|javascript:|<iframe|srcdoc/i.test(out), out);
    /* the fragment API never re-parses: nothing in it may be a script */
    const f = P.Sanitize.fragment(p, opt);
    assert.equal(f.querySelectorAll('script,iframe,object,embed,style,link,meta,base,svg,math').length, 0, p);
  }
});
test('Sanitize: links get rel, _blank gets noopener noreferrer; benign markup survives', () => {
  const P = ready(load());
  const out = P.Sanitize.html('<p class="x">Hi <b>there</b> <a href="https://e.example" target="_blank">l</a> <code>a&lt;b</code></p>');
  assert.match(out, /<b>there<\/b>/); assert.match(out, /rel="noopener noreferrer"/); assert.match(out, /a&lt;b/);
});

test('I18n: data-i18n-html is sanitized, never raw', async () => {
  const html = '<!doctype html><html lang="en" data-i18n-langs="en" data-i18n-default="en" data-i18n-path="locales/{lang}.json"><body><p id="a" data-i18n-html="x"></p><p id="b" data-i18n="y"></p></body></html>';
  const dom = load(html); const w = dom.window;
  w.fetch = async () => ({ ok: true, json: async () => ({ x: '<b>ok</b><img src=x onerror=alert(1)><script>1</script><a href="javascript:1">j</a>', y: '<img src=x onerror=alert(1)>' }) });
  ready(dom); await new Promise(r => setTimeout(r, 80));
  const a = w.document.getElementById('a'), b = w.document.getElementById('b');
  assert.equal(a.querySelectorAll('img,script').length, 0); assert.ok(a.querySelector('b')); assert.equal(a.querySelector('a[href^=javascript]'), null);
  assert.equal(b.querySelector('img'), null, 'plain data-i18n is text');
});
test('I18n: without SafeHTML data-i18n-html falls back to text', async () => {
  const html = '<!doctype html><html lang="en" data-i18n-langs="en" data-i18n-default="en" data-i18n-path="locales/{lang}.json"><body><p id="a" data-i18n-html="x"></p></body></html>';
  const dom = load(html, { files: ['core.min.js', 'i18n.min.js'] }); const w = dom.window;
  w.fetch = async () => ({ ok: true, json: async () => ({ x: '<img src=x onerror=alert(1)>' }) });
  ready(dom); await new Promise(r => setTimeout(r, 80));
  assert.equal(w.document.getElementById('a').querySelector('img'), null);
});
test('I18n: cross-origin locale files are refused by default', async () => {
  const html = '<!doctype html><html lang="en" data-i18n-langs="en" data-i18n-default="en" data-i18n-path="https://evil.example/{lang}.json"><body><p id="a" data-i18n="x">orig</p></body></html>';
  const dom = load(html, { files: ['core.min.js', 'i18n.min.js'] }); const w = dom.window; let called = 0;
  w.fetch = async () => { called++; return { ok: true, json: async () => ({ x: 'pwned' }) }; };
  ready(dom); await new Promise(r => setTimeout(r, 80));
  assert.equal(called, 0); assert.notEqual(w.document.getElementById('a').textContent, 'pwned');
});

test('LazyImages refuses javascript:/data:text URLs', () => {
  const dom = load('<!doctype html><body><img id="i" data-src="javascript:alert(1)"><img id="j" data-src="https://ok.example/a.png"><div id="d" data-bg="javascript:alert(1)"></div></body>');
  const w = dom.window;
  w.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe(el) { this.cb([{ isIntersecting: true, target: el }], this); } unobserve() {} disconnect() {} };
  const P = ready(dom); P.Lazy.init(w.document);
  assert.ok(!/javascript/.test(w.document.getElementById('i').getAttribute('src') || ''));
  assert.equal(w.document.getElementById('j').getAttribute('src'), 'https://ok.example/a.png');
  assert.ok(!/javascript/.test(w.document.getElementById('d').style.backgroundImage));
});

test('CopyButton: label text is never parsed as HTML; bad selector does not throw', async () => {
  const dom = load('<!doctype html><body><button id="b" data-copy="x" data-copy-toast-text="&lt;img src=x onerror=alert(1)&gt;">Copy</button><button id="c" data-copy-target="###">c</button></body>');
  const w = dom.window; Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async () => {} }, configurable: true });
  const P = ready(dom); P.copy && 0;
  w.document.getElementById('b').click(); await new Promise(r => setTimeout(r, 30));
  assert.equal(w.document.getElementById('b').querySelector('img'), null);
  assert.doesNotThrow(() => w.document.getElementById('c').click());
});

test('ScrollSpy survives a malformed %-hash; TOC ignores invalid selectors; idPrefix applies', () => {
  const dom = load('<!doctype html><body><nav data-spy><a href="#%E0%A4%A">bad</a><a href="#ok">ok</a></nav><div id="post"><h2>name</h2></div><aside data-toc data-toc-source="#post" data-toc-id-prefix="t-"></aside><aside data-toc data-toc-source="###"></aside></body>');
  assert.doesNotThrow(() => ready(dom));
  assert.equal(dom.window.document.querySelector('#post h2').id, 't-name');
});

test('CookieBanner: bumping "version" invalidates stored consent', () => {
  const dom = load(); const w = dom.window, P = ready(dom);
  w.localStorage.setItem('psy-cookie', JSON.stringify({ v: 'accepted', c: { analytics: true }, t: Date.now(), ver: 1 }));
  assert.equal(P.Cookie.has('analytics'), true);
  P.configure('cookie', { version: 2 }); assert.equal(P.Cookie.has('analytics'), false);
});

test('DataTable: CSV export neutralises formulas; setRows inserts text only', () => {
  const dom = load('<!doctype html><body><table data-table><thead><tr><th>A</th><th data-sort-type="number">B</th></tr></thead><tbody></tbody></table></body>');
  const P = ready(dom), t = P.DataTable.get(dom.window.document.querySelector('table'));
  t.setRows([['=cmd|\' /C calc\'!A0', '3'], ['+1+1', '-5'], ['@SUM(1)', '10'], ['<img src=x onerror=1>', '2'], ['a,"b"', '1']]);
  assert.equal(dom.window.document.querySelector('tbody img'), null);
  const csv = t.csv(true).split('\r\n');
  assert.ok(csv[1].startsWith("\"'=cmd") || csv[1].startsWith("'=cmd"), csv[1]); assert.ok(csv[2].startsWith("'+1"), csv[2]); assert.ok(csv[3].startsWith("'@SUM"), csv[3]);
  assert.ok(csv[5].startsWith('"a,""b"""'), csv[5]);
});

test('source hygiene: no eval/new Function/document.write; innerHTML only through P.html', () => {
  for (const f of fs.readdirSync(path.join(root, 'src'))) {
    const s = fs.readFileSync(path.join(root, 'src', f), 'utf8');
    assert.ok(!/\beval\s*\(|new Function\s*\(|document\.write\s*\(|insertAdjacentHTML|outerHTML\s*=/.test(s), f);
    const m = s.match(/\.innerHTML\s*=/g) || [];
    assert.ok(f === 'core.js' ? m.length === 1 : m.length <= 3 && (m.length === 0 || /P\.html/.test(s)), f + ' innerHTML sinks: ' + m.length);
  }
});

test('site: no third-party origins in shipped HTML/CSS/JS; vercel.json has the security headers', () => {
  const allowed = /^(https?:\/\/(psyscripts\.vercel\.app|psygiox-dev\.vercel\.app|github\.com|www\.w3\.org|example\.com|evil\.example|openapi\.vercel\.sh|cdn\.jsdelivr\.net)(\/|$))/;
  for (const f of ['index.html', 'docs.html', 'css/site.css', 'css/psyscripts.css', 'css/fonts.css', 'js/demo.js']) {
    const s = fs.readFileSync(path.join(root, f), 'utf8');
    for (const u of s.match(/https?:\/\/[^\s"'<>)\\]+/g) || []) assert.ok(allowed.test(u), f + ': ' + u);
    assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(s), f);
  }
  const hs = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')).headers[0].headers.map(h => [h.key.toLowerCase(), h.value]));
  for (const k of ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy', 'x-frame-options']) assert.ok(hs[k], k);
  const csp = hs['content-security-policy'];
  assert.ok(!/unsafe-inline|unsafe-eval|\*/.test(csp), csp); assert.match(csp, /frame-ancestors 'none'/);
  const ro = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')).headers[0].headers.find(h => h.key === 'Content-Security-Policy-Report-Only');
  assert.match(ro.value, /require-trusted-types-for 'script'; trusted-types psyscripts/);
  assert.ok(!/ style="| on\w+="/i.test(fs.readFileSync(path.join(root, 'index.html'), 'utf8')) && !/ style="| on\w+="/i.test(fs.readFileSync(path.join(root, 'docs.html'), 'utf8')), 'inline style/handlers would violate the CSP');
});
