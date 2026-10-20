// npm run build → dist/*.min.js, psyscripts.min.css, tabs.min.css, icons.min.css, psyscripts.bundle.min.js
// Uses esbuild when installed; otherwise falls back to a small built-in minifier (no dependencies).
const fs = require('fs'), path = require('path');
let esbuild = null;
try { esbuild = require('esbuild'); } catch (e) { console.warn('⚠ esbuild not found — using the built-in minifier'); }

const banner = '/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */';
fs.mkdirSync('dist', { recursive: true });

// ---- fallback minifiers ----------------------------------------------------
function minJS(code, keepBanner) {
  const lines = code.split('\n').map(l => l.trim()).filter(l => l);
  const out = [];
  for (const l of lines) {
    if (l.startsWith('/*!')) { if (keepBanner && !out.length) out.push(l); continue; }
    if (l.startsWith('//') || (l.startsWith('/*') && l.endsWith('*/'))) continue;
    out.push(l);
  }
  return out.join('\n') + '\n';
}
function minCSS(code) {
  const keep = [];
  const hold = s => { keep.push(s); return '\u0000' + (keep.length - 1) + '\u0000'; };
  let c = code.replace(/\/\*(?!!)[\s\S]*?\*\//g, '')            // drop comments (keep /*! banners)
    .replace(/\/\*![\s\S]*?\*\//g, hold)
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, hold);       // protect strings and data URIs
  c = c.replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').replace(/:\s+/g, ':').trim();
  return c.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
}
function buildJS(name, files, out) {
  const src = files.map(f => fs.readFileSync(f, 'utf8'));
  if (esbuild) {
    esbuild.buildSync({
      stdin: { contents: files.map(f => `import './${f.replace(/\\/g, '/')}';`).join('\n'), resolveDir: '.' },
      bundle: true, outfile: out, minify: true, banner: { js: banner }, legalComments: 'none'
    });
  } else {
    fs.writeFileSync(out, banner + '\n' + src.map(s => minJS(s, false)).join(''));
  }
}

// ---- JS: core first so that the bundle never depends on load order ----------
const files = fs.readdirSync('src').filter(f => f.endsWith('.js')).sort((a, b) => (a === 'core.js' ? -1 : b === 'core.js' ? 1 : a.localeCompare(b)));
for (const f of files) buildJS(f, ['src/' + f], 'dist/' + path.basename(f, '.js') + '.min.js');
buildJS('bundle', files.map(f => 'src/' + f), 'dist/psyscripts.bundle.min.js');

// ---- CSS ----------------------------------------------------------------------
const css = f => fs.readFileSync('css/' + f, 'utf8');
const cssOut = {
  'dist/icons.min.css': css('icons.css'),
  'dist/tabs.min.css': css('tabs.css'),
  'dist/psyscripts.min.css': css('icons.css') + css('psyscripts.css') + css('tabs.css')   // everything in one file
};
for (const [o, c] of Object.entries(cssOut)) {
  if (esbuild) fs.writeFileSync(o, banner + esbuild.transformSync(c, { loader: 'css', minify: true }).code);
  else fs.writeFileSync(o, banner + '\n' + minCSS(c) + '\n');
}
// one-line install: bundle + styles injected from JS (use the two-tag variant in production to avoid a style flash)
{
  const cssText = fs.readFileSync('dist/psyscripts.min.css', 'utf8').replace(/^\/\*![^*]*\*\//, '');
  const inject = `(function(){if(document.getElementById('psy-css'))return;var c=${JSON.stringify(cssText)};try{if(window.CSSStyleSheet&&document.adoptedStyleSheets&&CSSStyleSheet.prototype.replaceSync){var h=new CSSStyleSheet();h.replaceSync(c);document.adoptedStyleSheets=[h].concat([].slice.call(document.adoptedStyleSheets));return}}catch(e){}var s=document.createElement('style');s.id='psy-css';var n=document.querySelector('meta[name=psy-nonce]');if(n)s.setAttribute('nonce',n.content);s.textContent=c;document.head.insertBefore(s,document.head.firstChild)})();\n`;
  fs.writeFileSync('dist/psyscripts.auto.min.js', banner + '\n' + inject + fs.readFileSync('dist/psyscripts.bundle.min.js', 'utf8').replace(/^\/\*![^\n]*\*\/\n?/, ''));
}
console.log('Built', files.length, 'scripts + bundle' + (esbuild ? '' : ' (fallback minifier)'));

// ---- icon fonts → vendor/icons/ ---------------------------------------------
require('./icons.js');

// ---- self-hosted fonts (css/fonts.css + fonts/) ---------------------------
require('./fonts.js');

// ---- dist/manifest.json: size, gzip size and SRI (sha384) of every distributed file ----
{
  const crypto = require('crypto'), zlib = require('zlib');
  const files = {};
  for (const f of fs.readdirSync('dist').sort()) {
    if (!/\.(js|css)$/.test(f)) continue;
    const buf = fs.readFileSync('dist/' + f);
    files[f] = { bytes: buf.length, gzip: zlib.gzipSync(buf, { level: 9 }).length, integrity: 'sha384-' + crypto.createHash('sha384').update(buf).digest('base64') };
  }
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  fs.writeFileSync('dist/manifest.json', JSON.stringify({ name: pkg.name, version: pkg.version, files }, null, 1) + '\n');
  console.log('Built dist/manifest.json (' + Object.keys(files).length + ' files)');
}

// ---- docs.html is generated from scripts/docs-data.py (needs Python 3; skipped if unavailable) ----
const { spawnSync } = require('child_process');
const py = ['python3', 'python'].map(c => [c, spawnSync(c, ['scripts/docs-data.py'], { stdio: 'inherit' })]).find(([, r]) => !r.error);
console.log(py && py[1].status === 0 ? 'Built docs.html' : '⚠ docs.html skipped (Python 3 not found or script failed)');

// ---- Vercel/static hosting: collect everything the site needs into public/ ----
fs.rmSync('public', { recursive: true, force: true });
fs.mkdirSync('public');
for (const f of ['index.html', 'docs.html', 'css', 'js', 'dist', 'locales', 'vendor', 'fonts', '.well-known', 'robots.txt', 'sitemap.xml', 'llms.txt', 'AI-INTEGRATION.md', 'site.webmanifest', 'favicon.svg', 'favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'og-image.png']) if (fs.existsSync(f)) fs.cpSync(f, 'public/' + f, { recursive: true });
console.log('Built public/');

// ---- Prerender the default language into public/index.html (no empty flash before locales load) ----
{
  const src = fs.readFileSync('index.html', 'utf8'), dl = /data-i18n-default="([^"]+)"/.exec(src)[1];
  const dict = JSON.parse(fs.readFileSync(`locales/${dl}.json`, 'utf8')), pr = new Intl.PluralRules(dl);
  const tr = (k, n) => { let v = dict[k]; if (v == null) return null; if (typeof v === 'object') v = v[pr.select(n || 0)] || v.other; return String(v).replace(/\{n\}/g, n); };
  const cnt = o => { const c = /data-i18n-count="(\d+)"/.exec(o); return c ? +c[1] : 0; };
  let out = src.replace(/(<(\w+)\b[^>]*?\bdata-i18n(?:-html)?="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, o, t, k, i, c) => { const v = tr(k, cnt(o)); if (v == null) return m; const html = /\bdata-i18n-html=/.test(o); return o + (html ? v : v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')) + c; });
  out = out.replace(/<(\w+)\b[^>]*\bdata-i18n-attr="([^"]+)"[^>]*>/g, (m, t, spec) => {
    let o = m;
    for (const p of spec.split(';')) {
      const i = p.indexOf(':'), a = p.slice(0, i), v = tr(p.slice(i + 1), cnt(m));
      if (v == null) continue;
      const q = v.replace(/"/g, '&quot;'), re = new RegExp('(\\s' + a + '=")[^"]*(")');
      o = re.test(o) ? o.replace(re, '$1' + q + '$2') : o.replace(/\/?>$/, s => ` ${a}="${q}"` + s);
    }
    return o;
  });
  fs.writeFileSync('public/index.html', out);
  console.log('Prerendered index.html (' + dl + ')');
}
