/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = { position: 50, orientation: 'horizontal', hover: false, step: 5, labels: '', label: 'Comparison slider' };
  (P.q = P.q || []).push(['compare', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('compare', k, DEF[k], el, 'compare') : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }
  function all(r, sel) {
    r = r || document;
    var a = [].slice.call(r.querySelectorAll(sel));
    if (r.matches && r.matches(sel)) a.unshift(r);
    return a;
  }

  function build(el) {
    if (el._cp) return el._cp;
    var vertical = O('orientation', el) === 'vertical', pos = +O('position', el), dragging = false;
    var handle = document.createElement('div');
    handle.className = 'psy-compare__handle';
    handle.tabIndex = 0;
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', O('label', el));
    handle.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
    handle.setAttribute('aria-valuemin', 0);
    handle.setAttribute('aria-valuemax', 100);
    var kh = '<span class="psy-compare__knob"><i class="psy-ico psy-ico--' + (vertical ? 'arrows-v' : 'arrows-h') + '" aria-hidden="true"></i></span>';
    if (P.html) P.html(handle, kh); else handle.innerHTML = kh;
    el.appendChild(handle);
    el.classList.add('psy-compare');
    el.classList.toggle('is-vertical', vertical);

    var labs = String(O('labels', el) || '').split('|');
    if (labs[0]) {
      labs.slice(0, 2).forEach(function (t, i) {
        var s = document.createElement('span');
        s.className = 'psy-compare__label psy-compare__label--' + (i ? 'after' : 'before');
        s.textContent = t;
        s.setAttribute('aria-hidden', 'true');
        el.appendChild(s);
      });
    }

    function set(v, silent) {
      pos = Math.max(0, Math.min(100, v));
      el.style.setProperty('--psy-pos', pos + '%');
      handle.setAttribute('aria-valuenow', Math.round(pos));
      if (!silent) E('compare:change', { element: el, value: pos }, el);
    }
    function fromPointer(e) {
      var r = el.getBoundingClientRect();
      set(vertical ? (e.clientY - r.top) / r.height * 100 : (e.clientX - r.left) / r.width * 100);
    }
    function down(e) {
      if (e.button) return;
      dragging = true;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
      fromPointer(e);
    }
    function move(e) {
      if (dragging || (O('hover', el) && e.pointerType === 'mouse')) fromPointer(e);
    }
    function up(e) {
      dragging = false;
      el.classList.remove('is-dragging');
      el.releasePointerCapture && el.hasPointerCapture && el.hasPointerCapture(e.pointerId) && el.releasePointerCapture(e.pointerId);
    }
    function key(e) {
      var s = O('step', el), d = 0;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d = s;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d = -s;
      else if (e.key === 'PageUp') d = 10;
      else if (e.key === 'PageDown') d = -10;
      else if (e.key === 'Home') { e.preventDefault(); set(0); return; }
      else if (e.key === 'End') { e.preventDefault(); set(100); return; }
      if (!d) return;
      e.preventDefault();
      set(pos + d);
    }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    handle.addEventListener('keydown', key);
    [].forEach.call(el.querySelectorAll('img'), function (i) { i.draggable = false; });
    set(pos, true);

    return el._cp = {
      el: el,
      set: function (v) { set(v); },
      get: function () { return pos; },
      destroy: function () {
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        handle.remove();
        el._cp = null;
      }
    };
  }

  P.Compare = {
    init: function (r) { return all(r, '[data-compare]').map(build); },
    get: function (el) { return (typeof el === 'string' ? document.querySelector(el) : el)._cp || null; },
    destroy: function (r) { all(r, '[data-compare]').forEach(function (e) { e._cp && e._cp.destroy(); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Compare.init(); });
})();
