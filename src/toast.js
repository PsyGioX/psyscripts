/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    position: 'top-right', duration: 3000, max: 5, dismissOnClick: true, pauseOnHover: true,
    progress: true, icon: true, closeButton: false, newestOnTop: false, closeLabel: 'Close', className: ''
  };
  (P.q = P.q || []).push(['toast', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('toast', k, DEF[k], el, 'toast') : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }

  var boxes = {};
  function box(pos) {
    if (boxes[pos] && boxes[pos].isConnected) return boxes[pos];
    var b = document.createElement('div');
    b.className = 'psy-toasts psy-toasts--' + pos;
    b.setAttribute('role', 'region');
    b.setAttribute('aria-live', 'polite');
    document.body.appendChild(b);
    return boxes[pos] = b;
  }

  function dismiss(t, now) {
    if (!t || t._gone) return;
    t._gone = 1;
    clearTimeout(t._tm);
    t.classList.remove('is-in');
    setTimeout(function () { t.remove(); E('toast:hide', { element: t }); }, now ? 0 : 250);
  }

  function show(msg, o) {
    o = o || {};
    var pos = o.position || O('position');
    var dur = o.duration != null ? o.duration : O('duration');
    var type = o.type || 'info';
    if (!E('toast:show', { message: msg, type: type, options: o })) return null;

    var b = box(pos), max = O('max');
    while (max && b.children.length >= max) {
      dismiss(O('newestOnTop') ? b.lastElementChild : b.firstElementChild, true);
      b.removeChild(O('newestOnTop') ? b.lastElementChild : b.firstElementChild);
    }

    var t = document.createElement('div');
    t.className = 'psy-toast psy-toast--' + type + (O('icon') && o.icon !== false ? ' has-icon' : '') + ' ' + (o.className || O('className') || '');
    if (type === 'error' || type === 'warning') t.setAttribute('role', 'alert');

    var body = document.createElement('div');
    body.className = 'psy-toast__body';
    if (o.title) {
      var h = document.createElement('strong');
      h.textContent = o.title;
      body.appendChild(h);
    }
    var p = document.createElement('span');
    p.textContent = msg;
    body.appendChild(p);
    t.appendChild(body);

    if (o.action && o.action.label) {
      var a = document.createElement('button');
      a.type = 'button';
      a.className = 'psy-toast__action';
      a.textContent = o.action.label;
      a.addEventListener('click', function (e) {
        e.stopPropagation();
        o.action.onClick && o.action.onClick(t);
        dismiss(t);
      });
      t.appendChild(a);
    }
    if (O('closeButton') || o.closeButton) {
      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'psy-toast__x';
      x.setAttribute('aria-label', O('closeLabel'));
      x.innerHTML = '<i class="psy-ico psy-ico--x" aria-hidden="true"></i>';
      x.addEventListener('click', function (e) { e.stopPropagation(); dismiss(t); });
      t.appendChild(x);
    }

    var left = dur, start = 0;
    if (dur > 0 && (O('progress') && o.progress !== false)) {
      var bar = document.createElement('i');
      bar.className = 'psy-toast__bar';
      bar.style.animationDuration = dur + 'ms';
      t.appendChild(bar);
    }
    function run() {
      if (!(dur > 0)) return;
      start = Date.now();
      t.classList.remove('is-paused');
      t._tm = setTimeout(function () { dismiss(t); }, left);
    }
    function pause() {
      if (!t._tm || t._gone) return;
      clearTimeout(t._tm);
      t._tm = 0;
      left -= Date.now() - start;
      t.classList.add('is-paused');
    }
    if (O('pauseOnHover')) {
      t.addEventListener('mouseenter', pause);
      t.addEventListener('mouseleave', function () { if (!t._gone && !t._tm) run(); });
      t.addEventListener('focusin', pause);
      t.addEventListener('focusout', function () { if (!t._gone && !t._tm) run(); });
    }
    if (O('dismissOnClick')) t.addEventListener('click', function () { dismiss(t); });
    t.dismiss = function () { dismiss(t); };

    if (O('newestOnTop')) b.insertBefore(t, b.firstChild); else b.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-in'); });
    run();
    return t;
  }

  P.Toast = {
    show: show,
    dismiss: function (t) { dismiss(t); },
    clear: function (pos) {
      Object.keys(boxes).forEach(function (k) {
        if (pos && k !== pos) return;
        [].slice.call(boxes[k].children).forEach(function (t) { dismiss(t); });
      });
    }
  };
  ['info', 'success', 'error', 'warning'].forEach(function (type) {
    P.Toast[type] = function (msg, o) { o = o || {}; o.type = type; return show(msg, o); };
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-toast]');
    if (!b) return;
    var d = b.dataset;
    show(d.toast, {
      type: d.toastType, title: d.toastTitle, position: d.toastPosition,
      duration: d.toastDuration != null ? +d.toastDuration : undefined
    });
  });
})();
