/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { timeout: 1600, copied: '', toast: false, toastText: 'Copied', errorText: 'Copy failed', trim: true };
  (P.q = P.q || []).push(['copy', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('copy', k, DEF[k], el, 'copy') : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }

  function copy(t) {
    if (navigator.clipboard && isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (ok, no) {
      var a = document.createElement('textarea');
      a.value = t;
      a.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(a);
      a.select();
      try { document.execCommand('copy') ? ok() : no(); } catch (e) { no(e); }
      a.remove();
    });
  }
  P.copy = copy;

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy],[data-copy-target]');
    if (!b) return;
    var el = b.dataset.copyTarget && (P.sel ? P.sel(b.dataset.copyTarget) : null);
    var t = el ? (el.value || el.textContent) : b.dataset.copy;
    if (t == null) return;
    if (O('trim', b)) t = t.trim();
    if (!E('copy:before', { text: t, button: b }, b)) return;
    copy(t).then(function () {
      /* the button's own nodes are kept and restored; labels are only ever set as text */
      if (b._o == null) b._o = [].slice.call(b.childNodes);
      var label = b.dataset.copied != null && b.dataset.copied !== '' ? b.dataset.copied : O('copied', b);
      b.textContent = '';
      if (label) b.appendChild(document.createTextNode(label));
      else {
        var ic = document.createElement('i'), sr = document.createElement('span');
        ic.className = 'psy-ico psy-ico--check'; ic.setAttribute('aria-hidden', 'true');
        sr.className = 'psy-sr'; sr.textContent = O('toastText', b);
        b.appendChild(ic); b.appendChild(sr);
      }
      b.classList.add('is-copied');
      clearTimeout(b._t);
      b._t = setTimeout(function () { b.textContent = ''; (b._o || []).forEach(function (n) { b.appendChild(n); }); b._o = null; b.classList.remove('is-copied'); }, O('timeout', b));
      var wantToast = b.hasAttribute('data-copy-toast') || O('toast', b);
      if (P.Toast && wantToast) P.Toast.show(b.dataset.copyToast || O('toastText', b), { type: 'success' });
      E('copy:done', { text: t, button: b }, b);
    }, function (err) {
      if (P.Toast) P.Toast.show(O('errorText', b), { type: 'error' });
      E('copy:error', { text: t, button: b, error: err }, b);
    });
  });
})();
