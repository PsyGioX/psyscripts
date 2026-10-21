/* PsyScripts demo page · © 2026 PsyGioX · MIT */
(function () {
  var P = window.PsyScripts, I = P.I18n;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function on(id, ev, fn) { var e = document.getElementById(id); e && e.addEventListener(ev, fn); }
  function val(id) { return document.getElementById(id).value; }
  function chk(id) { return document.getElementById(id).checked; }
  function log(id, msg) {
    var ul = document.getElementById(id);
    if (!ul) return;
    var li = document.createElement('li');
    li.textContent = msg;
    ul.insertBefore(li, ul.firstChild);
    while (ul.children.length > 30) ul.lastChild.remove();
  }

  /* ---------- catalog of scripts: [name, category, file, snippet, flag] ; flag 1 = new in 2.1 ---------- */
  var S = [
    ['Tabs', 'nav', 'tabs', 'data-tabs · data-tab · data-panel'],
    ['ThemeSwitcher', 'sys', 'theme-switcher', 'data-theme-toggle · data-theme-set'],
    ['HeaderMenu', 'nav', 'header-menu', 'data-header · data-menu-toggle'],
    ['CopyButton', 'data', 'copy-button', 'data-copy="text" / data-copy-target="#id"'],
    ['ScrollReveal', 'media', 'scroll-reveal', 'data-reveal="left" data-reveal-delay="100"'],
    ['Accordion', 'nav', 'accordion', 'data-accordion data-single'],
    ['Modal', 'overlay', 'modal', 'data-modal-open="id" · Modal.confirm()'],
    ['Toast', 'overlay', 'toast', 'Toast.success("Hi", {position:"top-center"})'],
    ['BackToTop', 'nav', 'back-to-top', 'data-back-top'],
    ['LazyImages', 'media', 'lazy-images', '<img data-src="a.jpg"> · data-bg'],
    ['Dropdown', 'nav', 'dropdown', 'data-dropdown · data-open-on-hover'],
    ['Tooltip', 'overlay', 'tooltip', 'data-tooltip="Text" data-tooltip-placement'],
    ['Counter', 'data', 'counter', 'data-counter="1200" data-suffix="+"'],
    ['Carousel', 'media', 'carousel', 'data-carousel data-per-view="3"'],
    ['FormValidation', 'data', 'form-validation', '<form data-validate> · data-rule · data-match'],
    ['ScrollSpy', 'nav', 'scroll-spy', 'data-spy on <nav>'],
    ['StickyTOC', 'nav', 'toc', 'data-toc data-toc-source="#post"'],
    ['Marquee', 'media', 'marquee', 'data-marquee data-speed="30"'],
    ['ImageLightbox', 'overlay', 'lightbox', 'data-lightbox · data-full="big.jpg"'],
    ['Parallax', 'media', 'parallax', 'data-parallax="0.2"'],
    ['CookieBanner', 'overlay', 'cookie-banner', 'data-cookie-banner · data-cookie-category'],
    ['Skeleton', 'media', 'skeleton', 'data-skeleton · Skeleton.done(el)'],
    ['I18n', 'sys', 'i18n', 'data-i18n="key" · data-lang-toggle'],
    ['Typewriter', 'media', 'typewriter', 'data-typewriter="One|Two|Three"'],
    ['Countdown', 'data', 'countdown', 'data-countdown="2027-01-01T00:00"'],
    ['ScrollProgress', 'data', 'scroll-progress', 'data-progress data-progress-target="#post"'],
    ['CompareSlider', 'media', 'compare', 'data-compare · data-compare-labels="A|B"'],
    ['CommandPalette', 'overlay', 'command-palette', 'Ctrl+K · data-command-open · CommandPalette.register()', 1],
    ['DataTable', 'data', 'data-table', '<table data-table data-table-page-size="10">', 1],
    ['Sortable', 'data', 'sortable', 'data-sortable · data-sortable-handle=".grip"', 1],
    ['SafeHTML', 'sys', 'safe-html', 'PsyScripts.Sanitize.set(el, html)', 1]
  ];
  var CATS = ['all', 'new', 'nav', 'overlay', 'media', 'data', 'sys'], cat = 'all', query = '', sizes = {};

  function mk(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function include(f) { return '<script src="https://psyscripts.vercel.app/dist/core.min.js" defer></script>\n<script src="https://psyscripts.vercel.app/dist/' + f + '.min.js" defer></script>'; }
  function hit(s) {
    var q = query.trim().toLowerCase();
    if (cat === 'new' ? !s[4] : cat !== 'all' && s[1] !== cat) return false;
    return !q || (s[0] + ' ' + s[3] + ' ' + s[2] + ' ' + I.t('card.' + s[0]) + ' ' + I.t('cat.' + s[1])).toLowerCase().indexOf(q) > -1;
  }
  function cards() {
    var box = document.getElementById('cards');
    box.textContent = '';
    S.forEach(function (s, i) {
      var c = mk('article', 'card'), h = mk('h3'), t = mk('span', null, s[0]);
      c.dataset.cat = s[1]; c.dataset.i = i; c.setAttribute('data-reveal', ''); c.setAttribute('data-reveal-delay', (i % 3) * 80);
      if (s[4]) t.appendChild(mk('span', 'new', I.t('badge.new')));
      h.appendChild(t); h.appendChild(mk('span', 'n', String(i + 1).padStart(2, '0')));
      var pre = mk('pre'), code = mk('code', null, s[3]); pre.appendChild(code);
      var f = mk('div', 'cfoot'), a = mk('a', null, I.t('card.docs'));
      a.href = 'docs.html#' + s[0].toLowerCase();
      var cp = mk('button', null, I.t('card.include')); cp.type = 'button'; cp.dataset.copy = include(s[2]); cp.dataset.copied = '✓';
      cp.title = 'https://psyscripts.vercel.app/dist/' + s[2] + '.min.js';
      f.appendChild(a); f.appendChild(cp);
      var z = sizes[s[2]]; if (z) f.appendChild(mk('span', 'size', (z.gzip / 1024).toFixed(1) + ' KB gz'));
      c.appendChild(h); c.appendChild(mk('p', null, I.t('card.' + s[0]))); c.appendChild(pre); c.appendChild(f);
      box.appendChild(c);
    });
    P.Reveal.init(box);
    filter();
  }
  function filters() {
    var f = document.getElementById('filters'), cnt = {};
    S.forEach(function (s) { cnt.all = (cnt.all || 0) + 1; cnt[s[1]] = (cnt[s[1]] || 0) + 1; if (s[4]) cnt['new'] = (cnt['new'] || 0) + 1; });
    f.textContent = '';
    CATS.forEach(function (c) {
      var b = mk('button', 'chip', I.t('cat.' + c) + ' · ' + (cnt[c] || 0));
      b.type = 'button'; b.dataset.f = c; b.setAttribute('aria-pressed', c === cat);
      f.appendChild(b);
    });
  }
  function filter() {
    var n = 0;
    $$('#cards .card').forEach(function (c) { var ok = hit(S[+c.dataset.i]); c.hidden = !ok; if (ok) n++; });
    $$('#filters .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === cat); });
    document.getElementById('cards-count').textContent = I.t('scripts.found', { n: n });
    document.getElementById('cards-empty').hidden = n > 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#filters .chip');
    if (b) { cat = b.dataset.f; filter(); }
  });
  on('script-q', 'input', function () { query = val('script-q'); filter(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && e.target.id === 'script-q' && query) { e.target.value = ''; query = ''; filter(); } });
  /* sizes come from the build (dist/manifest.json); the catalog works without them */
  fetch('dist/manifest.json', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (m) {
    if (!m || !m.files) return;
    Object.keys(m.files).forEach(function (k) { var n = /^(.+)\.min\.js$/.exec(k); if (n) sizes[n[1]] = m.files[k]; });
    cards(); dtRows();
  }).catch(function () {});

  /* ---------- static bits that must exist before DOMContentLoaded ---------- */
  (function () {
    var y = new Date().getFullYear() + 1;
    document.getElementById('cd-ny').setAttribute('data-countdown', y + '-01-01T00:00:00');
    var h = [262, 190, 330, 45, 150, 20];
    var gal = document.getElementById('gal');
    h.forEach(function (c, i) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(' + c + ',80%,62%)"/><stop offset="1" stop-color="hsl(' + (c + 60) + ',80%,42%)"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><text x="400" y="330" font-size="120" font-family="sans-serif" font-weight="800" text-anchor="middle" fill="#fff" fill-opacity=".85">' + (i + 1) + '</text></svg>';
      var img = document.createElement('img');
      img.alt = 'Image ' + (i + 1); img.tabIndex = 0; img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
      gal.appendChild(img);
    });
  })();

  /* ---------- UI tab ---------- */
  function tabsApply() {
    var root = document.getElementById('demo-tabs');
    P.Tabs.get(root).destroy();
    P.opts(root, { activation: val('tabs-act'), orientation: val('tabs-ori') });
    P.Tabs.init(root);
  }
  on('tabs-act', 'change', tabsApply);
  on('tabs-ori', 'change', tabsApply);
  document.addEventListener('psy:tabs:change', function (e) {
    if (e.target.id === 'demo-tabs') log('log-tabs', 'tabs:change → #' + e.detail.index + ' (from #' + e.detail.previous + ')');
  });

  var acc = document.getElementById('demo-acc');
  on('acc-single', 'change', function () { acc.setAttribute('data-single', chk('acc-single')); });
  on('acc-dur', 'input', function () {
    acc.style.setProperty('--psy-acc-speed', val('acc-dur') + 'ms');
    document.getElementById('acc-dur-v').textContent = val('acc-dur') + 'ms';
  });
  on('acc-open', 'click', function () { acc.setAttribute('data-single', 'false'); document.getElementById('acc-single').checked = false; P.Accordion.openAll(acc); });
  on('acc-close', 'click', function () { P.Accordion.closeAll(acc); });

  on('dd-hover', 'change', function () { document.getElementById('demo-dd').setAttribute('data-open-on-hover', chk('dd-hover')); });

  on('add-sepia', 'click', function () {
    P.configure('theme', { themes: ['light', 'dark', 'sepia'] });
    P.setTokens({ sepia: { bg: '#f3e8d3', solid: '#fbf4e4', text: '#3a2a14', muted: '#6a5434', ink: '#6b4a1e', accent: '#a3571b', primary: '#e8c48a', onPrimary: '#3a2208', lav: '#ecdcc0', mint: '#dbe7c4', pink: '#f3cfb4', peach: '#f6dcb4', sky: '#d6dfd2', butter: '#f6e7a8' } });
    document.getElementById('sepia-btn').hidden = false;
    P.Theme.set('sepia');
    P.Toast.success('sepia ✓');
  });

  P.on('spy:change', function (d) { var o = document.getElementById('spy-out'); if (o) o.textContent = '#' + d.id; });
  on('hdr-hide', 'change', function () { $('[data-header]').setAttribute('data-hide-on-scroll', chk('hdr-hide')); });

  /* ---------- Overlays tab ---------- */
  var m1 = document.getElementById('m1');
  on('m-backdrop', 'change', function () { m1.setAttribute('data-close-on-backdrop', chk('m-backdrop')); });
  on('m-esc', 'change', function () { m1.setAttribute('data-close-on-esc', chk('m-esc')); });
  on('m-confirm', 'click', function () {
    P.Modal.confirm({ title: I.t('d.confirm.t'), text: I.t('d.confirm.p'), okLabel: I.t('d.confirm.ok'), cancelLabel: I.t('demo.close') }).then(function (ok) {
      P.Toast.show(ok ? I.t('d.confirm.yes') : I.t('d.confirm.no'), { type: ok ? 'success' : 'info' });
    });
  });

  on('t-dur', 'input', function () { document.getElementById('t-dur-v').textContent = val('t-dur'); });
  on('t-show', 'click', function () {
    var o = { type: val('t-type'), position: val('t-pos'), duration: +val('t-dur'), closeButton: chk('t-close'), progress: chk('t-progress') };
    if (chk('t-title')) o.title = I.t('d.toast.title');
    if (chk('t-action')) o.action = { label: I.t('d.toast.undo'), onClick: function () { P.Toast.show('↩', { type: 'success', duration: 1200 }); } };
    P.Toast.show(I.t('demo.hello'), o);
  });
  on('t-clear', 'click', function () { P.Toast.clear(); });

  on('lb-loop', 'change', function () { P.configure('lightbox', { loop: chk('lb-loop') }); });
  on('lb-counter', 'change', function () { P.configure('lightbox', { counter: chk('lb-counter') }); });

  function cookieOut() { var c = P.Cookie.get(); document.getElementById('cookie-out').textContent = c ? c + ' · analytics=' + P.Cookie.has('analytics') : I.t('d.cookie.none'); }
  document.addEventListener('psy:cookie', cookieOut);
  on('cookie-reset', 'click', function () { P.Cookie.reset(); cookieOut(); });

  /* ---------- Media tab ---------- */
  function carApply() {
    var el = document.getElementById('demo-car');
    P.Carousel.get(el).destroy();
    P.opts(el, { perView: +val('car-pv'), autoplay: +val('car-ap'), loop: chk('car-loop'), dots: chk('car-dots'), arrows: chk('car-arrows') });
    P.Carousel.init(el);
    el.querySelector('[data-track]').scrollLeft = 0;
  }
  ['car-pv', 'car-ap', 'car-loop', 'car-dots', 'car-arrows'].forEach(function (id) { on(id, 'change', carApply); });
  document.addEventListener('psy:carousel:change', function (e) {
    if (e.target.id === 'demo-car') log('log-car', 'carousel:change → slide #' + (e.detail.index + 1));
  });

  on('cmp-hover', 'change', function () { ['cmp1', 'cmp2'].forEach(function (id) { document.getElementById(id).setAttribute('data-compare-hover', chk('cmp-hover')); }); });

  function twApply() {
    var el = document.getElementById('demo-tw'), t = P.Typewriter.get(el);
    P.opts(el, { speed: +val('tw-speed'), loop: chk('tw-loop') });
    el.setAttribute('data-typewriter-speed', val('tw-speed'));
    el.setAttribute('data-typewriter-loop', chk('tw-loop'));
    t && t.set(val('tw-words').split('|').filter(Boolean));
  }
  on('tw-words', 'change', twApply);
  on('tw-loop', 'change', twApply);
  on('tw-speed', 'input', function () { document.getElementById('tw-speed-v').textContent = val('tw-speed'); twApply(); });

  var marq = document.getElementById('demo-marq'), paused = false;
  on('marq-speed', 'input', function () {
    P.Marquee.setSpeed(marq, val('marq-speed'));
    document.getElementById('marq-v').textContent = val('marq-speed') + 's';
  });
  on('marq-pause', 'click', function () { paused = !paused; paused ? P.Marquee.pause(marq) : P.Marquee.play(marq); this.setAttribute('aria-pressed', paused); });

  on('rev-replay', 'click', function () {
    $$('#rev-box [data-reveal]').forEach(function (e) { e.classList.remove('is-visible'); });
    P.Reveal.destroy();
    requestAnimationFrame(function () { P.Reveal.init(document.getElementById('rev-box')); });
  });
  on('sk-reload', 'click', function () {
    var sk = document.getElementById('sk');
    P.Skeleton.start(sk);
    setTimeout(function () { P.Skeleton.done(sk); }, 1500);
  });
  setTimeout(function () { P.Skeleton.done(document.getElementById('sk')); }, 900);

  /* ---------- Data tab ---------- */
  var form = document.getElementById('f1');
  on('f-mode', 'change', function () { form.setAttribute('data-validate-on', val('f-mode')); });
  on('f-reset', 'click', function () { P.Form.reset(form); });
  document.addEventListener('psy:valid', function (e) {
    if (e.target !== form) return;
    log('log-form', 'valid → ' + JSON.stringify(e.detail.data));
    P.Toast.show(I.t('demo.hello'), { type: 'success' });
  });
  document.addEventListener('psy:form:invalid', function (e) {
    if (e.target === form) log('log-form', 'form:invalid → ' + e.detail.fields.map(function (f) { return f.name; }).join(', '));
  });

  on('cnt-dur', 'input', function () { document.getElementById('cnt-dur-v').textContent = val('cnt-dur'); });
  on('cnt-run', 'click', function () {
    P.Counter.set(document.getElementById('demo-cnt'), +val('cnt-to'), { duration: +val('cnt-dur'), easing: val('cnt-ease') });
  });

  on('cd-restart', 'click', function () { P.Countdown.get('#cd-timer').set('+45'); });
  document.addEventListener('psy:countdown:end', function (e) {
    if (e.target.id === 'cd-timer') P.Toast.show('countdown:end', { type: 'success' });
  });

  on('plural-n', 'input', function () {
    var o = document.getElementById('plural-out');
    o.setAttribute('data-i18n-count', Math.max(0, +val('plural-n') || 0));
    I.apply(o.parentNode);
  });

  /* ---------- v2.1 tools ---------- */
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $$('#hdr-kbd,#cmd-kbd').forEach(function (k) { k.textContent = mac ? '⌘ K' : 'Ctrl K'; });

  /* CommandPalette */
  var cmdOff = null, cmdN = 0;
  function cmdSetup() {
    /* palette texts and the commands every page has live in js/site.js; here only what needs this page's demo widgets */
    if (cmdOff) cmdOff();
    cmdOff = P.CommandPalette.register([
      { id: 'toast', title: I.t('cmd.toast'), keywords: 'notification', run: function () { P.Toast.success(I.t('demo.hello')); } },
      { id: 'modal', title: I.t('cmd.modal'), run: function () { P.Modal.open('m1'); } }
    ]);
  }
  ['run', 'open', 'close'].forEach(function (n) {
    document.addEventListener('psy:command:' + n, function (e) { log('log-cmd', 'command:' + n + (e.detail && e.detail.command ? ' → ' + e.detail.command.id : '')); });
  });
  on('cmd-hl', 'change', function () { P.configure('command', { highlight: chk('cmd-hl') }); });
  on('cmd-add', 'click', function () { var n = ++cmdN; P.CommandPalette.register({ id: 'custom' + n, title: 'Custom command #' + n, group: I.t('cmd.g.custom'), run: function () { P.Toast.info('#' + n); } }); P.Toast.success('+ #' + n); });
  on('cmd-clear', 'click', function () { P.CommandPalette.clearRecent(); P.Toast.info(I.t('cmd.cleared')); });

  /* DataTable */
  function dtRows() {
    var t = P.DataTable.get('#demo-dt');
    if (!t) return;
    t.setRows(S.map(function (s, i) { var z = sizes[s[2]]; return [s[0], I.t('cat.' + s[1]), z ? (z.gzip / 1024).toFixed(2) : '—', s[4] ? '2.1' : i > 22 ? '2.0' : '1.x']; }));
  }
  ['sort', 'filter', 'page', 'export'].forEach(function (n) {
    document.addEventListener('psy:table:' + n, function (e) {
      var d = e.detail || {};
      log('log-dt', 'table:' + n + (n === 'sort' ? ' → col ' + d.column + ' ' + d.direction : n === 'page' ? ' → ' + d.page + '/' + d.pages : n === 'filter' ? ' → "' + (d.query || '') + '" (' + d.total + ')' : ''));
    });
  });
  on('dt-size', 'change', function () { var t = document.getElementById('demo-dt'); t.setAttribute('data-table-page-size', val('dt-size')); P.DataTable.get(t).page(1); P.DataTable.get(t).refresh(); });
  on('dt-csv', 'click', function () { P.DataTable.get('#demo-dt').download(); });

  /* Sortable */
  var SORT_IDS = ['Tabs', 'Modal', 'Toast', 'Carousel', 'Compare'];
  function sortBuild() {
    var ul = document.getElementById('demo-sort');
    ul.textContent = '';
    SORT_IDS.forEach(function (n) {
      var li = document.createElement('li'), g = document.createElement('i'), t = document.createElement('span');
      li.dataset.id = n; g.className = 'psy-ico psy-ico--grip grip'; g.setAttribute('aria-label', I.t('d.sort.grip') + ' ' + n); t.textContent = n;
      li.appendChild(g); li.appendChild(t); ul.appendChild(li);
    });
    if (P.Sortable.get(ul)) P.Sortable.get(ul).refresh(); else P.Sortable.init(ul.parentNode);
  }
  document.addEventListener('psy:sortable:end', function (e) { document.getElementById('sort-out').textContent = e.detail.order.join(' → '); });
  on('sort-axis', 'change', function () { var ul = document.getElementById('demo-sort'); ul.setAttribute('data-sortable-axis', val('sort-axis')); P.Sortable.get(ul).refresh(); });
  on('sort-reset', 'click', function () { P.Sortable.get('#demo-sort').setOrder(SORT_IDS); document.getElementById('sort-out').textContent = '—'; });

  /* SafeHTML */
  var SAMPLE = '<b onclick="alert(1)">bold</b> <script>alert(2)<' + '/script><img src=x onerror=alert(3)> <a href="javascript:alert(4)">bad link</a> <a href="https://example.com" target="_blank">ok link</a> <iframe src="//evil.example"></iframe> <p style="position:fixed;inset:0">styled</p> <svg onload=alert(5)></svg>';
  function safe() {
    var o = { images: chk('safe-img'), links: chk('safe-links') }, v = val('safe-in');
    P.Sanitize.set(document.getElementById('safe-out'), v, o);
    document.getElementById('safe-code').textContent = P.Sanitize.html(v, o);
    var st = P.Sanitize.last();
    document.getElementById('safe-stat').textContent = I.t('d.safe.stat', { a: st.removed, b: st.attributes });
  }
  document.getElementById('safe-in').value = SAMPLE;
  ['safe-in', 'safe-img', 'safe-links'].forEach(function (id) { on(id, id === 'safe-in' ? 'input' : 'change', safe); });

  /* ---------- customizer ---------- */
  /* Every preset passes WCAG 2.2 AA for body text, muted text, accent, text on primary and text on every pastel card. */
  var PRESETS = {
    lofi: {
      light: { bg: '#fdf6ee', solid: '#fffdf8', text: '#2a2040', muted: '#5a4e73', line: '#d9c9e8', ink: '#46366a', accent: '#6a46c8', primary: '#cdbcff', onPrimary: '#251a4a', lav: '#e3d9ff', mint: '#c4efe0', pink: '#ffd0e0', peach: '#ffdfc2', sky: '#cde6ff', butter: '#fff0b0' },
      dark: { bg: '#1b1729', solid: '#282240', text: '#f7f2ff', muted: '#cdc3e6', line: '#4f4572', ink: '#c9b9fa', accent: '#d6caff', primary: '#c4b0ff', onPrimary: '#1f1540', lav: '#41366d', mint: '#2a5a50', pink: '#68384f', peach: '#6a4a33', sky: '#345a82', butter: '#6d6230' }
    },
    ocean: {
      light: { bg: '#eef7ff', solid: '#fbfdff', text: '#12263f', muted: '#3f5875', ink: '#1f4d7a', accent: '#1b6fd1', primary: '#a8d1ff', onPrimary: '#0e2a4a', lav: '#d6e8ff', mint: '#bff0e6', pink: '#ffd3e2', peach: '#ffe2c4', sky: '#bfe3ff', butter: '#fff3b8', line: '#c5d8ee' },
      dark: { bg: '#0f1b2b', solid: '#172a42', text: '#eaf4ff', muted: '#b7cde6', ink: '#8ec2ff', accent: '#a9d3ff', primary: '#7fb8ff', onPrimary: '#0b1d33', lav: '#23406a', mint: '#1f5a55', pink: '#5e3a52', peach: '#5f4a35', sky: '#2a5a8a', butter: '#5f5a30', line: '#33507a' }
    },
    forest: {
      light: { bg: '#f2f7ec', solid: '#fcfef8', text: '#1d2e1d', muted: '#4b5f48', ink: '#2f5a35', accent: '#237a3c', primary: '#b5e2a8', onPrimary: '#12301a', lav: '#dcecc9', mint: '#c4f0d8', pink: '#ffd9d0', peach: '#ffe6c2', sky: '#cfe9ee', butter: '#f7f0b0', line: '#cfdcc4' },
      dark: { bg: '#121c14', solid: '#1c2b1f', text: '#eef8ea', muted: '#bcd2b8', ink: '#9bd89a', accent: '#b4e6a8', primary: '#8fcf86', onPrimary: '#10240f', lav: '#2c4a30', mint: '#1f5a45', pink: '#5a3a3a', peach: '#5a4a2e', sky: '#2a4f5a', butter: '#5a5a2a', line: '#3a5a40' }
    },
    sunset: {
      light: { bg: '#fff3ec', solid: '#fffaf6', text: '#3a1c26', muted: '#6b4350', ink: '#7a2e48', accent: '#c0245a', primary: '#ffb3c7', onPrimary: '#3d0f20', lav: '#ffd9e4', mint: '#ffe9b8', pink: '#ffc2d1', peach: '#ffd2b0', sky: '#ffdbe9', butter: '#ffe99a', line: '#efcdd5' },
      dark: { bg: '#25121b', solid: '#351a27', text: '#fff0f4', muted: '#e6c3cf', ink: '#ff9fb9', accent: '#ffb3c9', primary: '#ff8fb0', onPrimary: '#3b0d1d', lav: '#5a2a40', mint: '#5a4a2a', pink: '#7a3350', peach: '#6e4430', sky: '#5a3250', butter: '#6e5a2a', line: '#6a3347' }
    },
    mono: {
      light: { bg: '#f4f4f4', solid: '#ffffff', text: '#111111', muted: '#444444', ink: '#111111', accent: '#111111', primary: '#d9d9d9', onPrimary: '#111111', lav: '#e6e6e6', mint: '#ececec', pink: '#e0e0e0', peach: '#eaeaea', sky: '#dedede', butter: '#f0f0f0', line: '#cfcfcf' },
      dark: { bg: '#111111', solid: '#1c1c1c', text: '#f4f4f4', muted: '#c4c4c4', ink: '#eeeeee', accent: '#ffffff', primary: '#dddddd', onPrimary: '#111111', lav: '#333333', mint: '#3a3a3a', pink: '#2e2e2e', peach: '#383838', sky: '#303030', butter: '#3c3c3c', line: '#4a4a4a' }
    },
    slate: {
      light: { bg: '#f6f7f9', solid: '#ffffff', text: '#0f172a', muted: '#475569', line: '#d5dbe4', ink: '#1e293b', accent: '#2563eb', primary: '#bfd3ff', onPrimary: '#0b1b3d', lav: '#e0e7ff', mint: '#d1fae5', pink: '#fce7f3', peach: '#ffedd5', sky: '#dbeafe', butter: '#fef9c3' },
      dark: { bg: '#0b1220', solid: '#131c2e', text: '#e8eefb', muted: '#a9b7d0', line: '#2a3752', ink: '#9db4e0', accent: '#8fb4ff', primary: '#7aa2ff', onPrimary: '#08142e', lav: '#1f2c4d', mint: '#14463b', pink: '#4a2a40', peach: '#4d3a26', sky: '#1d3b63', butter: '#4a4524' }
    },
    contrast: {
      light: { bg: '#ffffff', solid: '#ffffff', text: '#000000', muted: '#1f1f1f', line: '#000000', ink: '#000000', accent: '#0033cc', primary: '#ffe14d', onPrimary: '#000000', lav: '#e6e0ff', mint: '#c9f5e3', pink: '#ffd6e5', peach: '#ffe0bf', sky: '#cfe8ff', butter: '#fff3a6' },
      dark: { bg: '#000000', solid: '#0a0a0a', text: '#ffffff', muted: '#e6e6e6', line: '#ffffff', ink: '#ffffff', accent: '#ffd84d', primary: '#ffd84d', onPrimary: '#000000', lav: '#2b2b6b', mint: '#0f5a3f', pink: '#7a1f4a', peach: '#6e3b00', sky: '#0b4a8a', butter: '#5a4d00' }
    }
  };
  var GROUPS = [['surface', ['bg', 'solid']], ['text', ['text', 'muted', 'line', 'ink']], ['brand', ['accent', 'primary', 'onPrimary']], ['palette', ['lav', 'mint', 'pink', 'peach', 'sky', 'butter']]];
  var SHADOWS = { hard: '3px 3px 0 var(--psy-ink)', soft: '0 6px 16px color-mix(in srgb,var(--psy-ink) 35%,transparent)', big: '6px 6px 0 var(--psy-ink)', none: 'none' };
  var FONTS = {
    nunito: '"Nunito","SF Pro Rounded",ui-rounded,system-ui,sans-serif',
    system: 'system-ui,-apple-system,"Segoe UI",sans-serif',
    serif: 'Georgia,"Times New Roman",serif',
    mono: 'ui-monospace,SFMono-Regular,Menlo,monospace'
  };
  var CZ = { preset: 'lofi', fmt: 'js' };
  var CSSNAME = { onPrimary: 'on-primary', shadow: 'sh', border: 'bw' };
  function cssName(k) { return '--psy-' + (CSSNAME[k] || k.replace(/[A-Z]/g, function (m) { return '-' + m.toLowerCase(); })); }
  function tok(k) { return getComputedStyle(document.documentElement).getPropertyValue(cssName(k)).trim(); }
  function mode() { return P.Theme.get(); }

  /* colour maths (WCAG 2.x relative luminance) */
  function hex(v) {
    v = (v || '').trim();
    if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(v)) return '#' + v.slice(1).split('').map(function (c) { return c + c; }).join('').toLowerCase();
    var m = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(v);
    if (m) return '#' + [m[1], m[2], m[3]].map(function (n) { return ('0' + (+n).toString(16)).slice(-2); }).join('');
    return '#000000';
  }
  function lum(h) {
    var c = [1, 3, 5].map(function (i) { var x = parseInt(h.substr(i, 2), 16) / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function readable(bg) { return ratio(bg, '#14102a') >= ratio(bg, '#ffffff') ? '#14102a' : '#ffffff'; }

  /* --- presets --- */
  function dots() {
    $$('[data-preset]').forEach(function (b) {
      var p = PRESETS[b.dataset.preset], t = p && p[mode()], d = $('.dots', b);
      if (!t || !d) return;
      if (!d.children.length) for (var i = 0; i < 5; i++) d.appendChild(document.createElement('i'));
      ['bg', 'primary', 'accent', 'mint', 'pink'].forEach(function (k, i) { d.children[i].style.background = t[k]; });
      b.setAttribute('aria-pressed', b.dataset.preset === CZ.preset ? 'true' : 'false');
    });
  }
  function applyPreset(name) {
    P.resetTokens();
    if (name !== 'lofi' && PRESETS[name]) P.setTokens(PRESETS[name]);
    CZ.preset = name;
    czRefresh();
  }

  /* --- colours --- */
  function setColor(k, v) {
    var t = {}, m = mode();
    t[m] = {}; t[m][k] = v;
    if (k === 'primary') t[m].onPrimary = readable(v);   /* keep text on the primary colour readable */
    P.setTokens(t);
    CZ.preset = '';
    czRefresh(k);
  }
  function swatches(keep) {
    var box = document.getElementById('swatches');
    if (!box) return;
    if (!box._built || box._lang !== I.lang) {
      box._built = true; box._lang = I.lang;
      box.textContent = '';
      GROUPS.forEach(function (g) {
        var fs = document.createElement('fieldset'), lg = document.createElement('legend'), grid = document.createElement('div');
        fs.className = 'swg'; grid.className = 'swatches';
        lg.textContent = I.t('cz.g.' + g[0]);
        fs.appendChild(lg); fs.appendChild(grid);
        g[1].forEach(function (k) {
          var w = document.createElement('div'), c = document.createElement('input'), t = document.createElement('span'), n = document.createElement('span'), h = document.createElement('input'), nm = I.t('cz.c.' + k);
          w.className = 'sw';
          c.type = 'color'; c.dataset.k = k; c.setAttribute('aria-label', nm);
          n.textContent = nm;
          h.type = 'text'; h.className = 'hx'; h.dataset.k = k; h.maxLength = 7; h.spellcheck = false; h.autocomplete = 'off';
          h.setAttribute('aria-label', nm + ' (hex)');
          t.appendChild(n); t.appendChild(h); w.appendChild(c); w.appendChild(t); grid.appendChild(w);
        });
        box.appendChild(fs);
      });
    }
    $$('.sw', box).forEach(function (w) {
      var c = $('input[type=color]', w), h = $('.hx', w), k = c.dataset.k;
      if (keep === k && document.activeElement === h) return;   /* do not fight the user while typing a hex value */
      var v = hex(tok(k));
      c.value = v; h.value = v; h.removeAttribute('aria-invalid');
    });
  }
  document.addEventListener('input', function (e) {
    var el = e.target, k = el.dataset && el.dataset.k;
    if (!k || !el.closest('#swatches')) return;
    if (el.type === 'color') { setColor(k, el.value); return; }
    var v = el.value.trim();
    if (v && v.charAt(0) !== '#') v = '#' + v;
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) { el.removeAttribute('aria-invalid'); setColor(k, hex(v)); }
    else el.setAttribute('aria-invalid', 'true');
  });

  /* --- accessibility report: contrast of the pairs the components actually use --- */
  var PAIRS = [['text', 'bg', 4.5, 0], ['muted', 'bg', 4.5, 0], ['accent', 'bg', 4.5, 0], ['onPrimary', 'primary', 4.5, 0], ['ink', 'bg', 3, 1]];
  function a11y() {
    var ul = document.getElementById('cz-a11y');
    if (!ul) return;
    ul.textContent = '';
    PAIRS.forEach(function (p) {
      var f = hex(tok(p[0])), b = hex(tok(p[1])), r = ratio(f, b), li = document.createElement('li'), aa = document.createElement('span'), nm = document.createElement('span'), rt = document.createElement('span'), gd = document.createElement('span'), g, c;
      if (r >= 7 && !p[3]) { g = 'AAA'; c = 'ok'; }
      else if (r >= p[2]) { g = 'AA'; c = 'ok'; }
      else if (!p[3] && r >= 3) { g = I.t('cz.g.large'); c = 'mid'; }
      else { g = I.t('cz.g.fail'); c = 'bad'; }
      aa.className = 'aa'; aa.textContent = 'Aa'; aa.style.color = f; aa.style.background = b;
      nm.className = 'nm'; nm.textContent = I.t('cz.pair.' + p[0]);
      rt.className = 'rt'; rt.textContent = r.toFixed(2) + ':1';
      gd.className = 'gd ' + c; gd.textContent = g;
      li.appendChild(aa); li.appendChild(nm); li.appendChild(rt); li.appendChild(gd);
      ul.appendChild(li);
    });
  }

  /* --- shape & type --- */
  function seg(id, attr, cur) {
    $$('#' + id + ' button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset[attr] === cur ? 'true' : 'false'); });
  }
  function norm(s) { return String(s).replace(/["\s]/g, ''); }
  function shapeUI() {
    var r = parseInt(tok('radius'), 10), bw = parseInt(tok('border'), 10), sh = tok('shadow'), ft = tok('font');
    if (!isNaN(r)) { document.getElementById('cz-radius').value = r; document.getElementById('cz-radius-v').textContent = r + 'px'; }
    if (!isNaN(bw)) { document.getElementById('cz-bw').value = bw; document.getElementById('cz-bw-v').textContent = bw + 'px'; }
    seg('cz-shadow', 'shadow', Object.keys(SHADOWS).filter(function (k) { return norm(SHADOWS[k]) === norm(sh); })[0] || 'hard');
    seg('cz-font', 'font', Object.keys(FONTS).filter(function (k) { return norm(FONTS[k]) === norm(ft); })[0] || 'nunito');
  }
  function flat(o) { P.setTokens(o); czRefresh(); }
  on('cz-radius', 'input', function () { flat({ radius: val('cz-radius') + 'px' }); });
  on('cz-bw', 'input', function () { flat({ border: val('cz-bw') + 'px' }); });
  document.addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('#cz-shadow button'))) flat({ shadow: SHADOWS[b.dataset.shadow] });
    else if ((b = e.target.closest('#cz-font button'))) flat({ font: FONTS[b.dataset.font] });
    else if ((b = e.target.closest('#cz-fmt button'))) { CZ.fmt = b.dataset.fmt; seg('cz-fmt', 'fmt', CZ.fmt); code(); }
    else if ((b = e.target.closest('[data-preset]'))) applyPreset(b.dataset.preset);
  });
  on('cz-save', 'click', function () { P.setTokens({}, { save: true }); P.Toast.success(I.t('cz.saved')); });
  on('cz-reset', 'click', function () { P.resetTokens(); G = {}; CZ.preset = 'lofi'; czRefresh(); });

  /* --- import --- */
  on('cz-apply', 'click', function () {
    var msg = document.getElementById('cz-msg'), raw = val('cz-import').trim(), m = /^PsyScripts\.configure\(([\s\S]*)\);?$/.exec(raw), o;
    msg.textContent = '';
    try {
      o = JSON.parse(m ? m[1] : raw);
      if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error('shape');
    } catch (err) { msg.textContent = I.t('cz.import.err'); return; }
    if (o.tokens) { P.configure(o); Object.keys(o).forEach(function (k) { if (k !== 'tokens' && o[k] && typeof o[k] === 'object') G[k] = Object.assign(G[k] || {}, o[k]); }); }
    else P.setTokens(o);
    CZ.preset = '';
    czRefresh();
    P.Toast.success(I.t('cz.applied'));
  });

  /* --- everything that depends on the current tokens/theme --- */
  function czRefresh(keep) { swatches(keep); shapeUI(); dots(); a11y(); code(); }
  P.on('theme:change', function () { setTimeout(czRefresh, 30); });

  /* global config playground */
  var G = {};
  function cfg(name, o) { G[name] = Object.assign(G[name] || {}, o); P.configure(name, o); code(); }
  on('g-toast-pos', 'change', function () { cfg('toast', { position: val('g-toast-pos') }); P.Toast.show(I.t('demo.hello'), { type: 'info' }); });
  on('g-toast-dur', 'input', function () { document.getElementById('g-toast-dur-v').textContent = val('g-toast-dur'); cfg('toast', { duration: +val('g-toast-dur') }); });
  on('g-newest', 'change', function () { cfg('toast', { newestOnTop: chk('g-newest') }); });
  on('g-tip', 'change', function () { cfg('tooltip', { placement: val('g-tip') }); });
  on('g-rev', 'input', function () { document.getElementById('g-rev-v').textContent = val('g-rev'); cfg('reveal', { distance: +val('g-rev') }); });
  on('g-modal', 'change', function () { cfg('modal', { closeOnBackdrop: chk('g-modal') }); });
  on('g-menu', 'change', function () { cfg('menu', { hideOnScroll: chk('g-menu') }); });

  /* export: JS configure() call, plain CSS custom properties, or JSON */
  function code() {
    var o = Object.assign({}, G), t = P.getTokens(), tk = Object.assign({}, t.base), c = $('#cz-code code'), out;
    Object.keys(t.themes).forEach(function (k) { tk[k] = t.themes[k]; });
    if (Object.keys(tk).length) o.tokens = tk;
    var empty = !Object.keys(o).length;
    if (CZ.fmt === 'css') {
      var rule = function (sel, d) { var k = Object.keys(d); return k.length ? sel + ' {\n' + k.map(function (x) { return '  ' + cssName(x) + ': ' + d[x] + ';'; }).join('\n') + '\n}' : ''; };
      out = [rule(':root', t.base)].concat(Object.keys(t.themes).map(function (k) { return rule('[data-theme="' + k + '"]', t.themes[k]); })).filter(Boolean).join('\n\n');
      if (!out) out = '/* ' + I.t('cz.empty.css') + ' */';
    } else if (CZ.fmt === 'json') {
      out = empty ? '{}' : JSON.stringify(o, null, 2);
    } else {
      out = empty ? '// PsyScripts.configure({ toast: {…}, tokens: {…} })' : 'PsyScripts.configure(' + JSON.stringify(o, null, 2) + ');';
    }
    c.textContent = out;
  }

  /* event log: every PsyScripts event in one place */
  var quiet = { 'progress:change': 1, 'tooltip:show': 1, 'tokens': 1, 'config': 1 };
  P.on('*', function (name, d) {
    if (quiet[name]) return;
    var hint = d && (d.type || d.index != null && '#' + d.index || d.value != null && d.value || d.theme || d.id || '');
    log('log-all', name + (hint !== '' && hint !== false ? ' → ' + hint : ''));
  });
  on('log-clear', 'click', function () { document.getElementById('log-all').textContent = ''; });

  /* ---------- language-dependent bits ---------- */
  document.addEventListener('psy:lang', function () {
    filters(); cards(); cookieOut(); cmdSetup(); dtRows(); sortBuild(); safe(); czRefresh();
    var tw = P.Typewriter.get('#hero-tw'), words = I.t('hero.words');
    if (tw && words.indexOf('|') > -1) tw.set(words.split('|'));
    I.apply(document.getElementById('plural-out').parentNode);
  });
  document.addEventListener('DOMContentLoaded', function () { czRefresh(); filters(); });
  P.Sanitize && document.addEventListener('DOMContentLoaded', function () { if (I.has && I.has('cmd.theme')) { cmdSetup(); } });
})();
