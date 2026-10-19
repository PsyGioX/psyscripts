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
    var el = b.dataset.copyTarget && document.querySelector(b.dataset.copyTarget);
    var t = el ? (el.value || el.textContent) : b.dataset.copy;
    if (t == null) return;
    if (O('trim', b)) t = t.trim();
    if (!E('copy:before', { text: t, button: b }, b)) return;
    copy(t).then(function () {
      if (b._o == null) b._o = b.innerHTML;
      var label = b.dataset.copied != null && b.dataset.copied !== '' ? b.dataset.copied : O('copied', b);
      if (label) b.textContent = label;
      else b.innerHTML = '<i class="psy-ico psy-ico--check" aria-hidden="true"></i><span class="psy-sr">' + (O('toastText', b)) + '</span>';
      b.classList.add('is-copied');
      clearTimeout(b._t);
      b._t = setTimeout(function () { b.innerHTML = b._o; b._o = null; b.classList.remove('is-copied'); }, O('timeout', b));
      var wantToast = b.hasAttribute('data-copy-toast') || O('toast', b);
      if (P.Toast && wantToast) P.Toast.show(b.dataset.copyToast || O('toastText', b), { type: 'success' });
      E('copy:done', { text: t, button: b }, b);
    }, function (err) {
      if (P.Toast) P.Toast.show(O('errorText', b), { type: 'error' });
      E('copy:error', { text: t, button: b, error: err }, b);
    });
  });
})();
