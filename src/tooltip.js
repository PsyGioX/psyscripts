/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { placement: 'top', offset: 10, delay: 0, hideDelay: 0, maxWidth: 240 };
  (P.q = P.q || []).push(['tooltip', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('tooltip', k, DEF[k], el, 'tooltip') : DEF[k]; }
  var tip, cur, st, ht;

  function place(el) {
    var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, off = O('offset', el), pl = O('placement', el), pad = 8;
    if (pl === 'auto') pl = r.top - h - off < pad ? 'bottom' : 'top';
    if (pl === 'top' && r.top - h - off < pad) pl = 'bottom';
    else if (pl === 'bottom' && r.bottom + h + off > innerHeight - pad) pl = 'top';
    else if (pl === 'left' && r.left - w - off < pad) pl = 'right';
    else if (pl === 'right' && r.right + w + off > innerWidth - pad) pl = 'left';
    var x, y;
    if (pl === 'left' || pl === 'right') {
      x = pl === 'left' ? r.left - w - off : r.right + off;
      y = r.top + r.height / 2 - h / 2;
    } else {
      x = r.left + r.width / 2 - w / 2;
      y = pl === 'top' ? r.top - h - off : r.bottom + off;
    }
    x = Math.max(pad, Math.min(innerWidth - w - pad, x));
    y = Math.max(pad, Math.min(innerHeight - h - pad, y));
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
    tip.setAttribute('data-placement', pl);
  }
  function show(el) {
    var t = el.dataset.tooltip;
    if (!t) return;
    clearTimeout(ht);
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'psy-tooltip';
      tip.id = 'psy-tip';
      tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
    }
    if (cur && cur !== el) cur.removeAttribute('aria-describedby');
    cur = el;
    tip.textContent = t;
    tip.style.maxWidth = O('maxWidth', el) + 'px';
    tip.classList.add('is-in');
    place(el);
    el.setAttribute('aria-describedby', 'psy-tip');
    if (P.emit) P.emit('tooltip:show', { element: el, text: t }, el);
  }
  function hide() {
    clearTimeout(st);
    tip && tip.classList.remove('is-in');
    cur && cur.removeAttribute('aria-describedby');
    cur = null;
  }
  P.Tooltip = {
    show: show,
    hide: hide,
    set: function (el, text) { el.dataset.tooltip = text; if (cur === el) show(el); }
  };

  ['mouseover', 'focusin'].forEach(function (n) {
    document.addEventListener(n, function (e) {
      var el = e.target.closest && e.target.closest('[data-tooltip]');
      if (!el || el === cur) return;
      clearTimeout(st);
      var d = O('delay', el);
      d ? (st = setTimeout(function () { show(el); }, d)) : show(el);
    });
  });
  ['mouseout', 'focusout'].forEach(function (n) {
    document.addEventListener(n, function (e) {
      var el = e.target.closest && e.target.closest('[data-tooltip]');
      if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
      clearTimeout(st);
      var d = O('hideDelay', el);
      d ? (ht = setTimeout(hide, d)) : hide();
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  addEventListener('scroll', hide, { passive: true });
})();
