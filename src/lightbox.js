/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    loop: true, closeOnBackdrop: true, keyboard: true, swipe: true, counter: true, preload: true,
    labelViewer: 'Image viewer', labelClose: 'Close', labelPrev: 'Previous', labelNext: 'Next'
  };
  (P.q = P.q || []).push(['lightbox', DEF]);
  function O(k) { return P.cfg ? P.cfg('lightbox', k, DEF[k]) : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }
  var ICON = function (n) { return '<i class="psy-ico psy-ico--' + n + '" aria-hidden="true"></i>'; };
  var dlg, imgs = [], i = 0, img, cap, cnt, x0 = null;
  function H(el, s) { return P.html ? P.html(el, s) : (el.innerHTML = s, el); }

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'psy-lightbox';
    H(dlg, '<button type="button" class="lb-x">' + ICON('x') + '</button><button type="button" class="lb-p">' + ICON('chevron-left') +
      '</button><img alt=""><button type="button" class="lb-n">' + ICON('chevron-right') + '</button><p class="lb-cap"></p><span class="lb-c"></span>');
    img = dlg.querySelector('img');
    cap = dlg.querySelector('.lb-cap');
    cnt = dlg.querySelector('.lb-c');
    document.body.appendChild(dlg);
    dlg.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b && b.classList.contains('lb-p')) go(i - 1);
      else if (b && b.classList.contains('lb-n')) go(i + 1);
      else if (b && b.classList.contains('lb-x')) close();
      else if (e.target === dlg && O('closeOnBackdrop')) close();
    });
    dlg.addEventListener('keydown', function (e) {
      if (!O('keyboard')) return;
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });
    img.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    img.addEventListener('pointerup', function (e) {
      if (x0 === null || !O('swipe')) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
    });
    dlg.addEventListener('close', function () {
      document.documentElement.classList.remove('no-scroll');
      E('lightbox:close', { index: i });
    });
  }
  /* only http(s), relative, blob: and data:image/* are ever assigned to the viewer */
  function src(s) {
    var u = s.dataset.full || s.currentSrc || s.src;
    return P.url ? P.url(u, { schemes: ['http:', 'https:', 'blob:', 'data:'] }) : u;
  }
  function go(n) {
    var len = imgs.length;
    if (!O('loop') && (n < 0 || n >= len)) return;
    i = (n + len) % len;
    var s = imgs[i];
    img.src = src(s) || '';
    img.alt = s.alt;
    cap.textContent = s.dataset.caption || s.alt;
    cap.hidden = !cap.textContent;
    cnt.textContent = (i + 1) + ' / ' + len;
    cnt.hidden = !O('counter') || len < 2;
    dlg.classList.toggle('single', len < 2);
    if (O('preload') && len > 1) {
      [i - 1, i + 1].forEach(function (k) { var p = imgs[(k + len) % len], u = p && src(p); if (u) new Image().src = u; });
    }
    E('lightbox:change', { index: i, image: s });
  }
  function close() { if (!dlg) return; dlg.close ? dlg.close() : dlg.removeAttribute('open'); }
  function open(list, n) {
    if (!dlg) build();
    dlg.setAttribute('aria-label', O('labelViewer'));
    dlg.querySelector('.lb-x').setAttribute('aria-label', O('labelClose'));
    dlg.querySelector('.lb-p').setAttribute('aria-label', O('labelPrev'));
    dlg.querySelector('.lb-n').setAttribute('aria-label', O('labelNext'));
    imgs = list;
    if (!E('lightbox:open', { index: n || 0, images: list })) return;
    go(n || 0);
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
    document.documentElement.classList.add('no-scroll');
  }

  P.Lightbox = {
    open: open,
    close: close,
    next: function () { go(i + 1); },
    prev: function () { go(i - 1); },
    init: function (r) {
      (r || document).querySelectorAll('[data-lightbox] img').forEach(function (m) {
        if (!m.hasAttribute('tabindex')) m.tabIndex = 0;
        m.setAttribute('role', 'button');
      });
    }
  };
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.matches || !t.matches('img')) return;
    var g = t.closest('[data-lightbox]');
    if (!g) return;
    var list = g === t ? [t] : [].slice.call(g.querySelectorAll('img'));
    open(list, list.indexOf(t));
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if ((e.key === 'Enter' || e.key === ' ') && t.matches && t.matches('[data-lightbox] img')) { e.preventDefault(); t.click(); }
  });
  document.addEventListener('DOMContentLoaded', function () { P.Lightbox.init(); });
})();
