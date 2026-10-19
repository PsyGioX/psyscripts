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

  /* ---------- catalog of scripts ---------- */
  var S = [
    ['Tabs', 'nav', 'data-tabs · data-tab · data-panel'],
    ['ThemeSwitcher', 'sys', 'data-theme-toggle · data-theme-set'],
    ['HeaderMenu', 'nav', 'data-header · data-menu-toggle'],
    ['CopyButton', 'data', 'data-copy="text" / data-copy-target="#id"'],
    ['ScrollReveal', 'media', 'data-reveal="left" data-reveal-delay="100"'],
    ['Accordion', 'nav', 'data-accordion data-single'],
    ['Modal', 'overlay', 'data-modal-open="id" · Modal.confirm()'],
    ['Toast', 'overlay', 'Toast.success("Hi", {position:"top-center"})'],
    ['BackToTop', 'nav', 'data-back-top'],
    ['LazyImages', 'media', '<img data-src="a.jpg"> · data-bg'],
    ['Dropdown', 'nav', 'data-dropdown · data-open-on-hover'],
    ['Tooltip', 'overlay', 'data-tooltip="Text" data-tooltip-placement'],
    ['Counter', 'data', 'data-counter="1200" data-suffix="+"'],
    ['Carousel', 'media', 'data-carousel data-per-view="3"'],
    ['FormValidation', 'data', '<form data-validate> · data-rule · data-match'],
    ['ScrollSpy', 'nav', 'data-spy on <nav>'],
    ['StickyTOC', 'nav', 'data-toc data-toc-source="#post"'],
    ['Marquee', 'media', 'data-marquee data-speed="30"'],
    ['ImageLightbox', 'overlay', 'data-lightbox · data-full="big.jpg"'],
    ['Parallax', 'media', 'data-parallax="0.2"'],
    ['CookieBanner', 'overlay', 'data-cookie-banner · data-cookie-category'],
    ['Skeleton', 'media', 'data-skeleton · Skeleton.done(el)'],
    ['I18n', 'sys', 'data-i18n="key" · data-lang-toggle'],
    ['Typewriter', 'media', 'data-typewriter="One|Two|Three"', 1],
    ['Countdown', 'data', 'data-countdown="2027-01-01T00:00"', 1],
    ['ScrollProgress', 'data', 'data-progress data-progress-target="#post"', 1],
    ['CompareSlider', 'media', 'data-compare · data-compare-labels="A|B"', 1]
  ];
  var CATS = ['all', 'nav', 'overlay', 'media', 'data', 'sys'], cat = 'all';

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function cards() {
    var box = document.getElementById('cards');
    box.innerHTML = S.map(function (s, i) {
      return '<article class="card" data-cat="' + s[1] + '" data-reveal data-reveal-delay="' + (i % 3) * 80 + '"><h3><span>' + s[0] +
        (s[3] ? '<span class="new">' + I.t('badge.new') + '</span>' : '') + '</span><span class="n">' + String(i + 1).padStart(2, '0') +
        '</span></h3><p>' + I.t('card.' + s[0]) + '</p><pre><code>' + esc(s[2]) + '</code></pre></article>';
    }).join('');
    P.Reveal.init(box);
    filter();
  }
  function filters() {
    var f = document.getElementById('filters');
    f.innerHTML = CATS.map(function (c) {
      return '<button class="chip" data-f="' + c + '" aria-pressed="' + (c === cat) + '">' + I.t('cat.' + c) + '</button>';
    }).join('');
  }
  function filter() {
    $$('#cards .card').forEach(function (c) { c.hidden = cat !== 'all' && c.dataset.cat !== cat; });
    $$('#filters .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === cat); });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('#filters .chip');
    if (b) { cat = b.dataset.f; filter(); }
  });

  /* ---------- static bits that must exist before DOMContentLoaded ---------- */
  (function () {
    var y = new Date().getFullYear() + 1;
    document.getElementById('cd-ny').setAttribute('data-countdown', y + '-01-01T00:00:00');
    var h = [262, 190, 330, 45, 150, 20];
    document.getElementById('gal').innerHTML = h.map(function (c, i) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(' + c + ',80%,62%)"/><stop offset="1" stop-color="hsl(' + (c + 60) + ',80%,42%)"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><text x="400" y="330" font-size="120" font-family="sans-serif" font-weight="800" text-anchor="middle" fill="#fff" fill-opacity=".85">' + (i + 1) + '</text></svg>';
      return '<img alt="Image ' + (i + 1) + '" tabindex="0" src="data:image/svg+xml,' + encodeURIComponent(svg) + '">';
    }).join('');
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

  /* ---------- customizer ---------- */
  var COLORS = ['bg', 'solid', 'text', 'muted', 'ink', 'accent', 'primary', 'lav', 'mint', 'pink', 'peach', 'sky', 'butter'];
  var PRESETS = {
    ocean: {
      light: { bg: '#eef7ff', solid: '#fbfdff', text: '#12263f', muted: '#3f5875', ink: '#1f4d7a', accent: '#1b6fd1', primary: '#a8d1ff', onPrimary: '#0e2a4a', lav: '#d6e8ff', mint: '#bff0e6', pink: '#ffd3e2', peach: '#ffe2c4', sky: '#bfe3ff', butter: '#fff3b8' },
      dark: { bg: '#0f1b2b', solid: '#172a42', text: '#eaf4ff', muted: '#b7cde6', ink: '#8ec2ff', accent: '#a9d3ff', primary: '#7fb8ff', onPrimary: '#0b1d33', lav: '#23406a', mint: '#1f5a55', pink: '#5e3a52', peach: '#5f4a35', sky: '#2a5a8a', butter: '#5f5a30' }
    },
    forest: {
      light: { bg: '#f2f7ec', solid: '#fcfef8', text: '#1d2e1d', muted: '#4b5f48', ink: '#2f5a35', accent: '#2f8a4a', primary: '#b5e2a8', onPrimary: '#12301a', lav: '#dcecc9', mint: '#c4f0d8', pink: '#ffd9d0', peach: '#ffe6c2', sky: '#cfe9ee', butter: '#f7f0b0' },
      dark: { bg: '#121c14', solid: '#1c2b1f', text: '#eef8ea', muted: '#bcd2b8', ink: '#9bd89a', accent: '#b4e6a8', primary: '#8fcf86', onPrimary: '#10240f', lav: '#2c4a30', mint: '#1f5a45', pink: '#5a3a3a', peach: '#5a4a2e', sky: '#2a4f5a', butter: '#5a5a2a' }
    },
    sunset: {
      light: { bg: '#fff3ec', solid: '#fffaf6', text: '#3a1c26', muted: '#6b4350', ink: '#7a2e48', accent: '#d6336c', primary: '#ffb3c7', onPrimary: '#3d0f20', lav: '#ffd9e4', mint: '#ffe9b8', pink: '#ffc2d1', peach: '#ffd2b0', sky: '#ffdbe9', butter: '#ffe99a' },
      dark: { bg: '#25121b', solid: '#351a27', text: '#fff0f4', muted: '#e6c3cf', ink: '#ff9fb9', accent: '#ffb3c9', primary: '#ff8fb0', onPrimary: '#3b0d1d', lav: '#5a2a40', mint: '#5a4a2a', pink: '#7a3350', peach: '#6e4430', sky: '#5a3250', butter: '#6e5a2a' }
    },
    mono: {
      light: { bg: '#f4f4f4', solid: '#ffffff', text: '#111111', muted: '#444444', ink: '#111111', accent: '#111111', primary: '#d9d9d9', onPrimary: '#111111', lav: '#e6e6e6', mint: '#ececec', pink: '#e0e0e0', peach: '#eaeaea', sky: '#dedede', butter: '#f0f0f0' },
      dark: { bg: '#111111', solid: '#1c1c1c', text: '#f4f4f4', muted: '#c4c4c4', ink: '#eeeeee', accent: '#ffffff', primary: '#dddddd', onPrimary: '#111111', lav: '#333333', mint: '#3a3a3a', pink: '#2e2e2e', peach: '#383838', sky: '#303030', butter: '#3c3c3c' }
    }
  };
  function hex(v) {
    v = (v || '').trim();
    if (/^#[0-9a-f]{6}$/i.test(v)) return v;
    if (/^#[0-9a-f]{3}$/i.test(v)) return '#' + v.slice(1).split('').map(function (c) { return c + c; }).join('');
    return '#000000';
  }
  function swatches() {
    var cs = getComputedStyle(document.documentElement);
    var box = document.getElementById('swatches');
    if (!box.children.length) {
      box.innerHTML = COLORS.map(function (k) { return '<label>' + k + '<input type="color" data-k="' + k + '"></label>'; }).join('');
      box.addEventListener('input', function (e) {
        var k = e.target.dataset.k;
        if (!k) return;
        var t = {};
        t[P.Theme.get()] = {}; t[P.Theme.get()][k] = e.target.value;
        if (k === 'primary') t[P.Theme.get()].onPrimary = e.target.value;
        P.setTokens(t);
        code();
      });
    }
    $$('input', box).forEach(function (i) { i.value = hex(cs.getPropertyValue('--psy-' + i.dataset.k)); });
  }
  function flat(o) { P.setTokens(o); code(); }
  on('cz-radius', 'input', function () { document.getElementById('cz-radius-v').textContent = val('cz-radius') + 'px'; flat({ radius: val('cz-radius') + 'px' }); });
  on('cz-bw', 'input', function () { document.getElementById('cz-bw-v').textContent = val('cz-bw') + 'px'; flat({ border: val('cz-bw') + 'px' }); });
  on('cz-shadow', 'change', function () { flat({ shadow: val('cz-shadow') }); });
  on('cz-font', 'change', function () { flat({ font: val('cz-font') }); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-preset]');
    if (!b) return;
    P.resetTokens();
    var p = PRESETS[b.dataset.preset];
    if (p) P.setTokens(p);
    ['cz-radius', 'cz-bw'].forEach(function (id) { document.getElementById(id).value = id === 'cz-radius' ? 18 : 2; });
    swatches();
    code();
  });
  on('cz-save', 'click', function () { P.setTokens({}, { save: true }); P.Toast.success(I.t('cz.saved')); });
  on('cz-reset', 'click', function () { P.resetTokens(); swatches(); code(); });
  P.on('theme:change', function () { setTimeout(swatches, 30); });

  /* global config playground */
  var G = {};
  function cfg(name, o) { G[name] = Object.assign(G[name] || {}, o); P.configure(name, o); code(); }
  on('g-toast-pos', 'change', function () { cfg('toast', { position: val('g-toast-pos') }); P.Toast.show(I.t('demo.hello'), { type: 'info' }); });
  on('g-toast-dur', 'input', function () { document.getElementById('g-toast-dur-v').textContent = val('g-toast-dur'); cfg('toast', { duration: +val('g-toast-dur') }); });
  on('g-newest', 'change', function () { cfg('toast', { newestOnTop: chk('g-newest') }); });
  on('g-tip', 'change', function () { cfg('tooltip', { placement: val('g-tip') }); });
  on('g-rev', 'input', function () { document.getElementById('g-rev-v').textContent = val('g-rev'); cfg('reveal', { distance: +val('g-rev') }); });
  on('g-modal', 'change', function () { cfg('modal', { closeOnBackdrop: chk('g-modal') }); });
  function code() {
    var o = Object.assign({}, G), t = P.getTokens(), tk = Object.assign({}, t.base);
    Object.keys(t.themes).forEach(function (k) { tk[k] = t.themes[k]; });
    if (Object.keys(tk).length) o.tokens = tk;
    var c = $('#cz-code code');
    c.textContent = Object.keys(o).length ? 'PsyScripts.configure(' + JSON.stringify(o, null, 2) + ');' : '// PsyScripts.configure({ toast: {…}, tokens: {…} })';
  }

  /* event log: every PsyScripts event in one place */
  var quiet = { 'progress:change': 1, 'tooltip:show': 1, 'tokens': 1, 'config': 1 };
  P.on('*', function (name, d) {
    if (quiet[name]) return;
    var hint = d && (d.type || d.index != null && '#' + d.index || d.value != null && d.value || d.theme || d.id || '');
    log('log-all', name + (hint !== '' && hint !== false ? ' → ' + hint : ''));
  });
  on('log-clear', 'click', function () { document.getElementById('log-all').innerHTML = ''; });

  /* ---------- language-dependent bits ---------- */
  document.addEventListener('psy:lang', function () {
    filters(); cards(); cookieOut();
    var tw = P.Typewriter.get('#hero-tw'), words = I.t('hero.words');
    if (tw && words.indexOf('|') > -1) tw.set(words.split('|'));
    I.apply(document.getElementById('plural-out').parentNode);
  });
  document.addEventListener('DOMContentLoaded', function () { swatches(); code(); filters(); });
})();
