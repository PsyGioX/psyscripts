/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    closeOnBackdrop: true, closeOnEsc: true, lockScroll: true, returnFocus: true,
    okLabel: 'OK', cancelLabel: 'Cancel'
  };
  (P.q = P.q || []).push(['modal', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('modal', k, DEF[k], el) : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }

  var down = null, root = document.documentElement;
  function dlg(x) { return typeof x === 'string' ? document.getElementById(x) : x; }
  function unlock() { if (!document.querySelector('dialog[open]')) root.classList.remove('no-scroll'); }

  function wire(d) {
    if (d._m) return;
    d._m = 1;
    d.addEventListener('cancel', function (e) { if (!O('closeOnEsc', d)) e.preventDefault(); });
    d.addEventListener('close', function () {
      unlock();
      if (O('returnFocus', d) && d._from && d._from.focus) d._from.focus();
      E('modal:close', { modal: d, returnValue: d.returnValue }, d);
    });
  }

  function open(x, o) {
    var d = dlg(x);
    if (!d || d.open) return d;
    if (o) d._po = Object.assign(d._po || {}, o);
    if (!E('modal:open', { modal: d }, d)) return d;
    wire(d);
    d._from = document.activeElement;
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    if (O('lockScroll', d)) root.classList.add('no-scroll');
    return d;
  }
  function close(x, value) {
    var d = dlg(x);
    if (!d || !d.open) return d;
    if (d.close) d.close(value); else { d.removeAttribute('open'); d.dispatchEvent(new Event('close')); }
    unlock();
    return d;
  }

  function confirmDialog(o) {
    o = o || {};
    return new Promise(function (resolve) {
      var d = document.createElement('dialog');
      d.setAttribute('data-modal', '');
      d.setAttribute('aria-label', o.title || o.text || 'Dialog');
      var h = o.title ? '<h3 class="psy-modal__title"></h3>' : '';
      d.innerHTML = h + '<p class="psy-modal__text"></p><div class="psy-modal__actions"></div>';
      if (o.title) d.querySelector('h3').textContent = o.title;
      d.querySelector('p').textContent = o.text || '';
      var acts = d.querySelector('.psy-modal__actions');
      function btn(label, val, cls) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'psy-btn ' + (cls || '');
        b.textContent = label;
        b.onclick = function () { close(d, val); };
        acts.appendChild(b);
      }
      if (o.cancel !== false) btn(o.cancelLabel || O('cancelLabel'), 'cancel');
      btn(o.okLabel || O('okLabel'), 'ok', 'psy-btn--primary');
      document.body.appendChild(d);
      d.addEventListener('close', function () {
        var ok = d.returnValue === 'ok';
        setTimeout(function () { d.remove(); }, 0);
        resolve(ok);
      });
      open(d, o);
    });
  }

  P.Modal = {
    open: open,
    close: close,
    toggle: function (x) { var d = dlg(x); return d && d.open ? close(d) : open(d); },
    closeAll: function () { [].slice.call(document.querySelectorAll('dialog[open]')).forEach(function (d) { close(d); }); },
    confirm: confirmDialog
  };

  document.addEventListener('pointerdown', function (e) { down = e.target; }, true);
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-modal-open]');
    if (o) { open(o.dataset.modalOpen); return; }
    var c = e.target.closest('[data-modal-close]');
    if (c) { var cd = c.closest('dialog'); cd && close(cd, c.dataset.modalClose || ''); return; }
    var d = e.target;
    if (d.matches && d.matches('dialog[data-modal]') && d === down && O('closeOnBackdrop', d)) {
      var r = d.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) close(d);
    }
  });
})();
